from django.conf.urls import url
from django.contrib import admin

from viewers.views import HasVisitedAPIView
from pages.views import PageAPIView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^visited/', HasVisitedAPIView.as_view()),
    url(r'^page/', PageAPIView.as_view()),
]
