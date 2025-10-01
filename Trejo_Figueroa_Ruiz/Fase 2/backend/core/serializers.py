from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Habitacion, Medicion, Sensor

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales incorrectas')
            data['user'] = user
        return data
    
# CLASES DE MODELS
class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'

class SensorSerializer(serializers.ModelSerializer):
    ultima_medicion = serializers.SerializerMethodField()

    class Meta:
        model = Sensor
        fields = '__all__'

    def get_ultima_medicion(self, obj):
        ultima = Medicion.objects.filter(id_sensor=obj).last()  # ← CORREGIDO
        if ultima:
            return MedicionSerializer(ultima).data
        return None
    
class HabitacionSerializer(serializers.ModelSerializer):
    sensores = SensorSerializer(many=True, read_only=True)
    temperatura_actual = serializers.SerializerMethodField()

    class Meta:
        model = Habitacion
        fields = '__all__'

    def get_temperatura_actual(self, obj):
        # Obtener el sensor de temperatura de esta habitación
        sensor_temperatura = Sensor.objects.filter(
            id_habitacion=obj,  # ← CORREGIDO
            tipo='temperatura', 
            activo=True
        ).first()
        
        if sensor_temperatura:
            ultima_medicion = Medicion.objects.filter(id_sensor=sensor_temperatura).last()  # ← CORREGIDO
            if ultima_medicion:
                return float(ultima_medicion.valor)
        return None