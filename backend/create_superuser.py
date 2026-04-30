import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if os.environ.get("CREATE_SUPERUSER") == "true":
    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if username and password:
        user, created = User.objects.get_or_create(username=username)

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.role = "admin"
        user.set_password(password)
        user.save()

        print("Superuser créé ou mis à jour :", username)