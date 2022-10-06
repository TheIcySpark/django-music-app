from django.core.management import BaseCommand
import music_music_app.downloader as downloader


class Command(BaseCommand):
    def handle(self, *args, **options):
        downloader.download_track()
