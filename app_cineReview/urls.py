from django.urls import path

from . import views
from .views import reviewsDeFilme, dadosDoUser, adicionarVisto, likeReview, apagarFilme, apagarReview, getUsers

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

    path ('deleteReview', views.deleteComment),

    path('reviewsDeFilme/<int:id>/', views.reviewsDeFilme),

    path('reviewsDeUser/<int:id>/', views.reviewsDeUser),
    path('user/', views.user_view),

    path ('login/', views.login_view),

    path('logout/', views.logout_view),

    path('create_account/', views.create_account),

    path('session-test/', views.session_test),
    path('post-test/', views.post_test),
    path('csrf-test/', views.csrf_test),

    path('user/<int:id>/', dadosDoUser),

    path('importar_tmdb/', views.importar_tmdb),

    path('visto/', adicionarVisto),

    path('likeReview/<int:id>/', likeReview),

    path('filmes/<int:id>/apagar/', apagarFilme),
    path('reviews/<int:id>/apagar/', apagarReview),

    path('users/', getUsers)
]
