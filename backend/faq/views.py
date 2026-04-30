from rest_framework import viewsets
from .models import FAQ
from .serializers import FAQSerializer
from staff.permissions import IsAssistantOrAdmin, IsAdminUserRole


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer


class FAQAdminViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all().order_by('order')
    serializer_class = FAQSerializer
    permission_classes = [IsAssistantOrAdmin]

    def get_permissions(self):
        if self.action == "destroy":
            return [IsAdminUserRole()]
        return [IsAssistantOrAdmin()]