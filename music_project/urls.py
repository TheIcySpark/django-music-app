from django.urls import path, include
from rest_framework import routers

from music_music_app import views
from music_music_app.views import SongViewSet, GenreViewSet, ArtistViewSet, AlbumViewSet

router = routers.SimpleRouter()
router.register('genres', GenreViewSet)
router.register('artists', ArtistViewSet)
router.register('albums', AlbumViewSet)
router.register('songs', SongViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/song_audio_file/<int:song_id>', views.song_audio_file),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken'))
]
