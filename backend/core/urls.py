from django.urls import path
from .views import registro, login, VerifyTokenView, lista_habitaciones, lista_thermostatos, lista_mediciones, detalle_habitacion, historico_thermostato, simular_temperatura, sensores_por_habitacion

urlpatterns = [
    path('api/registro/', registro, name='registro'),
    path('api/login/', login, name='login'),
    path("api/verify-token/", VerifyTokenView, name="verify_token"),
    path("api/lista_habitaciones/", lista_habitaciones, name="lista_habitaciones"),
    path("api/lista_thermostatos/", lista_thermostatos, name="lista_thermostatos"),
    path("api/lista_mediciones/", lista_mediciones, name="lista_mediciones"),
    path("api/detalle_habitacion/<id>", detalle_habitacion, name="detalle_habitacion"),
    path("api/thermostatos/<id>/mediciones/", historico_thermostato, name="historico_thermostato"),
    path("api/simular_temperatura/", simular_temperatura, name="simular_temperatura"),
    path('api/habitaciones/<int:id_habitacion>/sensores/', sensores_por_habitacion, name="sensores_por_habitacion")
]