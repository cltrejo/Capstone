from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .serializers import HabitacionSerializer, MedicionSerializer, SensorSerializer, UserSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Habitacion, Medicion, Sensor

@api_view(['POST'])
def registro(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Usuario ya existe'}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    })

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def VerifyTokenView(request):
    token = request.headers.get("Authorization")
    if not token:
        return Response({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)

    token = token.replace("Token ", "")
    try:
        token_obj = Token.objects.get(key=token)
        return Response({"valid": True, "user": token_obj.user.username}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)
    

'''

ENDPOINTS HA DESARROLLAR

# GET /api/habitaciones/ - Lista todas las habitaciones con sus sensores
# GET /api/habitaciones/{id}/ - Detalle de habitación con mediciones recientes
# GET /api/sensores/{id}/mediciones/ - Histórico de un sensor
# POST /api/simular/mediciones/ - Endpoint para generar datos simulados

'''

@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
def lista_habitaciones(request):
    if request.method == 'GET':
        query = Habitacion.objects.all()
        serializer = HabitacionSerializer(query, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = HabitacionSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes((IsAuthenticated,))
def detalle_habitacion(request, id):
    try:
        habitacion = Habitacion.objects.get(id_habitacion = id)
    except Habitacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = HabitacionSerializer(habitacion)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        serializer = HabitacionSerializer(habitacion, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        habitacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
        
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
def lista_sensores(request):
    if request.method == 'GET':
        query = Sensor.objects.all()
        serializer = SensorSerializer(query, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = SensorSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
def lista_mediciones(request):
    if request.method == 'GET':
        query = Medicion.objects.all()
        serializer = MedicionSerializer(query, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = MedicionSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)