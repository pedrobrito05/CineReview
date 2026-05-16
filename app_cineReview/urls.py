from django.urls import path

from . import views
urlpatterns=[
    #mostra todos os filmes com todos os detalhes
    path('filmes/', views.filmes), #view para mostrar todos os filmes
    #tipo um getFilme
    path('filmes/<int:id>/', views.detalhes),

    #mostrar os filmes que um ator esteve
    path('filmesDeAtor/<int:id>/', views.filmesDeAtor),

    #mostrar todos os atores
    path('atores/', views.atores), #view para mostrar todos os atores

    path('diretores/', views.diretores), #view para mostrar todos os diretores

    path('filmesDeDiretor/<int:id>/', views.filmesDeDiretor),

    path('classificacaoDeFilme/<int:id>/', views.classificacaoDeFilme),

    path('visualizacoesDeUmFilme/<int:id>/', views.visualizacoesDeUmFilme),

    path('filmesDeGenero/<str:genero>/', views.filmesDeGenero),

    path('top10FilmesNotas/', views.top10FilmesNotas),

    path('reviews/', views.reviews),

    path('filmesVistosPorUtilizador/<int:id>/', views.filmesVistosPorUtilizador),

    path ('deleteReview', views.deleteComment)
]
