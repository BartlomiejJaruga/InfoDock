# Wybierz obraz bazowy
FROM python:3.10-slim

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj wymagania i zainstaluj zależności
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Skopiuj cały kod źródłowy
COPY . .

# Ustaw port (opcjonalne, pomocne dla dokumentacji)
EXPOSE 5000

# Uruchom aplikację
CMD ["python", "run.py"]