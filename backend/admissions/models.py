from django.db import models

class Availability(models.Model):
    age_group = models.CharField(max_length=100)
    available_places = models.PositiveIntegerField(default=0)
    start_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    is_waiting_list_open = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.age_group} - {self.available_places} place(s)"


class Pricing(models.Model):
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    maintenance_fee = models.DecimalField(max_digits=6, decimal_places=2, default=5.00)
    meal_fee = models.DecimalField(max_digits=6, decimal_places=2, default=5.00)
    payment_terms = models.TextField(blank=True, null=True)
    caf_info = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Tarif {self.hourly_rate} €/h"


class ContactRequest(models.Model):
    STATUS_CHOICES = (
        ('new', 'Nouvelle'),
        ('in_progress', 'En cours'),
        ('done', 'Traitée'),
    )

    parent_first_name = models.CharField(max_length=100)
    parent_last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    child_age = models.CharField(max_length=50)
    desired_date = models.DateField()
    hours_per_week = models.PositiveIntegerField()
    requested_days = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    rgpd_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')

    def __str__(self):
        return f"{self.parent_first_name} {self.parent_last_name}"