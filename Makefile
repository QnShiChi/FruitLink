.PHONY: up down logs ps restart build shell-api shell-web db-studio

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

ps:
	docker compose ps

restart:
	docker compose restart

build:
	docker compose build

shell-api:
	docker compose exec api sh

shell-web:
	docker compose exec web sh

db-studio:
	docker compose exec api pnpm exec prisma studio --hostname 0.0.0.0 --port 5555
