from django.urls import path
from .views import registro, login, VerifyTokenView, lista_habitaciones, lista_sensores, lista_mediciones, detalle_habitacion

urlpatterns = [
    path('api/registro/', registro, name='registro'),
    path('api/login/', login, name='login'),
    path("api/verify-token/", VerifyTokenView, name="verify_token"),
    path("api/lista_habitaciones/", lista_habitaciones, name="lista_habitaciones"),
    path("api/lista_sensores/", lista_sensores, name="lista_sensores"),
    path("api/lista_mediciones/", lista_mediciones, name="lista_mediciones"),
    path("api/detalle_habitacion/<id>", detalle_habitacion, name="detalle_habitacion"),
]