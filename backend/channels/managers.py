from django.contrib.auth.models import UserManager


class ChannelManager(UserManager):
    def create_user(self, channel_id, password=None):
        if channel_id is None:
            raise TypeError('Users must have a channel_id.')

        user = self.model(channel_id=channel_id)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, channel_id, password):
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(channel_id, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user
