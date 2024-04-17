.PHONY: up
up:
	docker compose up -d

.PHONY: down
down:
	docker compose down

.PHONY: down-v
down-v:
	docker compose down -v

.PHONY: build
build:
	docker compose build

.PHONY: bash
bash:
	docker compose exec backend bash

.PHONY: db-migrate
db-migrate:
	docker exec -it booking-htmx-backend-1 alembic revision --autogenerate

.PHONY: db-upgrade
db-upgrade:
	alembic upgrade head
