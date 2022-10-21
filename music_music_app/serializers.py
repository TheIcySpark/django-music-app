from rest_framework import serializers

from music_music_app.models import Genre, Artist, Album, Song, UserData, Playlist


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class ArtistSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, required=False)

    class Meta:
        model = Artist
        fields = '__all__'


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class SongSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(many=True, required=False)
    album = AlbumSerializer(many=True, required=False)

    class Meta:
        model = Song
        fields = ('id', 'album', 'artist', 'name', 'spotify_id', 'audio')


class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, required=False)

    class Meta:
        model = Playlist
        fields = '__all__'


class UserDataSerializer(serializers.ModelSerializer):
    playlist_shortcuts = PlaylistSerializer(many=True, required=False)
    class Meta:
        model = UserData
        fields = '__all__'

