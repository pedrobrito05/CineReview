from django.urls import path

from . import views
urlpatterns=[
    path('api/filmes/', views.filmes), #view para mostrar todos os filmes
]
