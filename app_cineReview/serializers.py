from django.contrib.auth.models import User
from django.db.models import Avg
from rest_framework import serializers
from .models import Filme, Ator, Diretor, Review, Utilizador

# o objetivo dos serializers é passar os objetos django para o formato json para serem mais facilmente tratados na web

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_superuser')

class AtorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ator
        fields=('id', 'nome', 'imagem')



class DiretorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Diretor
        fields=('id', 'nome')



class FilmeSerializer(serializers.ModelSerializer):
    visualizacoes = serializers.IntegerField(read_only=True, default=0)
    nota_media = serializers.FloatField(read_only=True, default=None)
    elenco = AtorSerializer(many=True, read_only=True)
    diretor = DiretorSerializer(many=True, read_only=True)
    class Meta:
        model = Filme
        fields = '__all__'


class UtilizadorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    visto = FilmeSerializer(many=True, read_only=True)
    media_avaliacoes = serializers.SerializerMethodField()

    class Meta:
        model = Utilizador
        fields = ('id', 'user', 'imagem', 'visto', 'media_avaliacoes')

    def get_media_avaliacoes(self, obj):
        media = Review.objects.filter(utilizador=obj).aggregate(Avg('avaliacao'))
        valor = media['avaliacao__avg']
        return round(valor, 1) if valor else 0


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




