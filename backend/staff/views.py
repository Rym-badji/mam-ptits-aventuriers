from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AssistantProfile
from .serializers import AssistantProfileSerializer, UserSerializer

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class MyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AssistantProfileSerializer

    def get_object(self):
        return self.request.user.profile


class PublicAssistantListView(generics.ListAPIView):
    queryset = AssistantProfile.objects.filter(is_active_on_site=True)
    serializer_class = AssistantProfileSerializer
    permission_classes = [permissions.AllowAny]