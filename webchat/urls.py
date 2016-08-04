from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^send$', views.send, name='send'),
    url(r'^get_new$', views.get_new, name='get_new'),
]