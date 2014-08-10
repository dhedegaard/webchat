from django.db import models


class Message(models.Model):
    """
    A model of a chat message, with a username, timestamp and a message.
    """
    username = models.CharField(max_length=32)
    message = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_new_messages(id):
        """
        Returns a QuerySet of messages that are newer than the id given.

        :param id: The id to query by.
        :returns: A QuerySet of Message objects, the QuerySet may be empty.
        """
        return Message.objects.filter(pk__gt=id).order_by('pk')


    def __unicode__(self):
        return '[%d, %s, %s, %s]' % (self.pk, self.timestamp, self.username, self.message)