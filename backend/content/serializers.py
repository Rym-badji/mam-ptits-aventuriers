from rest_framework import serializers
from .models import Page, Section, SectionImage

class SectionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionImage
        fields = ['id', 'section', 'image', 'alt_text', 'caption', 'order']


class SectionSerializer(serializers.ModelSerializer):
    images = SectionImageSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = [
            'id',
            'page',
            'title',
            'slug',
            'content',
            'order',
            'editable_by_assistants',
            'updated_by',
            'updated_at',
            'images',
        ]
        read_only_fields = ['updated_by', 'updated_at']


class PageSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'intro', 'sections']