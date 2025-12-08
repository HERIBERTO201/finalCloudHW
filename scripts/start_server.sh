#!/bin/bash

cd /home/ubuntu/cloudhw-backend-deploy

echo "Deteniendo proceso anterior..."
pm2 stop cloudhw-backend || true
pm2 delete cloudhw-backend || true

echo "Iniciando backend con PM2..."
pm2 start index.js --name cloudhw-backend

pm2 save
