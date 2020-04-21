from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.db import models

from .managers import ChannelManager


class Channel(AbstractBaseUser, PermissionsMixin):
    channel_id = models.CharField(
        _('username'),
        max_length=50,
        unique=True,
        error_messages={
            'unique': _("A user with that channel_id already exists."),
        },
    )

    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    USERNAME_FIELD = 'channel_id'

    objects = ChannelManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.channel_id

    def get_short_name(self):
        return self.channel_id

    def get_full_name(self):
        return self.channel_id
