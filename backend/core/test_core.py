from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import HABITACION, THERMOSTATO, MEDICION_THERMOSTATO
from rest_framework.authtoken.models import Token
from .serializers import HabitacionSerializer, ThermostatoSerializer


class TestCoreAPI(APITestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        extra = {}
        if hasattr(User, 'tipo_usuario'):
            extra['tipo_usuario'] = 'ADMIN'
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="secret123",
            **extra,
        )
        # Crear token para autenticación por header
        self.token = Token.objects.create(user=self.user)
        self.auth_header = {"HTTP_AUTHORIZATION": f"Token {self.token.key}"}

        # Datos base
        self.habitacion = HABITACION.objects.create(
            nombre="Sala Norte",
            descripcion="Reuniones",
            forma_svg="<svg></svg>",
        )
        self.thermo = THERMOSTATO.objects.create(
            nombre="T-N-01",
            id_habitacion=self.habitacion,
        )
        MEDICION_THERMOSTATO.objects.create(
            id_thermostato=self.thermo,
            valor=24,
            unidad="°C",
            timestamp="2025-01-01T12:00:00Z",
        )

    # Nota: se omiten tests que dependen de TokenAuth explícito (registro/login/verify-token)

    def test_protegidos_requieren_auth(self):
        resp = self.client.get("/api/lista_habitaciones/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_registro_usuario(self):
        data = {
            "username": "juanperez",
            "email": "juan@example.com",
            "password": "MiPassword123",
            "first_name": "Juan",
            "last_name": "Pérez",
        }
        resp = self.client.post("/api/registro/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("token", resp.data)
        self.assertIn("user", resp.data)

    def test_login_usuario_ok_y_bad_credentials(self):
        # OK
        data_ok = {"username": "tester", "password": "secret123"}
        resp_ok = self.client.post("/api/login/", data_ok, format="json")
        self.assertEqual(resp_ok.status_code, status.HTTP_200_OK)
        # Bad credentials
        data_bad = {"username": "tester", "password": "wrong"}
        resp_bad = self.client.post("/api/login/", data_bad, format="json")
        self.assertEqual(resp_bad.status_code, status.HTTP_400_BAD_REQUEST)

        # Falta campo
        resp_missing = self.client.post("/api/login/", {"username": "tester"}, format="json")
        self.assertEqual(resp_missing.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_token_ok_y_missing_header(self):
        # Válido
        resp = self.client.post("/api/verify-token/", **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Falta header
        resp2 = self.client.post("/api/verify-token/")
        self.assertEqual(resp2.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_verify_token_invalido(self):
        resp = self.client.post("/api/verify-token/", HTTP_AUTHORIZATION="Token invalido")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_crud_habitacion(self):
        # Crear
        data = {"nombre": "Sala Sur", "descripcion": "Operaciones", "forma_svg": "<svg/>"}
        self.client.force_authenticate(user=self.user)
        resp_create = self.client.post("/api/lista_habitaciones/", data, format="json")
        self.assertEqual(resp_create.status_code, status.HTTP_201_CREATED)
        hid = resp_create.data.get("id_habitacion")

        # Listar
        resp_list = self.client.get("/api/lista_habitaciones/")
        self.assertEqual(resp_list.status_code, status.HTTP_200_OK)
        self.assertTrue(len(resp_list.data) >= 1)

        # Detalle
        resp_detail = self.client.get(f"/api/detalle_habitacion/{hid}")
        self.assertEqual(resp_detail.status_code, status.HTTP_200_OK)

        # Patch
        resp_patch = self.client.patch(
            f"/api/detalle_habitacion/{hid}",
            {"descripcion": "Operaciones (actualizada)"},
            format="json",
        )
        self.assertEqual(resp_patch.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(resp_patch.data.get("descripcion"), "Operaciones (actualizada)")

        # Delete
        resp_del = self.client.delete(f"/api/detalle_habitacion/{hid}")
        self.assertEqual(resp_del.status_code, status.HTTP_204_NO_CONTENT)

    def test_detalle_habitacion_404(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get("/api/detalle_habitacion/9999")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_habitacion_create_bad_request(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post("/api/lista_habitaciones/", {"nombre": "X"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_detalle_habitacion_patch_bad_request(self):
        self.client.force_authenticate(user=self.user)
        # Crear una habitación
        h = HABITACION.objects.create(nombre="Sala Patch", descripcion="", forma_svg="<svg/>")
        # Enviar PATCH inválido
        resp = self.client.patch(f"/api/detalle_habitacion/{h.id_habitacion}", {"forma_svg": None}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registro_usuario_campos_obligatorios(self):
        resp = self.client.post("/api/registro/", {"email": "a@b.com"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registro_usuario_existente(self):
        # Intentar registrar un username ya existente
        resp = self.client.post("/api/registro/", {
            "username": "tester",
            "email": "dup@example.com",
            "password": "secret123"
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_thermostatos_list_create(self):
        # List
        self.client.force_authenticate(user=self.user)
        resp_list = self.client.get("/api/lista_thermostatos/")
        self.assertEqual(resp_list.status_code, status.HTTP_200_OK)
        # Create
        data = {"nombre": "T-S-01", "id_habitacion": self.habitacion.id_habitacion}
        resp_create = self.client.post("/api/lista_thermostatos/", data, format="json")
        self.assertEqual(resp_create.status_code, status.HTTP_201_CREATED)

    def test_thermostatos_create_bad_request(self):
        self.client.force_authenticate(user=self.user)
        # Falta nombre
        data = {"id_habitacion": self.habitacion.id_habitacion}
        resp = self.client.post("/api/lista_thermostatos/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mediciones_list_create(self):
        # List
        self.client.force_authenticate(user=self.user)
        resp_list = self.client.get("/api/lista_mediciones/")
        self.assertEqual(resp_list.status_code, status.HTTP_200_OK)
        # Create
        data = {
            "valor": 25,
            "unidad": "°C",
            "timestamp": "2025-01-01T13:00:00Z",
            "id_thermostato": self.thermo.id_thermostato,
        }
        resp_create = self.client.post("/api/lista_mediciones/", data, format="json")
        self.assertEqual(resp_create.status_code, status.HTTP_201_CREATED)

    def test_mediciones_create_bad_request(self):
        self.client.force_authenticate(user=self.user)
        # Falta campos
        data = {"valor": 25}
        resp = self.client.post("/api/lista_mediciones/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_historico_thermostato(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(f"/api/thermostatos/{self.thermo.id_thermostato}/mediciones/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(resp.data, list))

    def test_historico_thermostato_404(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get("/api/thermostatos/9999/mediciones/")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_sensores_por_habitacion(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(f"/api/habitaciones/{self.habitacion.id_habitacion}/sensores/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(resp.data, list))

    def test_simular_temperatura(self):
        # Antes de simular, contamos mediciones
        count_before = MEDICION_THERMOSTATO.objects.filter(id_thermostato=self.thermo).count()
        self.client.force_authenticate(user=self.user)
        resp = self.client.post("/api/simular_temperatura/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        count_after = MEDICION_THERMOSTATO.objects.filter(id_thermostato=self.thermo).count()
        self.assertTrue(count_after >= count_before)

    def test_serializers(self):
        # HabitacionSerializer: temperatura_actual derivada de última medición del termostato de la habitación
        h_ser = HabitacionSerializer(self.habitacion)
        temp_actual = h_ser.data.get("temperatura_actual")
        self.assertIsNotNone(temp_actual)

        # ThermostatoSerializer: ultima_medicion
        t_ser = ThermostatoSerializer(self.thermo)
        ultima = t_ser.data.get("ultima_medicion")
        self.assertIsNotNone(ultima)

    def test_serializer_paths_none(self):
        # Habitacion sin termostato
        h = HABITACION.objects.create(nombre="Sala Vacía", descripcion="", forma_svg="<svg/>")
        h_ser = HabitacionSerializer(h)
        self.assertIsNone(h_ser.data.get("temperatura_actual"))

        # Thermostato sin mediciones
        t = THERMOSTATO.objects.create(nombre="T-Empty", id_habitacion=self.habitacion)
        t_ser = ThermostatoSerializer(t)
        self.assertIsNone(t_ser.data.get("ultima_medicion"))

# Create your tests here.
