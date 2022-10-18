from django.db import models


class Genre(models.Model):
    genre = models.CharField(max_length=50)

    def __str__(self):
        return self.genre


class Artist(models.Model):
    genres = models.ManyToManyField(Genre)
    name = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500)
    spotify_id = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Album(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    total_songs = models.IntegerField()
    release_date = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500)
    spotify_id = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Song(models.Model):
    artist = models.ManyToManyField(Artist)
    album = models.ManyToManyField(Album)
    audio = models.CharField(max_length=250)
    name = models.CharField(max_length=100)
    spotify_id = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Playlist(models.Model):
    song = models.ManyToManyField(Song)
    name = models.CharField(max_length=100)


class UserData(models.Model):
    subscription_type = models.BooleanField(default=False)
    subscription_expiration_date = models.DateField()
    playlist_shortcuts = models.ManyToManyField(Playlist)


class SubscriptionCode(models.Model):
    code = models.CharField(max_length=50)
