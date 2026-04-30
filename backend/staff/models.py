from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('assistante', 'Assistante maternelle'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='assistante')
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username


class AssistantProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name_display = models.CharField(max_length=100)
    last_name_display = models.CharField(max_length=100, blank=True, null=True)
    photo = models.ImageField(upload_to='assistantes/', blank=True, null=True)
    diplomas = models.TextField(blank=True, null=True)
    years_experience = models.PositiveIntegerField(default=0)
    short_bio = models.TextField(blank=True, null=True)
    educational_approach = models.TextField(blank=True, null=True)
    is_active_on_site = models.BooleanField(default=True)

    def __str__(self):
        return self.first_name_display