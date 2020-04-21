from django.contrib import admin

from .models import AuthenticatedViewer, AnonymousViewer


admin.site.register(AuthenticatedViewer)
admin.site.register(AnonymousViewer)
