from django.contrib import admin
from .models import Availability, Pricing, ContactRequest

admin.site.register(Availability)
admin.site.register(Pricing)
admin.site.register(ContactRequest)