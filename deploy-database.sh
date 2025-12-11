#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration variables - update these
DB_TYPE="mysql"  # options: mysql, postgres
DB_DUMP_PATH="/path/to/your/database-dump.sql"
DB_NAME="your_database_name"
DB_USER="your_db_username"
DB_PASSWORD="your_db_password"
DB_HOST="localhost"
DB_PORT="3306"  # MySQL default, use 5432 for PostgreSQL

# Docker settings (if using Docker for database)
USE_DOCKER_FOR_DB=false
DB_CONTAINER_NAME="database"
MYSQL_DOCKER_IMAGE="mysql:8"
POSTGRES_DOCKER_IMAGE="postgres:14"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting database deployment process...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root${NC}"
  exit 1
fi

# Function to deploy MySQL database
deploy_mysql() {
  if [ "$USE_DOCKER_FOR_DB" = true ]; then
    echo -e "${GREEN}Setting up MySQL using Docker...${NC}"
    
    # Stop and remove existing container if it exists
    docker stop $DB_CONTAINER_NAME &>/dev/null || true
    docker rm $DB_CONTAINER_NAME &>/dev/null || true
    
    # Run MySQL container
    docker run -d --name $DB_CONTAINER_NAME \
      -p $DB_PORT:3306 \
      -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD \
      -e MYSQL_DATABASE=$DB_NAME \
      -e MYSQL_USER=$DB_USER \
      -e MYSQL_PASSWORD=$DB_PASSWORD \
      --restart=always \
      -v $(dirname $DB_DUMP_PATH):/docker-entrypoint-initdb.d \
      $MYSQL_DOCKER_IMAGE
      
    echo -e "${GREEN}MySQL container is running on port $DB_PORT${NC}"
    echo -e "${GREEN}Waiting for database to initialize...${NC}"
    sleep 30  # Give some time for MySQL to initialize
    
    # Import the database dump
    echo -e "${GREEN}Importing database dump...${NC}"
    docker exec -i $DB_CONTAINER_NAME mysql -u root -p$DB_PASSWORD $DB_NAME < $DB_DUMP_PATH
  else
    echo -e "${GREEN}Installing MySQL server...${NC}"
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
    
    # Start and enable MySQL
    systemctl start mysql
    systemctl enable mysql
    
    # Create database and user
    echo -e "${GREEN}Creating database and user...${NC}"
    mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';"
    mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';"
    mysql -e "FLUSH PRIVILEGES;"
    
    # Import the database dump
    echo -e "${GREEN}Importing database dump...${NC}"
    mysql $DB_NAME < $DB_DUMP_PATH
  fi
}

# Function to deploy PostgreSQL database
deploy_postgres() {
  if [ "$USE_DOCKER_FOR_DB" = true ]; then
    echo -e "${GREEN}Setting up PostgreSQL using Docker...${NC}"
    
    # Stop and remove existing container if it exists
    docker stop $DB_CONTAINER_NAME &>/dev/null || true
    docker rm $DB_CONTAINER_NAME &>/dev/null || true
    
    # Run PostgreSQL container
    docker run -d --name $DB_CONTAINER_NAME \
      -p $DB_PORT:5432 \
      -e POSTGRES_PASSWORD=$DB_PASSWORD \
      -e POSTGRES_USER=$DB_USER \
      -e POSTGRES_DB=$DB_NAME \
      --restart=always \
      -v $(dirname $DB_DUMP_PATH):/docker-entrypoint-initdb.d \
      $POSTGRES_DOCKER_IMAGE
      
    echo -e "${GREEN}PostgreSQL container is running on port $DB_PORT${NC}"
    echo -e "${GREEN}Waiting for database to initialize...${NC}"
    sleep 30  # Give some time for PostgreSQL to initialize
    
    # Import the database dump
    echo -e "${GREEN}Importing database dump...${NC}"
    docker exec -i $DB_CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < $DB_DUMP_PATH
  else
    echo -e "${GREEN}Installing PostgreSQL server...${NC}"
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib
    
    # Start and enable PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    # Create database and user
    echo -e "${GREEN}Creating database and user...${NC}"
    su - postgres -c "psql -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';\""
    su - postgres -c "psql -c \"CREATE DATABASE $DB_NAME OWNER $DB_USER;\""
    
    # Import the database dump
    echo -e "${GREEN}Importing database dump...${NC}"
    su - postgres -c "psql $DB_NAME < $DB_DUMP_PATH"
  fi
}

# Verify database dump file exists
if [ ! -f "$DB_DUMP_PATH" ]; then
  echo -e "${RED}Database dump file not found at $DB_DUMP_PATH${NC}"
  exit 1
fi

# Deploy the appropriate database type
if [ "$DB_TYPE" = "mysql" ]; then
  deploy_mysql
elif [ "$DB_TYPE" = "postgres" ]; then
  deploy_postgres
else
  echo -e "${RED}Unsupported database type: $DB_TYPE. Options are 'mysql' or 'postgres'${NC}"
  exit 1
fi

echo -e "${GREEN}Database deployment completed successfully!${NC}"
echo -e "Database name: $DB_NAME"
echo -e "Database user: $DB_USER"
echo -e "Database host: $DB_HOST"
echo -e "Database port: $DB_PORT"
