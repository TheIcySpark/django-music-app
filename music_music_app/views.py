import json

from django.contrib.auth.models import User
from django.http import FileResponse, HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

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

    def get_queryset(self):
        song_name = self.request.query_params.get('name', '')
        if song_name != '':
            return self.queryset.filter(name__icontains=song_name)
        else:
            return self.queryset


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

    def create(self, request, *args, **kwargs):
        body = json.loads(request.body.decode('utf-8'))
        playlist = Playlist(owner=request.user, name=body['name'], public=body['public'])
        playlist.save()
        return HttpResponse('')

    def list(self, request, *args, **kwargs):
        playlists = Playlist.objects.filter(owner=request.user)
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        song_name = self.request.query_params.get('name', '')
        songs = []
        if song_name != '':
            songs = Playlist.objects.get(id=pk).songs.filter(name__icontains=song_name)
        else:
            songs = Playlist.objects.get(id=pk).songs.all()
        page = self.paginate_queryset(songs)
        serializer = SongSerializer(songs, many=True)
        return self.get_paginated_response(serializer.data)


class PlaylistSongsViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class UserDataViewSet(viewsets.ModelViewSet):
    queryset = UserData.objects.all()
    serializer_class = UserDataSerializer


@api_view(['POST'])
def add_song_to_playlist(request):
    body = json.loads(request.body.decode('utf-8'))
    playlist = Playlist.objects.get(id=body['playlist_id'], owner=request.user)
    song = Song.objects.get(id=body['song_id'])
    playlist.songs.add(song)
    playlist.save()
    return HttpResponse('')


@api_view(['POST'])
def delete_song_from_playlist(request):
    body = json.loads(request.body.decode('utf-8'))
    playlist = Playlist.objects.get(id=body['playlist_id'], owner=request.user)
    song = Song.objects.get(id=body['song_id'])
    playlist.songs.remove(song)
    return HttpResponse('')


@api_view(['POST'])
def create_user_view(request):
    body = json.loads(request.body.decode('utf-8'))
    if body['password'] == '':
        return HttpResponse('', status=400)
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


def index(request):
    return render(request, 'index.html')
