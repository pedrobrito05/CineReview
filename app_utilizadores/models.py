from django.contrib.auth.models import AbstractUser
from django.db import models

from app_filme.models import Filme


class Utilizador(AbstractUser):
    imagem=models.ImageField()
    visto = models.ManyToManyField(Filme, blank=True) #muitos para muitos com filme (lista de filmes vistos)


