from rest_framework import serializers
from .models import Availability, Pricing, ContactRequest

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = '__all__'


class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricing
        fields = '__all__'


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = '__all__'

    def validate_email(self, value):
        if "@" not in value:
            raise serializers.ValidationError("Adresse email invalide.")
        return value

    def validate_hours_per_week(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le nombre d'heures doit être supérieur à 0.")
        return value

    def validate(self, attrs):
        if not attrs.get("rgpd_accepted"):
            raise serializers.ValidationError({
                "rgpd_accepted": "Le consentement RGPD est obligatoire."
            })
        return attrs