# Post Domain

This module encapsulates the core business rules and data contracts for blog Posts.

## Core Concepts

- **Post**: The root entity representing an article.
- **PostId, PostTitle, PostContent**: Value objects enforcing specific validation logic like UUID formats and length constraints.
- **PostStatus**: Enum (`DRAFT`, `PUBLISHED`, `UNPUBLISHED`) tracking the publishing lifecycle.
- **PostRepositoryPort**: The persistence abstraction implemented by the Infrastructure layer.

## Rules & Invariants

- A Post title must be between 3 and 200 characters (`InvalidPostTitleLengthError`).
- A Post content must be at least 10 characters long (`InvalidPostContentLengthError`).
- Posts start as `DRAFT`.
- A `DRAFT` can transition to `PUBLISHED`, and a `PUBLISHED` post can become `UNPUBLISHED`.
- You cannot change the title of a `PUBLISHED` post (`CannotChangePublishedPostTitleError`).
- Only valid state transitions are permitted (`InvalidPostStateTransitionError`).
