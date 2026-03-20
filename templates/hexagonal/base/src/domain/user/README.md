# User Domain

This module encapsulates the core business rules, entities, and data contracts related to the User aggregate.

## Core Concepts

- **User**: The root entity. Responsible for invariants like name validation and email updates.
- **UserId & Email**: Value Objects that encapsulate type-safety and formatting rules (e.g., email lowercase normalization, UUID structural mapping).
- **UserRepositoryPort**: The abstraction (interface) for persistence that the Application layer relies upon. The actual implementation lives in `infrastructure/user/persistence/`.

## Rules & Invariants

- A User's name must be between 2 and 100 characters (`InvalidNameError`).
- Emails are always stored, validated, and compared in lowercase format (`InvalidEmailError`).
- You cannot change an email to the exact same value (`EmailAlreadySetError`).
