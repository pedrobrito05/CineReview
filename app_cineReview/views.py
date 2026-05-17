from itertools import count

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Avg, Sum, Count
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app_cineReview.models import Filme, Review, Ator, Diretor, Utilizador
from app_cineReview.serializers import FilmeSerializer, AtorSerializer, DiretorSerializer, ReviewSerializer


#views do utilizador(login e logout)
@api_view(['POST'])
def login_view(request):
    username=request.data.get('username')
    password=request.data.get('password')
    user=authenticate(request, username=username, password=password)

    if (user is not None):
        login(request,user)
        return Response({'msg':'User logged in'})
    else:
        return Response({'msg': 'invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def logout_view(request):
    username=request.data.get('username')
    logout(request)
    return Response({'msg': 'user '+username+' logged out'})

@api_view(['POST'])
def create_account(request):
    username=request.data.get('username')
    password=request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({'msg': 'Username já existe'}, status=status.HTTP_400_BAD_REQUEST)


    user = User.objects.create_user(username=username, password=password)

    #liga a tabela de Utilizador e user
    Utilizador.objects.create(user=user)

    return Response({'msg': 'Conta criada com sucesso'}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
def filmes(request):
    if request.method=='GET' :
        filmes_list=Filme.objects.all()
        serializer=FilmeSerializer(filmes_list, many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        serializer=FilmeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def detalhes(request, id):
    try:
        filme=Filme.objects.get(pk=id)
    except Filme.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    nota = Review.objects.filter(filme=filme).aggregate(Avg('avaliacao'))
    serializer=FilmeSerializer(filme)

    data=serializer.data
    data['nota_media'] = nota['avaliacao__avg']

    return Response(data)


@api_view(['GET'])  #todos os filmes de um ator com id
def filmesDeAtor(request, id):
    filmes = Filme.objects.filter(elenco__id=id)

    if not filmes.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = FilmeSerializer(filmes, many=True)  # ← many=True
    return Response(serializer.data)


@api_view(['GET', 'POST']) #todos os atores
def atores(request):
    if request.method=='GET' :
        atores=Ator.objects.all()
        serializer=AtorSerializer(atores, many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        serializer=AtorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST']) #todos os diretores
def diretores(request):
    if request.method=='GET' :
        diretores=Diretor.objects.all()
        serializer=DiretorSerializer(diretores, many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        serializer=DiretorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])  #todos os filmes de um ator com id
def filmesDeDiretor(request, id):
    filmes = Filme.objects.filter(diretor__id=id)

    if not filmes.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = FilmeSerializer(filmes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def classificacaoDeFilme(request, id):
    try:
        filme = Filme.objects.get(pk=id)
    except Filme.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    nota = Review.objects.filter(filme=filme).aggregate(Avg('avaliacao'))

    return Response({
        'nota ': nota['avaliacao__avg'] #nota sem [] da avaliacao__avg:
    })


@api_view(['GET'])
def visualizacoesDeUmFilme(request, id):
    try:
        filme = Filme.objects.get(pk=id)
    except Filme.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    vis = Utilizador.objects.filter(visto=filme).aggregate(Sum('visto'))

    return Response({
        'visualizacoes ': vis['visto__sum']
    })

@api_view(['GET'])
def filmesDeGenero(request, genero):
    filmes = Filme.objects.filter(genero=genero)
    if not filmes.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = FilmeSerializer(filmes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def top10FilmesNotas(request):
    filmes = Filme.objects.annotate(
        nota=Avg('review__avaliacao')
    ).order_by('-nota')[:10] #ordem decrescente

    serializer = FilmeSerializer(filmes, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def reviews(request):
    if request.method == 'GET':
        review = Review.objects.all()
        review=Review.objects.annotate(total_gostos=Count('gostos')).order_by('-total_gostos')
        serializer = ReviewSerializer(review, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def filmesVistosPorUtilizador(request, id):
    try:
        utilizador=Utilizador.objects.get(pk=id)
    except Utilizador.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    filmes=utilizador.visto.all()
    serializer = FilmeSerializer(filmes, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def deleteComment(request, id):
    try:
        review=Review.objects.filter(pk=id)
    except Review.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if(request.user==review.get(Utilizador)):
        review.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def reviewsDeFilme(request, id):
    reviews=Review.objects.filter(filme__id=id)
    if not reviews.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ReviewSerializer(reviews, many=True)
    #data = {}
    #data['reviews'] = serializer.data
    #data['total'] = reviews.count()
    return Response(serializer.data)