import importlib
from django.test import SimpleTestCase


class TestBackendConfig(SimpleTestCase):
    def test_backend_settings_loaded(self):
        settings = importlib.import_module('backend.settings')
        self.assertEqual(settings.ROOT_URLCONF, 'backend.urls')
        self.assertIn('core', settings.INSTALLED_APPS)
        self.assertIn('rest_framework', settings.INSTALLED_APPS)
        self.assertIn('corsheaders', settings.INSTALLED_APPS)
        # Durante tests usamos sqlite
        self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')

    def test_backend_urls_patterns(self):
        urls = importlib.import_module('backend.urls')
        self.assertTrue(hasattr(urls, 'urlpatterns'))
        # Debe haber al menos dos rutas: admin y core
        self.assertGreaterEqual(len(urls.urlpatterns), 2)

    def test_backend_asgi_wsgi_apps_exist(self):
        asgi = importlib.import_module('backend.asgi')
        wsgi = importlib.import_module('backend.wsgi')
        self.assertTrue(hasattr(asgi, 'application'))
        self.assertTrue(hasattr(wsgi, 'application'))