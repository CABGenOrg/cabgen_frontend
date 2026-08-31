set dotenv-load

default:
    @just --list

# --- Docker ---

up:
    docker compose up -d --build

down:
    docker compose down

build:
    docker compose build

restart:
    docker compose down
    docker compose up -d --build

status:
    docker compose ps

logs:
    docker compose logs -f

# --- Podman ---

up-dev-podman:
    podman compose -f docker-compose.yaml -f docker-compose.override.yaml up -d --build

down-dev-podman:
    podman compose -f docker-compose.yaml -f docker-compose.override.yaml down

restart-dev-podman:
    podman compose -f docker-compose.yaml -f docker-compose.override.yaml down
    podman compose -f docker-compose.yaml -f docker-compose.override.yaml up -d --build

up-prod-podman:
    podman compose up -d --build

down-prod-podman:
    podman compose down

restart-prod-podman:
    podman compose down
    podman compose up -d --build

build-podman:
    podman compose build

status-podman:
    podman compose ps

logs-podman:
    podman compose logs -f
