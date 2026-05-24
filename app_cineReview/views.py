import datetime

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Avg, Sum, Count
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app_cineReview.models import Filme, Review, Ator, Diretor, Utilizador
from app_cineReview.serializers import FilmeSerializer, AtorSerializer, DiretorSerializer, ReviewSerializer,UtilizadorSerializer


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
    return Response({'msg': 'logged out'})

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
        filmes_list = Filme.objects.annotate(
            visualizacoes=Count('utilizador', distinct=True),
            nota_media=Avg('review__avaliacao')
        )
        serializer=FilmeSerializer(filmes_list, many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        serializer=FilmeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
@permission_classes([IsAuthenticated])
def reviews(request):
    if request.method == 'GET':
        review = Review.objects.annotate(total_gostos=Count('gostos')).order_by('-total_gostos')
        serializer = ReviewSerializer(review, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        filme_id = request.data.get('filme')

        if not filme_id:
            return Response({'error': 'O campo filme é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            filme_obj = Filme.objects.get(pk=filme_id)
            perfil_utilizador = Utilizador.objects.get(user=request.user)  # Pega o user logado
        except Filme.DoesNotExist:
            return Response({'error': 'Filme não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except Utilizador.DoesNotExist:
            return Response({'error': 'Perfil de utilizador não encontrado. Faça login novamente.'},
                            status=status.HTTP_401_UNAUTHORIZED)


        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(utilizador=perfil_utilizador, filme=filme_obj)
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
    reviews=Review.objects.filter(filme__id=id).annotate(total_gostos=Count('gostos')).order_by('-total_gostos')
    if not reviews.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ReviewSerializer(reviews, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view2(request):
    return Response({'username': request.user.username})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):

    try:
        utilizador = Utilizador.objects.get(user=request.user)

        serializer = UtilizadorSerializer(utilizador)

        return Response(serializer.data)

    except Utilizador.DoesNotExist:
        return Response(
            {'error': 'Perfil do utilizador não existe'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def session_test(request):
    return Response({
        "is_authenticated": request.user.is_authenticated,
        "username": request.user.username if request.user.is_authenticated else None
    })


# teste de POST autenticado + CSRF
@api_view(['POST'])
def post_test(request):
    return Response({
        "message": "POST recebido com sucesso",
        "user": request.user.username if request.user.is_authenticated else None,
        "authenticated": request.user.is_authenticated,
        "data": request.data
    })
@api_view(['GET'])
def csrf_test(request):
    return Response({
        "csrfToken": get_token(request)
    })

@api_view(['GET'])
@ensure_csrf_cookie
def csrf(request):
    return Response({"ok": True})

@api_view(['GET'])
def reviewsDeUser(request, id):
    utilizador=Utilizador.objects.get(user__id=id)
    reviews = Review.objects.filter(utilizador=utilizador)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET', 'PUT'])
@parser_classes([MultiPartParser, FormParser])
def dadosDoUser(request, id):
    try:
        utilizador = Utilizador.objects.get(user__id=id)
    except Utilizador.DoesNotExist:
        return Response(
            {"error": "Utilizador não encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = UtilizadorSerializer(utilizador)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UtilizadorSerializer(
            utilizador,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()


            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def profile_view(request):
    try:
        utilizador = Utilizador.objects.get(user=request.user)
    except Utilizador.DoesNotExist:
        return Response({'error': 'Perfil não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UtilizadorSerializer(utilizador)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UtilizadorSerializer(utilizador, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Perfil atualizado'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def importar_tmdb(request):


    titulo = request.data.get('titulo')
    lancamento_str = request.data.get('lancamento')
    genero = request.data.get('genero')
    resumo = request.data.get('resumo', '')
    imagem = request.FILES.get('imagem')

    if not titulo or not genero:
        return Response(
            {"error": "Título e género são obrigatórios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        lancamento = datetime.datetime.strptime(
            lancamento_str,
            "%Y-%m-%d"
        ).date()

    except:
        lancamento = datetime.date.today()

    try:
        with transaction.atomic():

            filme = Filme.objects.create(
                titulo=titulo,
                lancamento=lancamento,
                genero=genero,
                resumo=resumo,
                imagem=imagem
            )

            diretores = request.data.getlist('diretores')

            for nome in diretores:

                nome = nome.strip()

                if nome:
                    diretor, _ = Diretor.objects.get_or_create(
                        nome=nome
                    )

                    filme.diretor.add(diretor)

            elenco = request.data.getlist('elenco')

            for nome in elenco:

                nome = nome.strip()

                if nome:
                    ator, _ = Ator.objects.get_or_create(
                        nome=nome
                    )

                    filme.elenco.add(ator)

        serializer = FilmeSerializer(filme)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    except Exception as e:

        print("ERRO TMDB:", e)

        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adicionarVisto(request):
    filme_id = request.data.get('filme')
    if not filme_id:
        return Response({'error': 'O campo filme é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        filme_obj = Filme.objects.get(pk=filme_id)
        perfil_utilizador = Utilizador.objects.get(user=request.user)
    except Filme.DoesNotExist:
        return Response({'error': 'Filme não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Utilizador.DoesNotExist:
        return Response({'error': 'Perfil não encontrado.'}, status=status.HTTP_401_UNAUTHORIZED)

    if filme_obj in perfil_utilizador.visto.all():
        perfil_utilizador.visto.remove(filme_obj)
        return Response({'msg': 'Filme removido dos vistos.'}, status=status.HTTP_200_OK)
    else:
        perfil_utilizador.visto.add(filme_obj)
        return Response({'msg': 'Filme marcado como visto.'}, status=status.HTTP_200_OK)
    #carrega uma vez coloca nos vistos, carrega outra retira


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likeReview(request, id):
    try:
        review = Review.objects.get(pk=id)
        perfil_utilizador = Utilizador.objects.get(user=request.user)
    except Review.DoesNotExist:
        return Response({'error': 'Review não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    except Utilizador.DoesNotExist:
        return Response({'error': 'Perfil não encontrado.'}, status=status.HTTP_401_UNAUTHORIZED)

    if perfil_utilizador in review.gostos.all():
        review.gostos.remove(perfil_utilizador)
        return Response({'msg': 'Like removido.', 'liked': False}, status=status.HTTP_200_OK)
    else:
        review.gostos.add(perfil_utilizador)
        return Response({'msg': 'Like adicionado.', 'liked': True}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def apagarFilme(request, id):
    try:
        filme = Filme.objects.get(pk=id)
    except Filme.DoesNotExist:
        return Response({'error': 'Filme não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_superuser:
        return Response({'error': 'Sem permissões.'}, status=status.HTTP_403_FORBIDDEN)

    filme.delete()
    return Response({'msg': 'Filme apagado.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def apagarReview(request, id):
    try:
        review = Review.objects.get(pk=id)
    except Review.DoesNotExist:
        return Response({'error': 'Review não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    perfil_utilizador = Utilizador.objects.get(user=request.user)

    if review.utilizador != perfil_utilizador and not request.user.is_superuser:
        return Response({'error': 'Sem permissões.'}, status=status.HTTP_403_FORBIDDEN)

    review.delete()
    return Response({'msg': 'Review apagada.'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getUsers(request):
    user_list = Utilizador.objects.all()
    serializer = UtilizadorSerializer(user_list, many=True)
    return Response(serializer.data)