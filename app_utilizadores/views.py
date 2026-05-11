from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

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