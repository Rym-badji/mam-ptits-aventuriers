from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AssistantProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Rôle personnalisé", {
            "fields": ("role", "phone"),
        }),
    )

    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "is_staff",
        "is_superuser",
    )


@admin.register(AssistantProfile)
class AssistantProfileAdmin(admin.ModelAdmin):
    list_display = (
        "first_name_display",
        "last_name_display",
        "user",
        "years_experience",
        "is_active_on_site",
    )
