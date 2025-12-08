#!/bin/bash
cd /home/ubuntu/cloudhw-backend-deploy

echo "Instalando dependencias del backend..."
npm install

echo "Instalando PM2 si no existe..."
sudo npm install -g pm2
