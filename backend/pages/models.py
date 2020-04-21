from django.db import models
from django.contrib.postgres.fields import JSONField


class Page(models.Model):
    channel_id = models.CharField(max_length=32, db_index=True, unique=True)

    title = models.CharField(max_length=64)
    sections = JSONField(default=dict, blank=True)

    def __str__(self):
        return '{}: {}'.format(self.channel_id, self.title)
