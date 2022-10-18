from django.http import FileResponse
from rest_framework import viewsets
from music_music_app.models import Song, Genre, Artist, Album
from music_music_app.serializers import SongSerializer, GenreSerializer, ArtistSerializer, AlbumSerializer


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


def song_audio_file(request, song_id):
    song = Song.objects.get(id=song_id)
    file = open(song.audio, 'rb')
    response = FileResponse(file)
    response['Accept-Ranges'] = 'bytes'
    return response

