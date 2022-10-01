from django import forms
from django.contrib.auth.models import User


class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=150, widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(label='Password', max_length=128,
                               widget=forms.TextInput(attrs={'class': 'form-control', 'type': 'password'}))


class CreateAccountForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password']

        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.TextInput(attrs={'class': 'form-control'}),
            'password': forms.TextInput(attrs={'class': 'form-control', 'type': 'password'}),
        }

        help_texts = {
            'username': None
        }