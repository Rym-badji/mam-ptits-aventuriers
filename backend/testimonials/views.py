from rest_framework import viewsets, permissions
from .models import Testimonial
from .serializers import TestimonialSerializer
from staff.permissions import IsAssistantOrAdmin

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_published=True)
    serializer_class = TestimonialSerializer


class TestimonialAdminViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer
    permission_classes = [IsAssistantOrAdmin]