# Generated by Django 4.1.1 on 2022-10-19 17:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('music_music_app', '0012_rename_song_playlist_songs_userdata_user_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdata',
            name='id',
        ),
        migrations.RemoveField(
            model_name='userdata',
            name='user',
        ),
        migrations.AddField(
            model_name='userdata',
            name='user',
            field=models.OneToOneField(default='', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
