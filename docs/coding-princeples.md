# Coding Principles

## Function Declarations vs Arrow Functions

Use function declarations for:
- Reusable utility functions (shared helpers in `utils/`, `helpers/`, `config/`).
- Shared validation logic and type guards.
- Clear, readable, hoisted logic that benefits from top-down reading.

Use `const` + arrow functions for:
- Inline functions and small callbacks.
- Functional programming utilities (e.g., `map`, `filter`, `reduce` callbacks).
- Anonymous handlers (event listeners, middleware callbacks).

Examples:

```ts
export function parseToken(input: string): TokenPayload {
  // reusable utility
  return decode(input);
}

const values = items.map((item) => item.value);
```

## Naming Conventions

Variables and properties:
- `camelCase` for variables, parameters, and object properties.
- `is/has/should/can` prefixes for booleans (`isActive`, `hasAccess`).
- `UPPER_SNAKE_CASE` for module-level constants and env keys.

Classes and types:
- `PascalCase` for classes, interfaces, and types.
- Use explicit suffixes for clarity:
  - `Dto` for DTO classes
  - `Entity` for TypeORM entities
  - `Service`, `Controller`, `Module`, `Gateway`, `Strategy`
  - `Options`, `Config`, `Params` for config/value objects

Enums:
- `PascalCase` enum names (`AccountStatus`).
- `UPPER_SNAKE_CASE` enum values when used as constants.

## File and Directory Naming

General:
- Use `kebab-case` filenames.
- Match file name with exported symbol when possible.

Common suffixes:
- `*.dto.ts` for DTO classes
- `*.entity.ts` for entities
- `*.service.ts` for services
- `*.controller.ts` for controllers
- `*.module.ts` for modules
- `*.config.ts` for configuration loaders
- `*.option.ts` for option factories/builders
- `*.type.ts` for type aliases
- `*.enum.ts` for enums
- `*.const.ts` for constants
- `*.helper.ts` or `*.util.ts` for utilities

Directories:
- `dto/`, `types/`, `config/`, `helpers/`, `utils/` for shared primitives.
- Keep domain and persistence layers separated (e.g., `domain/`, `infrastructure/`).

## Class and File Alignment

Preferred alignment:
- `AccountService` in `account.service.ts`
- `AccountDto` in `dto/account.dto.ts`
- `AccountEntity` in `entities/account.entity.ts`
- `AccountStatus` in `types/account-status.enum.ts` (or `account-enum.type.ts`)

## Consistency Rules

- Avoid mixing function styles in the same module unless justified.
- Prefer explicit, descriptive names over abbreviations.
- Keep config and helper functions pure where possible.
