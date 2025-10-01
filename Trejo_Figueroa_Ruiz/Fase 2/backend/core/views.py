import random
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
        
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def historico_sensor( request, id):
    try:
        sensor = Sensor.objects.get(id_sensor = id)

        mediciones = Medicion.objects.filter(id_sensor = id)

        serializer = MedicionSerializer(mediciones, many = True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Sensor.DoesNotExist:
        
        return Response({'error': 'Sensor no encontrado'}, status=status.HTTP_404_NOT_FOUND)

'''
POSIBLES ACTUALIZACIONES

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def historico_sensor(request, id):
    try:
        sensor = Sensor.objects.get(id=id)
        
        # Opcional: parámetros para filtrar por fecha o límite
        limit = request.GET.get('limit')  # /api/sensores/1/mediciones/?limit=50
        since = request.GET.get('since')  # /api/sensores/1/mediciones/?since=2024-01-01
        
        mediciones = Medicion.objects.filter(sensor=id)
        
        # Filtrar por fecha si se proporciona
        if since:
            mediciones = mediciones.filter(timestamp__gte=since)
        
        # Ordenar por timestamp (más recientes primero) y limitar si se especifica
        mediciones = mediciones.order_by('-timestamp')
        
        if limit:
            mediciones = mediciones[:int(limit)]
        
        serializer = MedicionSerializer(mediciones, many=True)
        return Response({
            'sensor': SensorSerializer(sensor).data,
            'mediciones': serializer.data,
            'total': mediciones.count()
        }, status=status.HTTP_200_OK)
        
    except Sensor.DoesNotExist:
        return Response(
            {'error': 'Sensor no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )

'''

        
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
        

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def simular_temperatura(request):
    """
    Simula cambios de temperatura para todos los sensores activos
    """
    sensores = Sensor.objects.filter(tipo='temperatura', activo=True)
    
    for sensor in sensores:
        # Simular temperatura entre 18°C y 30°C con variación realista
        temperatura_anterior = Medicion.objects.filter(id_sensor=sensor).last()
        
        if temperatura_anterior:
            temp_anterior = float(temperatura_anterior.valor)
            # Variación de ±2°C respecto a la anterior
            nueva_temperatura = temp_anterior + random.uniform(-2.0, 2.0)
            nueva_temperatura = max(18.0, min(30.0, nueva_temperatura))  # Limitar entre 18-30
        else:
            nueva_temperatura = random.uniform(20.0, 25.0)  # Temperatura inicial
        
        Medicion.objects.create(
            id_sensor=sensor,
            valor=nueva_temperatura,
            unidad='°C'
        )
    
    return Response({"message": f"Temperaturas simuladas para {sensores.count()} sensores"})