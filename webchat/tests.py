import mock

from django.urls import reverse
from django.test import TestCase

from .models import Message


class ModelTestCase(TestCase):
    def test_get_new_messages(self):
        self.assertFalse(Message.objects.new_messages(0).exists())


class ViewTestCase(TestCase):
    def test_index(self):
        resp = self.client.get(reverse('index'))
        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, 'index.html')

    def test_send(self):
        resp = self.client.post(reverse('send'), {
            'username': 'testuser',
            'message': 'testmessage',
        })
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(Message.objects.count(), 1)
        msg = Message.objects.get()
        self.assertEqual(msg.username, 'testuser')
        self.assertEqual(msg.message, 'testmessage')
        self.assertIsNotNone(msg.timestamp)

    def test_send__invalid(self):
        resp = self.client.post(reverse('send'), {
            'username': 'testuser',
        })
        self.assertEqual(resp.status_code, 400)
        jsonresp = resp.json()
        self.assertTrue('message' in jsonresp)
        self.assertEqual(len(jsonresp['message']), 1)
        self.assertEqual(jsonresp['message'][0]['code'], 'required')

    @mock.patch('webchat.views.time')
    def test_get_new__no_messages(self, time_patch):
        resp = self.client.post(reverse('get_new'), {
            'id': -1,
        })
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {
            'lastid': -1,
            'messages': [],
        })

        self.assertEqual(time_patch.sleep.call_count, 20)
        time_patch.sleep.assert_called_with(1)

    def test_get_new__invalid(self):
        resp = self.client.post(reverse('get_new'))
        self.assertEqual(resp.status_code, 400)
        jsonresp = resp.json()
        self.assertTrue('id' in jsonresp)
        self.assertEqual(len(jsonresp['id']), 1)
        self.assertEqual(jsonresp['id'][0]['code'], 'required')

    @mock.patch('webchat.views.time')
    def test_get_new__non_existant(self, time_patch):
        resp = self.client.post(reverse('get_new'), {
            'id': 0,
        })
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {
            'lastid': -1,
            'messages': [],
        })
        self.assertEqual(resp['Content-Type'], 'application/json')
        self.assertEqual(time_patch.sleep.call_count, 20)
        time_patch.sleep.assert_called_with(1)

    def test_get_new__new_message(self):
        msg = Message.objects.create(
            message='testmessage',
            username='testuser',
        )
        resp = self.client.post(reverse('get_new'), {
            'id': 0,
        })
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp['Content-Type'], 'application/json')
        jsonresp = resp.json()
        self.assertEqual(jsonresp['lastid'], msg.pk)
        self.assertEqual(len(jsonresp['messages']), 1)
        self.assertEqual(jsonresp['messages'][0]['id'], msg.pk)
        self.assertEqual(jsonresp['messages'][0]['username'], 'testuser')
        self.assertEqual(jsonresp['messages'][0]['message'], 'testmessage')
        self.assertTrue('timestamp' in jsonresp['messages'][0])
