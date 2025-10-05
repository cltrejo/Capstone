from django.db import models

# Create your models here.
from django.db import models

# =============================================
# MODELOS EXISTENTES (mantener)
# =============================================

class Habitacion(models.Model):
    id_habitacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    forma_svg = models.TextField()
    
    def __str__(self):
        return self.nombre

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
    
    def __str__(self):
        return f"{self.nombre} ({self.tipo})"

class Medicion(models.Model):
    id_medicion = models.AutoField(primary_key=True)
    valor = models.DecimalField(max_digits=8, decimal_places=2)
    unidad = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    id_sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.valor} {self.unidad} - {self.timestamp}"

# =============================================
# NUEVOS MODELOS DEL PROFESOR
# =============================================

class Oficina(models.Model):
    id_oficina = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    georeferencia = models.CharField(max_length=120, blank=True, null=True)
    
    def __str__(self):
        return self.descripcion or f"Oficina {self.id_oficina}"

class TipoZona(models.Model):
    id_tipozona = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80)
    
    def __str__(self):
        return self.nombre

class Zona(models.Model):
    ORIENTACION_CHOICES = [
        ('N', 'Norte'),
        ('S', 'Sur'),
        ('E', 'Este'),
        ('O', 'Oeste'),
    ]
    
    id_zona = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    orientacion = models.CharField(max_length=1, choices=ORIENTACION_CHOICES, blank=True, null=True)
    superficie_m3 = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    cantidad_equipos = models.IntegerField(blank=True, null=True)
    id_oficina = models.ForeignKey(Oficina, on_delete=models.CASCADE)
    id_tipozona = models.ForeignKey(TipoZona, on_delete=models.SET_NULL, blank=True, null=True)
    id_habitacion = models.ForeignKey(Habitacion, on_delete=models.SET_NULL, blank=True, null=True)
    
    def __str__(self):
        return self.descripcion or f"Zona {self.id_zona}"

class Thermostato(models.Model):
    id_thermostato = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120)
    id_zona = models.ForeignKey(Zona, on_delete=models.CASCADE)
    id_sensor = models.OneToOneField(
        Sensor, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True,
        help_text="Sensor asociado a este thermostat"
    )
    
    def __str__(self):
        return f"{self.nombre} - {self.id_zona}"

class MaterialZona(models.Model):
    id_materialzona = models.AutoField(primary_key=True)
    id_zona = models.ForeignKey(Zona, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=120, blank=True, null=True)
    cantidad_m2 = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['id_zona', 'nombre'],
                name='unique_material_zona_nombre'
            )
        ]
    
    def __str__(self):
        return f"{self.nombre} - {self.id_zona}"

# =============================================
# MODELOS METEOROLÓGICOS
# =============================================

class EstacionMeteorologica(models.Model):
    codigo_nacional = models.CharField(max_length=10, primary_key=True)
    nombre_estacion = models.CharField(max_length=100)
    latitud = models.DecimalField(max_digits=10, decimal_places=5)
    longitud = models.DecimalField(max_digits=10, decimal_places=5)
    altura = models.IntegerField()
    
    def __str__(self):
        return f"{self.nombre_estacion} ({self.codigo_nacional})"

class MedicionMeteorologica(models.Model):
    id = models.BigAutoField(primary_key=True)
    codigo_nacional = models.ForeignKey(EstacionMeteorologica, on_delete=models.CASCADE)
    momento = models.DateTimeField()
    temperatura = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    temperatura_minima_12h = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    temperatura_maxima_12h = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    humedad_relativa = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['codigo_nacional', 'momento']),
        ]
    
    def __str__(self):
        return f"{self.codigo_nacional} - {self.momento}"

class PosicionSolar(models.Model):
    id = models.BigAutoField(primary_key=True)
    codigo_nacional = models.ForeignKey(EstacionMeteorologica, on_delete=models.CASCADE)
    momento = models.DateTimeField()
    elevacion = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    azimut = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['codigo_nacional', 'momento'],
                name='unique_posicion_solar'
            )
        ]
        indexes = [
            models.Index(fields=['momento']),
        ]
    
    def __str__(self):
        return f"{self.codigo_nacional} - {self.momento}"

class PrediccionClima(models.Model):
    id_registro = models.BigAutoField(primary_key=True)
    fecha_hora_inicio = models.DateTimeField()
    temperatura = models.DecimalField(max_digits=4, decimal_places=1)
    sensacion_termica = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    humedad_relativa = models.SmallIntegerField(blank=True, null=True)
    cobertura_nubes = models.SmallIntegerField(blank=True, null=True)
    prob_precipitacion = models.SmallIntegerField(blank=True, null=True)
    precipitacion_qpf = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    viento_velocidad = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    viento_direccion_cardinal = models.CharField(max_length=10, blank=True, null=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['fecha_hora_inicio']),
        ]
    
    def __str__(self):
        return f"Predicción {self.fecha_hora_inicio}"

class OficinaEstacion(models.Model):
    id_oficina = models.ForeignKey(Oficina, on_delete=models.CASCADE)
    codigo_nacional = models.ForeignKey(EstacionMeteorologica, on_delete=models.CASCADE)
    principal = models.BooleanField(default=False)
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['id_oficina', 'codigo_nacional'],
                name='unique_oficina_estacion'
            )
        ]
    
    def __str__(self):
        principal_str = " (Principal)" if self.principal else ""
        return f"{self.id_oficina} - {self.codigo_nacional}{principal_str}"
'''
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
    id_sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)'''