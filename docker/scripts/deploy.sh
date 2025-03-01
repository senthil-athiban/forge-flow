#!/bin/bash

ENV=$1
ACTION=$2
COMPOSE_DIR=".."

if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
    echo "Usage: ./deploy.sh [dev|prod] [up|down|build|logs]"
    exit 1
fi

COMPOSE_FILE="$COMPOSE_DIR/docker-compose.${ENV}.yml"

case $ACTION in
    "up")
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "down")
        docker-compose -f $COMPOSE_FILE down
        ;;
    "build")
        docker-compose -f $COMPOSE_FILE build
        ;;
    "logs")
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    *)
        echo "Invalid action. Use: up, down, build, or logs"
        exit 1
        ;;
esac