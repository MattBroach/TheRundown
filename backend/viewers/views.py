from datetime import timedelta

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from common.jwt import get_jwt_payload
from .models import AuthenticatedViewer, AnonymousViewer


class HasVisitedAPIView(APIView):
    def get(self, request, *args, **kwargs):
        payload = get_jwt_payload(request)
        opaque_id = payload['opaque_user_id']
        channel_id = payload['channel_id']

        # Any authenticated user that has made a request before has seen the overlay
        if opaque_id.startswith('U'):
            viewer, created = AuthenticatedViewer.objects.get_or_create(
                opaque_id=opaque_id, channel_id=channel_id
            )
            return Response({'has_viewed': not created or settings.ALWAYS_SHOW_OVERLAY})

        # Any anonymouse user is compared by ip and the week
        elif opaque_id.startswith('A'):
            ip = request.META.get('HTTP_X_REAL_IP', None)

            if ip is not None:
                viewer, created = AnonymouseViewer.objects.get_or_create(
                    ip_address=ip, channel_id=channel_id
                )
                last_observed = viewer.recorded_at

                if not created:
                    viewer.recorded_at = timezone.now()
                    viewer.save()

                return Response({
                    'has_viewed': (
                        last_observed > timezone.now() - timedelta(days=7) or
                        settings.ALWAYS_SHOW_OVERLAY
                    )
                })

        # Otherwise, something has gone wrong
        else:
            raise ValidationError('Invalid opaque_user_id')
