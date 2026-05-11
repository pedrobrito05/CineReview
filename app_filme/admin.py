from django.contrib import admin

# Register your models here.
from models import Filme, Ator, Diretor

admin.site.register(Filme)
admin.site.register(Ator)
admin.site.register(Diretor)