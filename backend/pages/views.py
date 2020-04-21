import json

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
import requests

from common.jwt import get_jwt_payload, make_jwt_payload
from .models import Page
from .serializers import PageSerializer


def parse_clips(clips):
    ids = {
        url.replace(
            'https://www.twitch.tv/twitch_plays_itself/clip/', ''
        ).replace(
            'https://clips.twitch.tv/', ''
        ): clip
        for clip, url in clips['clips'].items()
    }

    id_strings = [
        'id={}'.format(id)
        for id in ids.keys()
    ]

    response = requests.get(
        'https://api.twitch.tv/helix/clips?{}'.format('&'.join(id_strings)),
        headers={
            'Client-Id': settings.TWITCH_CLIENT_ID
        },
    )

    data = response.json()['data']

    return {
        'type': 'clips',
        'clips': {
            ids[clip['id']]: {
                'url': clip['url'],
                'thumbnail_url': clip['thumbnail_url'],
            } for clip in data
        },
    }


class PageAPIView(APIView):
    def get(self, request, *args, **kwargs):
        payload = get_jwt_payload(request)
        channel_id = payload['channel_id']

        page = Page.objects.get(channel_id=channel_id)
        serializer = PageSerializer(page)

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        payload = get_jwt_payload(request)

        channel_id = payload['channel_id']
        role = payload['role']

        if role != 'broadcaster':
            raise AuthenticationFailed(
                detail='Only broadcasters may update their rundown'
            )

        data = {
            'title': request.data['title'],
            'sections': [
                section if section['type'] != 'clips' else parse_clips(section)
                for section in request.data['sections']
            ],
        }

        page, _ = Page.objects.get_or_create(channel_id=channel_id)
        serializer = PageSerializer(page, data=data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        token = make_jwt_payload(channel_id)

        data = {
            'content_type': "application/json",
            'message': json.dumps(serializer.data),
            'targets': ['broadcast']
        }

        requests.post(
            'https://api.twitch.tv/extensions/message/{}'.format(channel_id),
            data=data,
            headers={
                'Authorization': 'Bearer {}'.format(token),
                'Client-Id': settings.EXTENSION_CLIENT_ID,
            }
        )

        return Response(HTTP_204_NO_CONTENT)
