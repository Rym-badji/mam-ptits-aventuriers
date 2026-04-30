from django.db import models

class Testimonial(models.Model):
    parent_name = models.CharField(max_length=100)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.parent_name