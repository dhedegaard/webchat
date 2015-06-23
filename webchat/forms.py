from django import forms

from .models import Message


class MessageForm(forms.Form):
    '''
    Used for validating the send ajax request.
    '''
    message = forms.CharField(
        required=True, max_length=Message._meta.get_field('message').max_length)
    username = forms.CharField(
        required=True, max_length=Message._meta.get_field('username').max_length)


class RequestNewForm(forms.Form):
    '''
    Used for validating the get_new ajax request.
    '''
    id = forms.IntegerField(min_value=-1, required=True)