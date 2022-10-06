import requests
import pytube

from .models import Genre, Album, Artist, Song

BASE_URL = 'https://api.spotify.com/v1/'
BASE_URL_DOWNLOAD = 'https://open.spotify.com/track/'
CLIENT_ID = 'be2108011bf94d9a8346f07f0d9c5d3a'
CLIENT_SECRET = '6445e90e8e234273bc0e35246897e1df'


def get_spotify_token():
    request = requests.post(url='https://accounts.spotify.com/api/token',
                            data={'grant_type': 'client_credentials',
                                  'client_id': CLIENT_ID,
                                  'client_secret': CLIENT_SECRET}).json()

    return request['access_token']


def download_track(track_id=''):
    token = get_spotify_token()
    track_id = '6i0V12jOa3mr6uu4WYhUBr'
    request = requests.get(BASE_URL + 'tracks/' + track_id, headers={'Authorization': 'Bearer %s' % (token,)}).json()

    song = Song()
    if Song.objects.filter(spotify_id=request['id']):
        song = Song.objects.get(spotify_id=request['id'])
    song.name = request['name']
    song.spotify_id = request['id']
    if not Album.objects.filter(spotify_id=request['album']['id']):
        Album.objects.create(name=request['album']['name'], type=request['album']['album_type'],
                             total_songs=request['album']['total_tracks'],
                             release_date=request['album']['release_date'],
                             image_url=request['album']['images'][0]['url'],
                             spotify_id=request['album']['id'])
    song.save()
    song.album.add(Album.objects.get(spotify_id=request['album']['id']))

    for artist_in_request in request['artists']:
        request_artist = requests.get(BASE_URL + 'artists/' + artist_in_request['id'], headers={'Authorization': 'Bearer %s' % (token,)}).json()
        if not Artist.objects.filter(spotify_id=request_artist['id']):
            for artist_genre in request_artist['genres']:
                if not Genre.objects.filter(genre=artist_genre):
                    Genre.objects.create(genre=artist_genre)

            artist = Artist(name=request_artist['name'], image_url=request_artist['images'][0]['url'],
                            spotify_id=request_artist['id'])
            artist.save()

            for genre in request_artist['genres']:
                genre_instance = Genre.objects.get(genre=genre)
                artist.genres.add(genre_instance)
            artist.save()
        song.artist.add(Artist.objects.get(spotify_id=request_artist['id']))

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
