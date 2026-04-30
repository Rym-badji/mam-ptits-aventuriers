import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()


def create_superuser():
    if os.environ.get("CREATE_SUPERUSER") != "true":
        return

    from django.contrib.auth import get_user_model

    User = get_user_model()

    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not username or not password:
        return

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role="admin",
        )
        print("Superuser créé")
    else:
        user = User.objects.get(username=username)
        user.is_staff = True
        user.is_superuser = True
        user.role = "admin"
        user.set_password(password)
        user.save()
        print("Superuser mis à jour")


try:
    create_superuser()
except Exception as e:
    print("Erreur création superuser :", e)
