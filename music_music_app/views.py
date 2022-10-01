from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from .forms import LoginForm, CreateAccountForm


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = authenticate(request, username=form.cleaned_data['username'], password=form.cleaned_data['password'])
            if user is not None:
                login(request, user)
                return redirect('music_music_app:home')
            else:
                messages.warning(request, 'Credentials not found')
                return render(request, 'music_music_app/login.html', {'form': form})
        else:
            messages.warning(request, 'Enter valid credentials')
            return render(request, 'music_music_app/login.html', {'form': form})
    else:
        form = LoginForm()
        return render(request, 'music_music_app/login.html', {'form': form})


def create_account_view(request):
    if request.method == 'POST':
        form = CreateAccountForm(data=request.POST)
        if form.is_valid():
            User.objects.create_user(first_name=form.cleaned_data['first_name'],
                                     last_name=form.cleaned_data['last_name'],
                                     username=form.cleaned_data['username'],
                                     email=form.cleaned_data['email'],
                                     password=form.cleaned_data['password'])
            messages.success(request, 'Account created successfully')
            return redirect('music_music_app:login')
        else:
            return render(request, 'music_music_app/create_account.html', {'form': form})
    else:
        form = CreateAccountForm()
        return render(request, 'music_music_app/create_account.html', {'form': form})


def home_view(request):
    return render(request, 'music_music_app/home.html')
