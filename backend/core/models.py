from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

#CUSTOM USER CON CAMPO TIPO_USUARIO
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('El username es obligatorio')
        
        email = self.normalize_email(email) if email else None
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('tipo_usuario', 'ADMIN')
        extra_fields.setdefault('nombre', 'Admin')
        extra_fields.setdefault('apellido', 'Sistema')
        return self.create_user(username, email, password, **extra_fields)

class USUARIO(AbstractBaseUser):
    TIPOS = [
        ('ADMIN', 'Administrador'),
        ('COMUN', 'Común')
    ]
    
    username = models.CharField(max_length=150, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    tipo_usuario = models.CharField(max_length=20, choices=TIPOS, default='COMUN')
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'nombre', 'apellido']

    objects = UsuarioManager()
    
    def __str__(self):
        return self.username
    
    
    # LOS 3 MÉTODOS MÍNIMOS para que el admin funcione
    @property
    def is_staff(self):
        return self.tipo_usuario == 'ADMIN'
    
    def has_perm(self, perm, obj=None):
        return self.is_staff
    
    def has_module_perms(self, app_label):
        return self.is_staff

    class Meta:
        db_table = 'USUARIO'

class ESTACION_METEOROLOGICA(models.Model):
    codigo_nacional = models.CharField(max_length=100, primary_key=True)
    nombre_estacion = models.CharField(max_length=100)
    latitud = models.FloatField()
    longitud = models.FloatField()
    altura = models.IntegerField()

    class Meta:
        db_table = 'ESTACION_METEOROLOGICA'


class OFICINA(models.Model):
    id_oficina = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=250)
    georeferencia = models.CharField(max_length=250)

    class Meta:
        db_table = 'OFICINA'


class OFICINA_ESTACION(models.Model):
    id_oficinaestacion = models.AutoField(primary_key=True)
    principal = models.CharField(max_length=100)
    distancia_km = models.IntegerField()
    codigo_nacional = models.ForeignKey(
        ESTACION_METEOROLOGICA,
        on_delete=models.CASCADE,
        db_column='codigo_nacional'
    )
    id_oficina = models.ForeignKey(
        OFICINA,
        on_delete=models.CASCADE,
        db_column='id_oficina'
    )

    class Meta:
        db_table = 'OFICINA_ESTACION'


class MEDICION_METEOROLOGICA(models.Model):
    id_medicionmeteorologica = models.AutoField(primary_key=True)
    momento = models.DateTimeField()
    temperatura = models.FloatField()
    temperatura_minima_12h = models.FloatField()
    temperatura_maxima_12h = models.FloatField()
    humedad_relativa = models.FloatField()
    codigo_nacional = models.ForeignKey(
        ESTACION_METEOROLOGICA,
        on_delete=models.CASCADE,
        db_column='codigo_nacional'
    )

    class Meta:
        db_table = 'MEDICION_METEOROLOGICA'


class POSICION_SOLAR(models.Model):
    id_posicionsolar = models.AutoField(primary_key=True)
    momento = models.DateTimeField()
    elevacion = models.FloatField()
    azimut = models.FloatField()
    codigo_nacional = models.ForeignKey(
        ESTACION_METEOROLOGICA,
        on_delete=models.CASCADE,
        db_column='codigo_nacional'
    )

    class Meta:
        db_table = 'POSICION_SOLAR'


class TIPO_ZONA(models.Model):
    id_tipozona = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'TIPO_ZONA'


class ZONA(models.Model):
    id_zona = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=100)
    orientacion = models.CharField(max_length=100)
    superficie_m3 = models.IntegerField()
    cantidad_equipos = models.IntegerField()
    forma_svg = models.TextField()
    id_oficina = models.ForeignKey(
        OFICINA,
        on_delete=models.CASCADE,
        db_column='id_oficina'
    )
    id_tipozona = models.ForeignKey(
        TIPO_ZONA,
        on_delete=models.CASCADE,
        db_column='id_tipozona'
    )

    class Meta:
        db_table = 'ZONA'


class MATERIAL_ZONA(models.Model):
    id_material = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    cantidad_m2 = models.IntegerField()
    id_zona = models.ForeignKey(
        ZONA,
        on_delete=models.CASCADE,
        db_column='id_zona'
    )

    class Meta:
        db_table = 'MATERIAL_ZONA'


class SENSOR(models.Model):
    id_sensor = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=50)
    nombre = models.CharField(max_length=50)
    activo = models.BooleanField()
    id_zona = models.ForeignKey(
        ZONA,
        on_delete=models.CASCADE,
        db_column='id_zona'
    )

    class Meta:
        db_table = 'SENSOR'


class MEDICION_SENSOR(models.Model):
    id_medicionsensor = models.AutoField(primary_key=True)
    valor = models.IntegerField()
    unidad = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    id_sensor = models.ForeignKey(
        SENSOR,
        on_delete=models.CASCADE,
        db_column='id_sensor'
    )

    class Meta:
        db_table = 'MEDICION_SENSOR'

#######TABLA USADA EN SIMULACION WEB
'''
class HABITACION(models.Model):
    id_habitacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    forma_svg = models.TextField()
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table = 'HABITACION'
'''
#########################################

class THERMOSTATO(models.Model):
    id_thermostato = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    id_zona = models.ForeignKey(
        ZONA,
        on_delete=models.CASCADE,
        db_column='id_zona'
    )
    
    class Meta:
        db_table = 'THERMOSTATO'


class MEDICION_THERMOSTATO(models.Model):
    id_medicionthermostato = models.AutoField(primary_key=True)
    valor = models.FloatField()
    unidad = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    id_thermostato = models.ForeignKey(
        THERMOSTATO,
        on_delete=models.CASCADE,
        db_column='id_thermostato'
    )

    class Meta:
        db_table = 'MEDICION_THERMOSTATO'
