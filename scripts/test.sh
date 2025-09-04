#!/bin/bash
# Script para rodar testes via Docker

echo "🧪 Running tests with Docker..."

# Start database
docker-compose up -d db

# Run tests based on argument
case $1 in
  "php")
    docker-compose run --rm backend php artisan test --env=testing "$2"
    ;;
  "node")
    docker-compose run --rm frontend npm test -- "$2"
    ;;
  "all")
    docker-compose run --rm backend php artisan test --env=testing
    docker-compose run --rm frontend npm test -- --passWithNoTests
    ;;
  *)
    echo "Usage: ./scripts/test.sh [php|node|all] [args]"
    exit 1
    ;;
esac

# Capture exit code
EXIT_CODE=$?

# Stop containers
docker-compose down

exit $EXIT_CODE