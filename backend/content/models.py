from django.db import models
from django.conf import settings

class Page(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    intro = models.TextField(blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Section(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='sections')
    title = models.CharField(max_length=150)
    slug = models.SlugField()
    content = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    editable_by_assistants = models.BooleanField(default=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.page.title} - {self.title}"


class SectionImage(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='sections/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    caption = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image {self.section.title}"