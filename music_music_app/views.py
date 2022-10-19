import json

from django.contrib.auth.models import User
from django.http import FileResponse, HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view

from music_music_app.models import Song, Genre, Artist, Album, Playlist, UserData
from music_music_app.serializers import SongSerializer, GenreSerializer, ArtistSerializer, AlbumSerializer, \
    PlaylistSerializer, UserDataSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class UserDataViewSet(viewsets.ModelViewSet):
    queryset = UserData.objects.all()
    serializer_class = UserDataSerializer


@api_view(['POST'])
def create_user_view(request):
    body = json.loads(request.body.decode('utf-8'))
    user = User.objects.create_user(body['username'], body['email'], body['password'])
    user.save()
    user_data = UserData(user=user)
    user_data.save()
    return HttpResponse('')


def song_audio_file(request, song_id):
    song = Song.objects.get(id=song_id)
    file = open(song.audio, 'rb')
    response = FileResponse(file)
    response['Accept-Ranges'] = 'bytes'
    return response
