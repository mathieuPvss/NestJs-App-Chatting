#!/bin/sh

echo "Installation complète des dépendances..."
npm install --include=dev

echo "Vérification de vite..."
npm list vite

echo "Lancement de l'application..."
npm run dev -- --host 0.0.0.0
