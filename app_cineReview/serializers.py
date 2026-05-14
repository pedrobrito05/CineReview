from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Filme, Ator, Diretor, Review, Utilizador

# o objetivo dos serializers é passar os objetos django para o formato json para serem mais facilmente tratados na web

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class AtorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ator
        fields=('id', 'nome', 'imagem')



class DiretorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Diretor
        fields=('id', 'nome')



class FilmeSerializer(serializers.ModelSerializer):
    elenco = AtorSerializer(many=True, read_only=True)
    diretor = DiretorSerializer(many=True, read_only=True)
    class Meta:
        model=Filme
        fields=('id','imagem', 'titulo', 'lancamento','elenco', 'diretor', 'genero', 'resumo')


class UtilizadorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    visto = FilmeSerializer(many=True, read_only=True)

    class Meta:
        model = Utilizador
        fields = ('id', 'user', 'imagem', 'visto')





class ReviewSerializer(serializers.ModelSerializer):
    utilizador = UtilizadorSerializer(read_only=True)
    filme = FilmeSerializer(read_only=True)
    gostos = UtilizadorSerializer(many=True, read_only=True)
    total_gostos = serializers.SerializerMethodField()

    def get_total_gostos(self, obj):
        return obj.gostos.count()

    class Meta:
        model = Review
        fields = ('id', 'utilizador', 'filme', 'texto', 'avaliacao', 'data', 'gostos', 'total_gostos')




