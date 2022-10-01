from django.urls import path
from . import views

app_name = 'music_music_app'
urlpatterns = [
    path('', views.login_view, name='login'),
    path('create_account/', views.create_account_view, name='create_account'),
    path('home/', views.home_view, name='home'),
]
