from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from content.views import PageViewSet, SectionAdminViewSet, SectionImageAdminViewSet
from admissions.views import AvailabilityViewSet, AvailabilityAdminViewSet, PricingViewSet, PricingAdminViewSet, ContactRequestViewSet
from faq.views import FAQViewSet, FAQAdminViewSet
from testimonials.views import TestimonialViewSet
from staff.views import MeView, MyProfileView, PublicAssistantListView
from testimonials.views import TestimonialViewSet, TestimonialAdminViewSet

router = DefaultRouter()
router.register(r'pages', PageViewSet, basename='pages')
router.register(r'availabilities', AvailabilityViewSet, basename='availabilities')
router.register(r'admin/availabilities', AvailabilityAdminViewSet, basename='admin-availabilities')
router.register(r'pricing', PricingViewSet, basename='pricing')
router.register(r'admin/pricing', PricingAdminViewSet, basename='admin-pricing')
router.register(r'contacts', ContactRequestViewSet, basename='contacts')
router.register(r'faq', FAQViewSet, basename='faq')
router.register(r'admin/faq', FAQAdminViewSet, basename='admin-faq')
router.register(r'testimonials', TestimonialViewSet, basename='testimonials')
router.register(r'admin/sections', SectionAdminViewSet, basename='admin-sections')
router.register(r'admin/section-images', SectionImageAdminViewSet, basename='admin-section-images')
router.register(r'admin/testimonials', TestimonialAdminViewSet, basename='admin-testimonials')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/me/', MeView.as_view(), name='me'),
    path('api/my-profile/', MyProfileView.as_view(), name='my-profile'),
    path('api/assistantes/', PublicAssistantListView.as_view(), name='assistantes'),

    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)