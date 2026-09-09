# MineMind AI — Coding Standards & Engineering Guidelines

## 1. Core Principles
- **Clarity over Cleverness**: Industrial control software must be predictable, resilient, and easy to audit.
- **Fail-Safe Defaults**: Health degradation algorithms, hazard levels, and sensor alerts must always fail towards heightened safety.
- **Zero Filler / Meaningful Code**: Every line of code, entity, controller, and DTO must serve a distinct functional or architectural purpose.
- **Strict Layering**:
  - Controllers only handle validation and HTTP contract translation.
  - Services encapsulate pure business logic and transaction boundaries.
  - Repositories encapsulate database access.

---

## 2. Java Backend Standards
- **Java 21**: Utilize record types, pattern matching, virtual threads where applicable.
- **Lombok**: Use `@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor` cleanly.
- **Validation**: Enforce Jakarta Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Min`).
- **Exceptions**: Never return raw stack traces. Route everything through `GlobalExceptionHandler`.

---

## 3. Python AI Standards
- **Python 3.12+**: Enforce type hints across all functions and models.
- **Pydantic v2**: Use `BaseModel` and `Field` for input/output schemas.
- **Async First**: Use `async def` for I/O bound endpoints.

---

## 4. Frontend Standards
- **React 18 + TypeScript**: Strict mode enabled with zero `any` types wherever possible.
- **Tailwind CSS**: Use theme colors (`mine-dark`, `mine-amber`, `mine-emerald`, `mine-red`) rather than hardcoded hex values.
- **Industrial UX**: Dark theme, high data density, clear status badges, and loading/empty state fallbacks for every view.
