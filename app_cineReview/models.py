from django.contrib.auth.models import User
from django.db import models

#filme: atributos com o imagem, titulo, data de lancamento, elenco, genero, diretor, vizualizacoes, resumo
# descobri que para processar as imagens temos de instalar o pillow
class Ator(models.Model):
    nome=models.CharField(max_length=50)
    imagem=models.ImageField(upload_to='imagem_atores/', blank=True)

class Diretor(models.Model):
    nome=models.CharField(max_length=50)

class Filme(models.Model):
    imagem=models.ImageField(upload_to='imagem_filmes/', blank=True)
    titulo=models.CharField(max_length=50)
    lancamento=models.DateField()
    elenco=models.ManyToManyField(Ator, blank=True)
    GENEROS = [
        ('action', 'Action'),
        ('adventure', 'Adventure'),
        ('animation', 'Animation'),
        ('biography', 'Biography'),
        ('comedy', 'Comedy'),
        ('crime', 'Crime'),
        ('documentary', 'Documentary'),
        ('drama', 'Drama'),
        ('family', 'Family'),
        ('fantasy', 'Fantasy'),
        ('film_noir', 'Film-Noir'),
        ('game_show', 'Game-Show'),
        ('history', 'History'),
        ('horror', 'Horror'),
        ('music', 'Music'),
        ('musical', 'Musical'),
        ('mystery', 'Mystery'),
        ('news', 'News'),
        ('reality_tv', 'Reality-TV'),
        ('romance', 'Romance'),
        ('sci_fi', 'Sci-Fi'),
        ('short', 'Short'),
        ('sport', 'Sport'),
        ('talk_show', 'Talk-Show'),
        ('thriller', 'Thriller'),
        ('war', 'War'),
        ('western', 'Western'),
    ]
    genero=models.CharField(choices=GENEROS)
    diretor=models.ManyToManyField(Diretor, blank=True) #descobri que ha filmes com + que 1 diretor
    visualizacoes=models.IntegerField()
    resumo=models.CharField(max_length=500)

class Review(models.Model): #vai ser uma relacao entre utilizador e filme
    utilizador=models.ForeignKey(User, on_delete=models.CASCADE)
    filme=models.ForeignKey(Filme, on_delete=models.CASCADE)
    texto=models.CharField(max_length=500)
    avaliacao=models.IntegerField(choices=[('1','1'), ('2','2'), ('3','3'), ('4','4'), ('5','5'), ('6','6'), ('7','7'), ('8','8'), ('9','9'), ('10','10')])
    data=models.DateField(auto_now_add=True) #adiciona a data em que e inserido na bd


#uma "tabela" de ligacao 1 para 1 com os utilizadores do django para podermos guardar dados sobre o mesmo sem alterar diretamente a tabela do django (podiamos usando a classe abstrata tho)
class Utilizador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagem=models.ImageField()
    visto = models.ManyToManyField(Filme, blank=True) #muitos para muitos com filme (lista de filmes vistos)

    # para aceder a estes dados temos de fazer usr.Utilizador.imagem por exemplo

