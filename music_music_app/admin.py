from django.contrib import admin

from music_music_app.models import Song, Album, Artist, Genre

admin.site.register(Song)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Genre)

