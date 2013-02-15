from django.db import models


class Message(models.Model):
    username = models.CharField(max_length=32)
    message = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)