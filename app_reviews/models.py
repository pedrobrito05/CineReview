from django.db import models

from app_filme.models import Filme
from app_utilizadores.models import Utilizador


class Review(models.Model): #vai ser uma relacao entre utilizador e filme
    utilizador=models.ForeignKey(Utilizador, on_delete=models.CASCADE)
    filme=models.ForeignKey(Filme, on_delete=models.CASCADE)
    texto=models.CharField(max_length=500)
    avaliacao=models.IntegerField(choices=[('1','1'), ('2','2'), ('3','3'), ('4','4'), ('5','5'), ('6','6'), ('7','7'), ('8','8'), ('9','9'), ('10','10')])
    data=models.DateField(auto_now_add=True) #adiciona a data em que e inserido na bd


