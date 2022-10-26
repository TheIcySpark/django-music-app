from django.shortcuts import render


def index(request, *args, **kwargs):
    return render(request, 'music_music_frontend/index.html')