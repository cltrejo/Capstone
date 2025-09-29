from django.urls import path
from .views import registro, login, VerifyTokenView

urlpatterns = [
    path('api/registro/', registro, name='registro'),
    path('api/login/', login, name='login'),
    path("api/verify-token/", VerifyTokenView, name="verify_token"),
]