import time
import json

from django.shortcuts import render_to_response
from django.http import HttpResponseBadRequest, HttpResponse

from models import Message


SLEEP_SECONDS = 20


def index(request):
    return render_to_response('index.html')


def send(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Only use POST method!')

    message = request.POST['message']
    print 'new message: %s' % message
    if len(message) >= 512:
        return HttpResponseBadRequest('message too long (>=512)')

    msg = Message()
    msg.message = message
    msg.save()

    return HttpResponse('OK')


def _format_messages(messages):
    result = []
    for message in messages:
        result.append({
            'id': message.pk,
            'time': message.timestamp.strftime('%y-%m-%d %H:%M:%S'),
            'message': message.message,
        })
    return HttpResponse(json.dumps(result), mimetype='application/json; charset=UTF-8')


def get_all(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST method!')

    # get the first 100 messages.
    messages = Message.objects.all().order_by('pk')[:100]

    return _format_messages(messages)


def get_new(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST method!')

    if 'id' not in request.POST:
        return HttpResponseBadRequest('No \'id\' parameter')

    _id = request.POST['id']
    for _ in xrange(SLEEP_SECONDS):
        messages = Message.objects.filter(pk__gt=_id).order_by('pk')
        if len(messages) > 0:
            return _format_messages(messages)
        time.sleep(1)

    return HttpResponse('OK')