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

class HabitacionSerializer (serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = '__all__'
    
class MedicionSerializer (serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'

class SensorSerializer (serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'