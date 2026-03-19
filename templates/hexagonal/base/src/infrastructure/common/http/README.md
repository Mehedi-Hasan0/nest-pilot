# HTTP Sub-layer

This sub-layer handles delivery of our application via REST APIs.

## What belongs here

- **Controllers**: Entry points for HTTP requests. They validate input DTOs and invoke Application Use Cases.
- **HTTP DTOs**: Data structures decorated with `class-validator` for request validation.
- **Presenters**: Logic for mapping Application DTOs to final HTTP responses.

## What is strictly forbidden

- **Business Logic**: Controllers should be ultra-thin. If you see complex `if/else` logic here, it should be moved to a Use Case or Entity.
- **Direct Database Calls**: Never use a Repository or Query builder directly in a controller.

## Why this boundary exists

The HTTP layer is just one way to "drive" the application. By keeping it isolated, we can easily add other triggers (CLI commands, Cron jobs, Message Queue handlers) without duplicating code or coupling our logic to the specific behavior of the Express/Fastify request-response lifecycle.
