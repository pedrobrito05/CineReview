from django.contrib import admin

from app_cineReview.models import Filme, Diretor, Ator, Review, Utilizador

# Register your models here.
admin.site.register(Filme)
admin.site.register(Diretor)
admin.site.register(Ator)
admin.site.register(Review)
admin.site.register(Utilizador)