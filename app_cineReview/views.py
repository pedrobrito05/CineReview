from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response





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