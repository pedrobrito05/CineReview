from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("filme/", include('app_cineReview.urls')),
    path("admin/", admin.site.urls),
]
