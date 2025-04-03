from django.test import TestCase
from django.urls import reverse

class HomeViewTestCase(TestCase):
    def setUp(self):
        # Aquí configuramos la URL a la que vamos a hacer las peticiones
        self.url = reverse('home')  # Cambia 'home' si tu URL tiene otro nombre
    
    def test_home_view_get(self):
        """
        Test para asegurarse de que la vista de inicio responde correctamente a una solicitud GET.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Bienvenido a la búsqueda de Pokémon")
        self.assertContains(response, "Escribe el nombre de un Pokémon para obtener su peso.")
    

    
    def test_home_view_post_valid_pokemon(self):
        """
        Test para manejar una entrada válida de Pokémon.
        Simula un POST con el nombre de un Pokémon válido (Pikachu).
        """
        response = self.client.post(self.url, {'name': 'pikachu'})
        self.assertEqual(response.status_code, 200)
        
        # Verificamos que el HTML contiene el nombre del Pokémon (Pikachu)
        self.assertContains(response, "<h2>Resultados para: Pikachu</h2>")
        
        # Verificamos que el HTML contiene el peso y la altura
        self.assertContains(response, "<strong>Peso:</strong>")
        self.assertContains(response, "<strong>Altura:</strong>")
        
        # Verificamos que los valores no son vacíos o nulos
        self.assertNotContains(response, "Peso: 0 kg")  # Aseguramos que el peso no sea 0
        self.assertNotContains(response, "Altura: 0 m")  # Aseguramos que la altura no sea 0

    def test_home_view_post_empty_name(self):
        """
        Test para manejar una entrada vacía de nombre de Pokémon.
        """
        response = self.client.post(self.url, {'name': ''})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Escribe el nombre de un Pokémon para obtener su peso.")
