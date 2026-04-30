from rest_framework import serializers
from .models import User, AssistantProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone']


class AssistantProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AssistantProfile
        fields = [
            'id',
            'user',
            'first_name_display',
            'last_name_display',
            'photo',
            'diplomas',
            'years_experience',
            'short_bio',
            'educational_approach',
            'is_active_on_site',
        ]