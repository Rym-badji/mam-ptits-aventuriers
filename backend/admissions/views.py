from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Availability, Pricing, ContactRequest
from .serializers import AvailabilitySerializer, PricingSerializer, ContactRequestSerializer
from staff.permissions import IsAssistantOrAdmin

class AvailabilityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

class AvailabilityAdminViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all().order_by('start_date')
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAssistantOrAdmin]

    def get_permissions(self):
        if self.action == "destroy":
            from staff.permissions import IsAdminUserRole
            return [IsAdminUserRole()]
        return [IsAssistantOrAdmin()]

class PricingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pricing.objects.filter(is_active=True)
    serializer_class = PricingSerializer


class PricingAdminViewSet(viewsets.ModelViewSet):
    queryset = Pricing.objects.all().order_by('-id')
    serializer_class = PricingSerializer
    permission_classes = [IsAssistantOrAdmin]

    def get_permissions(self):
        if self.action == "destroy":
            from staff.permissions import IsAdminUserRole
            return [IsAdminUserRole()]
        return [IsAssistantOrAdmin()]


class ContactRequestViewSet(mixins.CreateModelMixin,
                            mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            viewsets.GenericViewSet):
    queryset = ContactRequest.objects.all().order_by('-created_at')
    serializer_class = ContactRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAssistantOrAdmin()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Mail à la MAM
        send_mail(
            subject="Nouvelle demande de pré-inscription",
            message=(
                f"Nouvelle demande de {instance.parent_first_name} {instance.parent_last_name}\n"
                f"Téléphone : {instance.phone}\n"
                f"Email : {instance.email}\n"
                f"Âge enfant : {instance.child_age}\n"
                f"Date souhaitée : {instance.desired_date}\n"
                f"Heures/semaine : {instance.hours_per_week}\n"
                f"Jours : {instance.requested_days}\n"
                f"Message : {instance.message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_NOTIFICATION_EMAIL],
            fail_silently=True,
        )

        # Mail au parent
        send_mail(
            subject="Confirmation de votre demande - M.A.M Des P'tits Aventuriers",
            message=(
                f"Bonjour {instance.parent_first_name},\n\n"
                "Nous avons bien reçu votre demande de pré-inscription/contact.\n"
                "Nous reviendrons vers vous dans les meilleurs délais.\n\n"
                "Cordialement,\n"
                "M.A.M Des P'tits Aventuriers"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=True,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)