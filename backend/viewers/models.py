from django.db import models
from django.utils import timezone


class AuthenticatedViewer(models.Model):
    opaque_id = models.CharField(max_length=32)
    channel_id = models.CharField(max_length=32)

    def __str__(self):
        return self.opaque_id

    class Meta:
        unique_together = ('opaque_id', 'channel_id')


class AnonymousViewer(models.Model):
    ip_address = models.CharField(max_length=32)
    channel_id = models.CharField(max_length=32)
    recorded_at = models.DateTimeField()

    def __str__(self):
        return self.ip_address

    class Meta:
        unique_together = ('ip_address', 'channel_id')
