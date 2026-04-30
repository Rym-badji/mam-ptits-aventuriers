from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, AssistantProfile

@receiver(post_save, sender=User)
def create_or_update_assistant_profile(sender, instance, created, **kwargs):
    if created:
        AssistantProfile.objects.get_or_create(
            user=instance,
            defaults={
                "first_name_display": instance.first_name or instance.username
            }
        )
    else:
        AssistantProfile.objects.get_or_create(
            user=instance,
            defaults={
                "first_name_display": instance.first_name or instance.username
            }
        )