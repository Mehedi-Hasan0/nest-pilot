# Persistence Sub-layer (TypeORM)

This sub-layer handles the translation between our pure Domain Entities and the database via TypeORM.

## What belongs here

- **ORM Entities**: Database-specific representations of our data (e.g., `UserOrmEntity`).
- **Repository Adapters**: Concrete implementations of the Domain Ports (e.g., `UserRepositoryAdapter`).
- **Mappers**: Pure functions to map between Domain and ORM models.

## What is strictly forbidden

- **Business Logic**: Never put validation or state transition rules in a Mapper or Repository.
- **Leaking ORM Models**: Never return an `OrmEntity` from a repository; always map it back to a Domain Entity first.

## Why this boundary exists

By separating the ORM from the Domain, we ensure that changes to our database schema do not force changes to our business logic. This allows us to swap TypeORM for another persistence tool (like Prisma or MikroORM) by only touching this layer.
