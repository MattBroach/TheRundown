from base64 import b64decode
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
import jwt


def get_jwt_payload(request):
    """
    Extracts the JWY payload from the request
    """
    authorization = request.headers.get('Authorization')
    token = authorization.replace('Bearer ', '')

    return jwt.decode(token, b64decode(settings.JWT_SECRET))


def make_jwt_payload(channel_id):
    payload = {
      "exp": round((timezone.now() + timedelta(minutes=120)).timestamp()),
      "role": "external",
      "channel_id": str(channel_id),
      "pubsub_perms": {
        "send":[
          "broadcast"
        ]
      }
    }

    return jwt.encode(payload, b64decode(settings.JWT_SECRET)).decode("utf-8")
