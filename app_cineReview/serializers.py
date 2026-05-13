from rest_framework import serializers
from .models import Filme, Ator, Diretor


# o objetivo dos serializers é passar os objetos django para o formato json para serem mais facilmente tratados na web
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
    diretores = DiretorSerializer(many=True, read_only=True)
    class Meta:
        model=Filme
        fields=('id','imagem', 'titulo', 'lancamento','elenco', 'diretores', 'genero', 'visualizacoes', 'resumo')

