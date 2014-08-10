from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^$', 'webchat.views.index', name='index'),
    url(r'^send$', 'webchat.views.send', name='send'),
    url(r'^get_new$', 'webchat.views.get_new', name='get_new'),
)
