from django.db import models


class Message(models.Model):
    """
    A model of a chat message, with a username, timestamp and a message.
    """
    username = models.CharField(max_length=32)
    message = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return '[%d, %s, %s, %s]' % (self.pk, self.timestamp, self.username, self.message)