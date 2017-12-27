from django.db import models


class MessageQuerySet(models.QuerySet):
    def new_messages(self, current_messageid):
        '''
        Returns a QuerySet of messages that are newer than the id given.

        :param current_messageid: The id to query by.
        :type current_messageid: int.
        :returns: A QuerySet of Message objects, the QuerySet may be empty.
        :rtype: MessageQuerySet.
        '''
        return self.filter(pk__gt=current_messageid).order_by('pk')


class Message(models.Model):
    """
    A model of a chat message, with a username, timestamp and a message.
    """
    objects = MessageQuerySet.as_manager()

    username = models.CharField(max_length=32)
    message = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return '%d, %s, %s, %s' % (  # pragma: nocover
            self.pk, self.timestamp,
            self.username, self.message,
        )
