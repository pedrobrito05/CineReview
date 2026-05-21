from django.contrib.auth.models import User
from django.db import models

#filme: atributos com o imagem, titulo, data de lancamento, elenco, genero, diretor, vizualizacoes, resumo
# descobri que para processar as imagens temos de instalar o pillow
class Ator(models.Model):
    nome=models.CharField(max_length=50)
    imagem=models.ImageField(upload_to='imagem_atores/', default='default.png')

class Diretor(models.Model):
    nome=models.CharField(max_length=50)

class Filme(models.Model):
    imagem=models.ImageField(upload_to='imagem_filmes/', default='default.png')
    titulo=models.CharField(max_length=50)
    lancamento=models.DateField()
    elenco=models.ManyToManyField(Ator, blank=True)
    GENEROS = [
        ('action', 'Ação'),
        ('adventure', 'Aventura'),
        ('animation', 'Animação'),
        ('biography', 'Biografia'),
        ('comedy', 'Comédia'),
        ('crime', 'Crime'),
        ('documentary', 'Documentário'),
        ('drama', 'Drama'),
        ('family', 'Família'),
        ('fantasy', 'Fantasia'),
        ('film_noir', 'Film-Noir'),
        ('game_show', 'Programa de Jogos'),
        ('history', 'História'),
        ('horror', 'Terror'),
        ('music', 'Música'),
        ('musical', 'Musical'),
        ('mystery', 'Mistério'),
        ('news', 'Notícias'),
        ('reality_tv', 'Reality Show'),
        ('romance', 'Romance'),
        ('sci_fi', 'Ficção Científica'),
        ('short', 'Curta-Metragem'),
        ('sport', 'Desporto'),
        ('talk_show', 'Talk Show'),
        ('thriller', 'Thriller'),
        ('war', 'Guerra'),
        ('western', 'Western'),
    ]
    genero=models.CharField(max_length=30, choices=GENEROS)
    diretor=models.ManyToManyField(Diretor, blank=True) #descobri que ha filmes com + que 1 diretor
    resumo=models.CharField(max_length=500)


#uma "tabela" de ligacao 1 para 1 com os utilizadores do django para podermos guardar dados sobre o mesmo sem alterar diretamente a tabela do django (podiamos usando a classe abstrata tho)
class Utilizador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagem=models.ImageField(upload_to='imagem_utilizadores/', default='default.png')
    visto = models.ManyToManyField(Filme, blank=True) #muitos para muitos com filme (lista de filmes vistos)

    # para aceder a estes dados temos de fazer usr.Utilizador.imagem por exemplo



class Review(models.Model): #vai ser uma relacao entre utilizador e filme
    utilizador = models.ForeignKey(Utilizador, on_delete=models.CASCADE)
    filme=models.ForeignKey(Filme, on_delete=models.CASCADE)
    texto=models.CharField(max_length=500)
    avaliacao=models.IntegerField(choices=[(1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (8,8), (9,9), (10,10)])
    data=models.DateField(auto_now_add=True) #adiciona a data em que e inserido na bd
    gostos=models.ManyToManyField(Utilizador, blank=True, related_name='reviews_gostadas')