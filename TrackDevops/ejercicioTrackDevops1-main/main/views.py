import requests
from django.shortcuts import render

def home_view(request):
    if request.method == "POST":
        name = request.POST.get('name', '').strip().lower()
        if not name:
            return render(request, 'index.html', {'error': 'Por favor ingresa el nombre de un Pokémon'})
        
        # Llamada a la API de Pokémon
        url = f"https://pokeapi.co/api/v2/pokemon/{name}"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            pokemon_data = {
                'name': data['name'].capitalize(),
                'weight': data['weight'] / 10,  # Convertir a kg
                'height': data['height'] / 10,  # Convertir a metros
            }
            return render(request, 'index.html', {'pokemon_data': pokemon_data})
        else:
            return render(request, 'index.html', {'error': f"No se encontró información para '{name}'."})
    
    return render(request, 'index.html')
