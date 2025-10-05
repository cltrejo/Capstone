# entorno virtual 

```bash
python -m venv env

cd .\env\Scripts\Activate.ps1

pip install -r requirements.txt

py manage.py runserver

```

# Como correr backend

```bash

py manage.py migrate

```

# CREAR SUPER USUARIO

```bash

py manage.py createsuperuser

python manage.py drf_create_token <username_del_superuser> (para obtener el token del superusuario y hacer las peticiones)


```
Pasar Token a Yaak mediante Headers

Authorization: Token <token_value>

# CREAR USUARIO

> http://localhost:8000/api/registro/  POST

```bash
{
    "username": "juanperez",
    "email": "juan@email.com",
    "password": "miPassword123"
}
```

# LOGIN 

> http://localhost:8000/api/login/ POST

```bash
{
    "username": "juanperez",
    "password": "miPassword123"
}
```


# CREACIÓN DE HABITACIONES

>http://localhost:8000/api/lista_habitaciones/ POST

```bash
{
    "nombre": "Sala Principal",
    "descripcion": "Sala de estar principal con sensor de temperatura",
    "forma_svg": "<svg width=\"100%\" height=\"auto\" viewBox=\"0 0 400 300\" style={{maxWidth: \"52%\"}}>\r\n            <path \r\n                d=\"M50,50 L350,50 L350,250 L280,250 L280,200 L220,200 L220,250 L50,250 Z\" \r\n                fill={fillColor}\r\n                stroke=\"#081FF6\" \r\n                strokeWidth=\"4\"\r\n                strokeOpacity=\"0.7\"\r\n                style={{\r\n                    transition: \"fill 0.8s ease-in-out\" // Transición suave\r\n                }}\r\n            />\r\n        </svg>"
}
```
//

```bash

 {
    "nombre": "Sala en L",
    "descripcion": "Sala con forma de L para esquina",
    "forma_svg": "<svg width=\"100%\" height=\"auto\" viewBox=\"0 0 400 300\" style=\"max-width: 52%\">\n    <path d=\"M50,50 L250,50 L250,150 L350,150 L350,250 L150,250 L150,150 L50,150 Z\" fill=\"#99CA88\" stroke=\"#081FF6\" stroke-width=\"4\" stroke-opacity=\"0.7\" style=\"transition: fill 0.8s ease-in-out\"/>\n</svg>"
  }

```

# CREACIÓN DE SENSORES

> http://localhost:8000/api/lista_sensores/ POST

```bash
{
    "tipo": "temperatura",
    "nombre": "Sensor Temperatura Sala",
    "activo": true,
    "id_habitacion": 1
}
```

```bash
{
    "tipo": "temperatura",
    "nombre": "Sensor Temperatura Sala en forma de L",
    "activo": true,
    "id_habitacion": 2
}
```

