"""typing_keeda URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from typing_keeda.views import home
from typing_keeda.views import register
from typing_keeda.views import user_login
from typing_keeda.views import index
from typing_keeda.views import sentence_enter
from typing_keeda.views import sentence_submit
from typing_keeda.views import user_history
from typing_keeda.views import user_logout
from typing_keeda.views import ajax_request
from typing_keeda.views import fb_login
from typing_keeda.views import tc
from typing_keeda.views import privacy_policy
from django.http import HttpResponse
from typing_keeda.views import share_photo
from typing_keeda.views import test_module
from typing_keeda.views import mobile
from typing_keeda.views import dashboard
from typing_keeda.views import g_login
from typing_keeda.views import feedback_mail
from typing_keeda.views import s_approve
from typing_keeda.views import s_reject

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$',index),
    url(r'^home/',home),
    url(r'^register/',register),
    url(r'^sentence_enter/',sentence_enter),
    url(r'^sentence_submit/',sentence_submit),
    url(r'^user_history/',user_history),
    url(r'^user/',user_login),
    url(r'^user_logout/',user_logout),
    url(r'^ajax_request/',ajax_request),
    url(r'^fb_login/',fb_login),
    url(r'^terms-and-conditions/',tc),
    url(r'^privacy-policy/',privacy_policy),
    url(r'^google075ed901cb28a2a5.html$', lambda r: HttpResponse("google-site-verification: google075ed901cb28a2a5.html")),
    url(r'^share_photo/',share_photo),
    url(r'^static/(?P<wow>\w+)',test_module),
    url(r'^mobile/',mobile),
    url(r'^dashboard/',dashboard),
    url(r'^g_login/',g_login),
    url(r'^feedback_mail/',feedback_mail),
    url(r'^sentence-approval/(?P<s_id>\d+)',s_approve),
    url(r'^sentence-reject/(?P<s_id>\d+)',s_reject)
]
