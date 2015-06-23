import time

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.utils.html import strip_tags
from django.views.decorators.http import require_POST

from .models import Message
from .forms import MessageForm, RequestNewForm


SLEEP_SECONDS = 20


def index(request):
    """
    Renders the main template.
    """
    return render(request, 'index.html')


def _form_errors_to_httpresponse(form):
    """
    Converts an invalid form to a HttpResponse, where the errors are converted
    to a json string in the response.

    :param form: A form that failed validation.
    :returns: A django JsonResponse object, containing information about the
              failed validation.
    """
    # There might be a better way to do this, but giving the JSON string
    # directly to JsonResponse does not seem to work.
    return HttpResponse(form.errors.as_json(), status=400,
                        content_type='application/json')


@require_POST
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
    # Parse and validate input.
    form = MessageForm(request.POST)
    if not form.is_valid():
        return _form_errors_to_httpresponse(form)

    # Make the new message, and save it in the backend.
    msg = Message()
    msg.message = strip_tags(form.cleaned_data['message'])
    msg.username = strip_tags(form.cleaned_data['username'])
    msg.save()

    return HttpResponse('OK', content_type='text/plain; charset=UTF-8')


@require_POST
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
    form = RequestNewForm(request.POST)
    if not form.is_valid():
        return _form_errors_to_httpresponse(form)

    id = form.cleaned_data['id']
    for _ in range(SLEEP_SECONDS):
        # Query the backend for messages since "id".
        messages = Message.objects.new_messages(id)
        message_count = messages.count()

        # If no messages was found, sleep and try again.
        if message_count == 0:
            # If id is -1, this is the initial request, return immediately.
            if id == -1:
                return HttpResponse('OK', content_type='text/plain')
            time.sleep(1)
            continue

        # Never return more than 100 messages at once.
        if message_count > 100:
            messages = messages[message_count - 100:]

        # Convert the QuerySet to a dictlist.
        messages_dict = _convert_to_dictlist(messages)

        result = {
            'messages': messages_dict,
            'lastid': max([message.pk for message in messages]),
        }
        return JsonResponse(result)

    return HttpResponse('OK', content_type='text/plain')


def _convert_to_dictlist(messages):
    """
    Converts the messages given, to a dictlist.

    :param messages: The messages to convert, as a QuerySet or list.
    :returns: A list of dicts.
    """
    message_dict = []

    # Convert messages to a dict.
    for message in messages:
        message_dict.append({
            'id': message.pk,
            'username': message.username,
            'message': message.message,
            'timestamp': message.timestamp.isoformat(),
        })

    return message_dict
