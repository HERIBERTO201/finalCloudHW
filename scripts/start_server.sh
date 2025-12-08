#!/bin/bash
# 1. Configurar permisos para Apache (Frontend)
# Esto asegura que Apache pueda leer los archivos nuevos de React
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 2. Reiniciar Backend con PM2
cd /home/ubuntu/cloudhw-backend-deploy

# Verifica si el proceso ya existe para reiniciarlo o iniciarlo
if pm2 list | grep -q "cloudhw-api"; then
    pm2 restart cloudhw-api
else
    # Asegúrate de que server.js es tu archivo principal (lo vi en tu imagen)
    pm2 start server.js --name "cloudhw-api"
fi

# Guardar la lista de procesos para que revivan si el servidor se reinicia
pm2 save
