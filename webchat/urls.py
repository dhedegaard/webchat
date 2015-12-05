from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^send$', views.send, name='send'),
    url(r'^get_new$', views.get_new, name='get_new'),
)
