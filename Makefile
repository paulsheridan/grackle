.PHONY: up
up:
	docker-compose up -d

.PHONY: follow
follow:
	docker compose logs --follow backend

.PHONY: down
down:
	docker compose down

.PHONY: downv
downv:
	docker compose down -v

.PHONY: build
build:
	docker compose build

.PHONY: bash
bash:
	docker compose exec backend bash

.PHONY: migrate
migrate:
	docker exec -it booking-htmx-backend-1 alembic revision --autogenerate

.PHONY: upgrade
upgrade:
	alembic upgrade head

.PHONY: test
test:
	bash ./scripts/test.sh
