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











































