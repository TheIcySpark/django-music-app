from io import StringIO

from django.core.management import call_command
from django.test import TestCase


class DownloadTrack(TestCase):
    def test_download_track(self):
        out = StringIO()
        call_command('download_track', 'https://open.spotify.com/track/1cqeC89kF08QmcjZmYaTSv?si=921650b2c0a24c2e',
                     stdout=out)

        self.assertIn('Track id found', out.getvalue())
        self.assertIn('Valid spotify token', out.getvalue())
        self.assertIn('Data saved', out.getvalue())
        self.assertIn('Downloaded', out.getvalue())
