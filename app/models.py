from django.db import models


class Message(models.Model):
    message = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return '[%s, %s, %s]' % (self.pk, self.timestamp, self.message)