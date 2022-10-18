import os

from django.core.management import BaseCommand

from music_music_app.models import Song


class Command(BaseCommand):
    help = 'Delete track from database and file .mp3'

    def add_arguments(self, parser):
        parser.add_argument('song_id', type=int, help='Song id from database')

    def handle(self, *args, **options):
        song = Song.objects.get(id=options['song_id'])
        if os.path.exists(song.audio):
            os.remove(song.audio)
            self.stdout.write('File deleted')
        song.delete()
        self.stdout.write('Related data deleted')
