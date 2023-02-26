import requests
import pytube
import os
from dotenv import load_dotenv

from django.core.management import BaseCommand
from music_music_app.models import Genre, Album, Artist, Song

load_dotenv()

BASE_URL = 'https://api.spotify.com/v1/'
BASE_URL_DOWNLOAD = 'https://open.spotify.com/track/'
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

def get_higher_resolution_image(request, section='', in_section=True):
    array = []
    if not in_section:
        array = request['images']
    else:
        array = request[section]['images']

    higher_resolution = 0
    higher_resolution_image_url = ''
    for image_data in array:
        if image_data['height'] > higher_resolution:
            higher_resolution_image_url = image_data['url']
            higher_resolution = image_data['height']
    return higher_resolution_image_url


class Command(BaseCommand):
    help = 'Download the song with the spotify id provided'

    def add_arguments(self, parser):
        parser.add_argument('track_url', type=str, help='Track spotify url')

    def handle(self, *args, **options):
        track_url: str = options['track_url']
        track_id: str = track_url.split('track/')[1].split('?')[0]
        self.stdout.write('Track id found')

        request = requests.post(url='https://accounts.spotify.com/api/token',
                                data={'grant_type': 'client_credentials',
                                      'client_id': CLIENT_ID,
                                      'client_secret': CLIENT_SECRET}).json()

        token = request['access_token']
        self.stdout.write('Valid spotify token')

        request = requests.get(BASE_URL + 'tracks/' + track_id,
                               headers={'Authorization': 'Bearer %s' % (token,)}).json()

        song = Song()
        if Song.objects.filter(spotify_id=request['id']):
            song = Song.objects.get(spotify_id=request['id'])
        song.name = request['name']
        song.spotify_id = request['id']
        if not Album.objects.filter(spotify_id=request['album']['id']):
            Album.objects.create(name=request['album']['name'], type=request['album']['album_type'],
                                 total_songs=request['album']['total_tracks'],
                                 release_date=request['album']['release_date'],
                                 image_url=get_higher_resolution_image(request, 'album'),
                                 spotify_id=request['album']['id'])
        song.save()
        song.album.add(Album.objects.get(spotify_id=request['album']['id']))

        for artist_in_request in request['artists']:
            request_artist = requests.get(BASE_URL + 'artists/' + artist_in_request['id'],
                                          headers={'Authorization': 'Bearer %s' % (token,)}).json()
            if not Artist.objects.filter(spotify_id=request_artist['id']):
                for artist_genre in request_artist['genres']:
                    if not Genre.objects.filter(genre=artist_genre):
                        Genre.objects.create(genre=artist_genre)

                artist = Artist(name=request_artist['name'],
                                image_url=get_higher_resolution_image(request_artist, in_section=False),
                                spotify_id=request_artist['id'])
                artist.save()

                for genre in request_artist['genres']:
                    genre_instance = Genre.objects.get(genre=genre)
                    artist.genres.add(genre_instance)
                artist.save()
            song.artist.add(Artist.objects.get(spotify_id=request_artist['id']))

        self.stdout.write('Data saved')
        song.save()

        search_youtube_text = song.name
        for artist_in_song in song.artist.all():
            search_youtube_text += ' ' + artist_in_song.name
        youtube_videos_list = pytube.Search(search_youtube_text + ' lyrics')
        youtube_object: pytube.YouTube = youtube_videos_list.results[0]
        stream = youtube_object.streams.filter(only_audio=True).order_by('abr').get_audio_only()
        stream.download(output_path='media/audio_files', filename=str(song.id) + '.mp3')
        song.audio = 'media/audio_files/' + str(song.id) + '.mp3'
        song.save()
        self.stdout.write('Downloaded')
