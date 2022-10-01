from django.contrib import admin
from django.urls import path, include
import music_music_app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('music_music_app.urls'))
]
