from rest_framework import serializers

from music_music_app.models import Genre, Artist, Album, Song


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class ArtistSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(many=True, required=False)

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


class SongFileSerializer(serializers.Serializer):
    file = serializers.FileField()
