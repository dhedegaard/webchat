import cgi
import time
import json

from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from django.http import HttpResponseBadRequest, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from models import Message
from utils import render_jinja2_template


SLEEP_SECONDS = 20


@ensure_csrf_cookie
def index(request):
    """
    This just renders the main template, it might as well serve a static page.
    """
    env = {}
    env.update(csrf(request))
    return render_to_response('index.html', env)


def send(request):
    """
    This view is called when the client wants to send a message.

    POST-parameters are:
    message: The message to save.
    username: The username to save.

    If the message is saved successfully, 200 OK with a body containing 'OK'
    is returned.

    If it fails, a 400 Bad Request is returned, with a body describing the fault.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest('Only use POST method!')

    # Make sure to escape embedded HTML.
    message = cgi.escape(request.POST['message'])
    username = cgi.escape(request.POST['username'])

    if len(message) >= 512:
        return HttpResponseBadRequest('message too long (>=512)')

    if len(username) >= 32:
        return HttpResponseBadRequest('username too long (>=32)')

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

    The result of this method, when new messages are available is json similar to below:

    {
        messages: '<span>...</span>',
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
            messages = messages[len(messages) - 100:]

        # Render, assemble json and return the result.
        html_messages = render_jinja2_template('messages.html', messages=messages)
        result = {
            'messages': html_messages,
            'lastid': max([message.pk for message in messages]),
        }
        return HttpResponse(json.dumps(result), mimetype='application/json; charset=UTF-8')

    return HttpResponse('OK')