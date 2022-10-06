from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from music_music_app import views


urlpatterns = [
    path('admin/', admin.site.urls),
]
