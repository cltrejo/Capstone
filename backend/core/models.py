from django.db import models

# Create your models here.

class Habitacion(models.Model):
    id_habitacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)  # "Sala Principal"
    descripcion = models.TextField(blank=True)
    forma_svg = models.TextField()  # O FileField si guardas archivos
    
class Sensor(models.Model):
    TIPO_CHOICES = [
        ('temperatura', 'Temperatura'),
        ('humedad', 'Humedad'),
        ('movimiento', 'Movimiento'),
        ('co2', 'CO2'),
    ]
    id_sensor = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)
    id_habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE)
    
    
class Medicion(models.Model):
    id_medicion = models.AutoField(primary_key=True)
    valor = models.DecimalField(max_digits=8, decimal_places=2)
    unidad = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    id_sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)