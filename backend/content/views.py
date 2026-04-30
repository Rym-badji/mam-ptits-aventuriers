from rest_framework import viewsets
from rest_framework.permissions import BasePermission
from .models import Page, Section, SectionImage
from .serializers import PageSerializer, SectionSerializer, SectionImageSerializer
from staff.permissions import IsAssistantOrAdmin, IsAdminUserRole
from django.db.models import F


class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    lookup_field = 'slug'

class SectionPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Admin et assistante peuvent voir, créer et modifier
        if view.action in ["list", "retrieve", "create", "update", "partial_update"]:
            return request.user.role in ["admin", "assistante"]

        # Seul admin peut supprimer
        if view.action == "destroy":
            return request.user.role == "admin"

        return False

class SectionAdminViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all().order_by('page', 'order')
    serializer_class = SectionSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAssistantOrAdmin()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAdminUserRole()]
        return [IsAssistantOrAdmin()]

    def perform_create(self, serializer):
        order = serializer.validated_data.get("order")
        page = serializer.validated_data.get("page")

        if order:
            Section.objects.filter(
                page=page,
                order__gte=order
            ).update(order=F("order") + 1)

        serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()
        new_order = serializer.validated_data.get("order")
        page = instance.page

        if new_order and new_order != instance.order:
            Section.objects.filter(
                page=page,
                order__gte=new_order
            ).exclude(id=instance.id).update(order=F("order") + 1)

        serializer.save()


class SectionImageAdminViewSet(viewsets.ModelViewSet):
    queryset = SectionImage.objects.all().order_by('order')
    serializer_class = SectionImageSerializer
    permission_classes = [IsAssistantOrAdmin]