import cgi
import time
import json

from django.core.context_processors import csrf
from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponse

from models import Message


SLEEP_SECONDS = 20


def index(request):
    """
    This just renders the main template, it might as well serve a static page.
    """
    env = {}
    env.update(csrf(request))
    return render(request, 'index.html', env)


def send(request):
    """
    This view is called when the client wants to send a message.

    POST-parameters are:
    message: The message to save.
    username: The username to save.

    If the message is saved successfully, 200 OK with a body containing 'OK'
    is returned.

    If it fails, a 400 Bad Request is returned, with a body describing the
    fault.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest('Only use POST method!')

    # Validate that arguments exist in the request.
    for arg in ('message', 'username', ):
        if not arg in request.POST:
            return HttpResponseBadRequest(
                'missing %s argument in request.' % arg)

    # Make sure to escape embedded HTML.
    message = cgi.escape(request.POST['message'])
    username = cgi.escape(request.POST['username'])

    MAX_MESSAGE_LENGTH = Message._meta.get_field('message').max_length
    MAX_USERNAME_LENGTH = Message._meta.get_field('username').max_length
    message_len = len(message)
    username_len = len(username)

    # Validate length higher than 0.
    if message_len == 0:
        return HttpResponseBadRequest('message argument is empty.')
    if username_len == 0:
        return HttpResponseBadRequest('username argument is empty.')

    # Validate length within model bounds.
    if message_len > MAX_MESSAGE_LENGTH:
        return HttpResponseBadRequest(
            'message too long (%s is higher than %s).' % (
                message_len, MAX_MESSAGE_LENGTH,
            ))
    if username_len > MAX_USERNAME_LENGTH:
        return HttpResponseBadRequest(
            'username too long (%s is higher then %s).' % (
                username_len, MAX_USERNAME_LENGTH,
            ))

    # Make the new message, and save it in the backend.
    msg = Message()
    msg.message = message
    msg.username = username
    msg.save()

    return HttpResponse('OK')


def get_new(request):
    """
    This method is called from the client when it wants to check if there are
    any new messages since the last message "id".

    The backend is checked every second for SLEEP_SECONDS. If there are no new
    messages in this interval, "OK" is returned and the client may initiate a
    new request.

    The result of this method, when new messages are available is json similar
    to below:

    {
        messages: [{...}, {...}, ...],
        lastid: 100
    }

    "message" contains HTML that can be injected into a textarea.
     "lastid" is the highest ID in the new message(s).
    """
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST method!')

    if 'id' not in request.POST:
        return HttpResponseBadRequest('No \'id\' parameter')

    _id = request.POST['id']
    for _ in xrange(SLEEP_SECONDS):
        # Query the backend for messages since "id".
        messages = Message.objects.filter(pk__gt=_id).order_by('pk')

        # If no messages was found, sleep and try again.
        if len(messages) == 0:
            time.sleep(1)
            continue

        # Never return more than 100 messages at once.
        if len(messages) > 100:
            messages = messages[messages.count()-100:]

        message_dict = []
        # Convert messages to a dict.
        for message in messages:
            message_dict.append({
                'id': message.pk,
                'username': message.username,
                'message': message.message,
                'timestamp': message.timestamp.isoformat(),
            })

        result = {
            'messages': message_dict,
            'lastid': max([message.pk for message in messages]),
        }
        return HttpResponse(json.dumps(result),
                            mimetype='application/json; charset=UTF-8')

    return HttpResponse('OK')
