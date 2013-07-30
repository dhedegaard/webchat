from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^$', 'app.views.index'),
    url(r'^send$', 'app.views.send'),
    url(r'^get_new$', 'app.views.get_new'),
)
