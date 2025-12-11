#!/bin/bash

# Configuration variables
SERVER_IP="122.166.253.254"          # Replace with your server IP address
SERVER_USER="zerozilla"              # Replace with your server username
SERVER_PATH="/var/www/html/react-app"
SITE_NAME="react-app"
DOMAIN_NAME="your-domain.com"        # Replace with your actual domain or use IP

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of React application to server${NC}"

# Optional: Build the React app
# echo -e "${YELLOW}Building React application...${NC}"
# npm run build

# Check dist directory
if [ ! -d "./dist" ]; then
  echo -e "${RED}Error: dist directory not found. Run 'npm run build' first.${NC}"
  exit 1
fi

# Create target directory
echo -e "${YELLOW}Creating target directory on server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "sudo mkdir -p ${SERVER_PATH}"

# Upload files to temporary location
echo -e "${YELLOW}Uploading dist files to server...${NC}"
scp -r ./dist ${SERVER_USER}@${SERVER_IP}:~/temp_dist

# Move files into web root and set permissions
ssh ${SERVER_USER}@${SERVER_IP} << EOF
  sudo rm -rf ${SERVER_PATH}/*
  sudo cp -r ~/temp_dist/dist/* ${SERVER_PATH}/
  rm -rf ~/temp_dist
  sudo chown -R www-data:www-data ${SERVER_PATH}
  sudo chmod -R 755 ${SERVER_PATH}
EOF

# Create Apache config
echo -e "${YELLOW}Creating Apache virtual host...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "sudo tee /etc/apache2/sites-available/${SITE_NAME}.conf > /dev/null << EOL
<VirtualHost *:83>
    ServerName ${DOMAIN_NAME}
    DocumentRoot ${SERVER_PATH}

    <Directory ${SERVER_PATH}>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>

    ErrorLog \${APACHE_LOG_DIR}/${SITE_NAME}-error.log
    CustomLog \${APACHE_LOG_DIR}/${SITE_NAME}-access.log combined
</VirtualHost>
EOL"

# Ensure Apache listens on port 83
echo -e "${YELLOW}Ensuring Apache listens on port 83...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "grep -q 'Listen 83' /etc/apache2/ports.conf || echo 'Listen 83' | sudo tee -a /etc/apache2/ports.conf"

# Enable Apache site and module
echo -e "${YELLOW}Enabling Apache site and mod_rewrite...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "sudo a2enmod rewrite && sudo a2ensite ${SITE_NAME}.conf"

# Test Apache config
echo -e "${YELLOW}Testing Apache configuration...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "sudo apache2ctl configtest"

# Restart Apache
echo -e "${YELLOW}Restarting Apache...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "sudo systemctl restart apache2"

echo -e "${GREEN}Deployment successful!${NC}"
echo -e "${GREEN}Visit: http://${SERVER_IP}:83 or http://${DOMAIN_NAME}:83${NC}"
