from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'app.views.index'),
    url(r'^send$', 'app.views.send'),
    url(r'^get_all$', 'app.views.get_all'),
    url(r'^get_new$', 'app.views.get_new'),
    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
