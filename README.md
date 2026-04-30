# M.A.M Des P'tits Aventuriers

Projet web complet pour une Maison d’Assistantes Maternelles.

## Stack technique
- Backend : Django + Django REST Framework
- Frontend : React + Bootstrap
- Base de données : MySQL
- Conteneurisation : Docker Compose

## Fonctionnalités
- Pages publiques dynamiques
- Authentification assistantes maternelles
- Gestion des contenus et images
- Disponibilités
- Tarifs + simulation
- Formulaire de contact
- FAQ
- Témoignages
- Responsive design

## Lancement avec Docker
```bash
docker compose up --build
```

## Lancement manuel

## Docker
```
docker compose up -d mysql
```
## Backend
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend
```
cd frontend
npm install
npm run dev
```


VITE_API_URL=http://127.0.0.1:8000/api/

Copier le fichier .env.example puis l’adapter selon votre environnement.