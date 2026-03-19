# templates/hexagonal/src/infrastructure/

The **Infrastructure Layer** contains all adapters to the outside world. This includes UI delivery (HTTP APIs, GraphQL) and persistence mechanisms (TypeORM, raw SQL, external APIs).

## The Prime Directive

**This is the ONLY layer allowed to know about databases or HTTP frameworks. However, this layer is absolutely forbidden from containing any business logic.**

## What belongs here

- **Controllers**: NestJS classes decorated with `@Controller()`, handling HTTP requests and responses. They convert HTTP payload DTOs into Use Case Commands.
- **ORM Entities**: Classes decorated with `@Entity()` representing exactly how data is laid out in tables (e.g., `UserOrmEntity`).
- **Repository Adapters**: Concrete classes implementing the abstract `@nestjs/common` `Port` interfaces from the Domain Layer (e.g., `UserRepositoryAdapter implements UserRepositoryPort`).
- **Mappers**: Crucial utility classes that transform `OrmEntity` to `DomainEntity` and vice-versa.

## What is strictly forbidden here

- **No Business Logic**: Do not validate if an email format is correct here, or if a Post is allowed to be published. That belongs in the Domain layer (`ValueObject` or `Entity`).
- **No Direct Domain Saving**: Do not pass a Domain Entity raw to TypeORM's `save()` method. Always run it through a Mapper (`UserMapper.toOrm()`) first.

## The Mapper Law

**The outside world never sees the inside world natively.**
TypeORM models must never cross the border into the Application or Domain layers. When a Use Case calls `await this.repository.findById(id)`, the adapter must fetch the ORM entity from the database, use a Mapper to reconstruct the pure Domain Entity, and return that Domain Entity.
