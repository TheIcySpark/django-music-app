# Generated by Django 4.1.1 on 2022-10-06 13:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music_music_app', '0007_remove_genre_spotify_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='album',
            old_name='image',
            new_name='image_url',
        ),
        migrations.RenameField(
            model_name='artist',
            old_name='image',
            new_name='image_url',
        ),
    ]
