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

> JSON's de ejemplo para login y register

# REGISTER


```bash

{
    "username": "juanperez",
    "email": "juan@email.com",
    "password": "miPassword123"
}

```

# LOGIN

```bash

{
    "username": "juanperez",
    "password": "miPassword123"
}

```
