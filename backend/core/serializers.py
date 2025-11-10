from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import ZONA, MEDICION_THERMOSTATO, THERMOSTATO

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'tipo_usuario')

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
        model = MEDICION_THERMOSTATO
        fields = '__all__'

class ThermostatoSerializer(serializers.ModelSerializer):
    ultima_medicion = serializers.SerializerMethodField()

    class Meta:
        model = THERMOSTATO
        fields = '__all__'

    def get_ultima_medicion(self, obj):
        ultima = MEDICION_THERMOSTATO.objects.filter(id_thermostato=obj).last()  # ← CORREGIDO
        if ultima:
            return MedicionSerializer(ultima).data
        return None
    
class ZonaSerializer(serializers.ModelSerializer):
    termostatos = ThermostatoSerializer(many=True, read_only=True)
    temperatura_actual = serializers.SerializerMethodField()

    class Meta:
        model = ZONA
        fields = '__all__'

    def get_temperatura_actual(self, obj):
        # Obtener el sensor de temperatura de esta habitación
        termostato_temperatura = THERMOSTATO.objects.filter(
            id_zona=obj,  # ← CORREGIDO
        ).first()
        
        if termostato_temperatura:
            ultima_medicion = MEDICION_THERMOSTATO.objects.filter(id_thermostato=termostato_temperatura).last()  # ← CORREGIDO
            if ultima_medicion:
                return float(ultima_medicion.valor)
        return None