# UMKM Profit Calculator — Architecture Document

## 1. Clean Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                      │
│  Screens / Components / Navigation / Hooks               │
│  (React Native)                                          │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                       │
│  Zustand Stores / Use Cases / DTOs / Validation (Zod)   │
├─────────────────────────────────────────────────────────┤
│                   Domain Layer                            │
│  Entities / Repository Interfaces / Value Objects         │
│  (Pure TypeScript — no dependencies)                     │
├─────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                    │
│  SQLite Database / Repository Implementations / Mappers  │
│  (expo-sqlite)                                           │
└─────────────────────────────────────────────────────────┘
```

## 2. Layer Dependencies

- **Domain** — No external dependencies. Pure business logic.
- **Application** — Depends only on Domain.
- **Infrastructure** — Depends on Domain + external libs (expo-sqlite).
- **Presentation** — Depends on Application + Domain.

## 3. Folder Structure

```
src/
├── app/                          # App entry, providers
│   ├── app.tsx
│   └── providers.tsx
│
├── domain/                       # Enterprise business logic
│   ├── entities/                 # Core business objects
│   ├── repositories/             # Abstract repository interfaces
│   └── value-objects/            # Immutable value objects (Money, Percentage)
│
├── application/                  # Use cases & state management
│   ├── stores/                   # Zustand stores
│   ├── use-cases/                # Business rules
│   ├── dtos/                     # Zod schemas & DTOs
│   └── errors/                   # App error classes
│
├── infrastructure/               # Data layer
│   ├── database/
│   │   ├── migrations/           # SQLite migrations
│   │   ├── repositories/         # SQLite implementations
│   │   ├── mappers/              # DB row <-> Domain entity
│   │   └── database.ts           # DB initialization
│   └── repository-initializer.ts
│
├── presentation/                 # UI layer
│   ├── navigation/               # React Navigation setup
│   ├── screens/                  # Feature-based screens
│   │   ├── dashboard/
│   │   ├── raw-material/
│   │   ├── product/
│   │   ├── recipe/
│   │   ├── hpp/
│   │   ├── margin/
│   │   ├── profit/
│   │   └── history/
│   ├── components/
│   │   ├── ui/                   # Reusable primitives
│   │   └── shared/               # Domain-specific components
│   └── hooks/                    # Custom hooks
│
└── shared/                       # Shared utilities
    ├── constants/                # Colors, spacing, units
    ├── types/                    # Common types
    └── utils/                    # Formatters, helpers
```

## 4. Database Schema & Relationships

```
raw_materials ────┐
                  │
recipes ──────────┤
 (junction)       │   1:N
                  │
products ─────────┤
                  │
calculations ─────┤
                  │
margin_simulations┤
                  │
profit_analyses ──┘

Tables:
- raw_materials (id, name, unit, price_per_unit, stock_quantity, ...)
- products (id, name, description, selling_price, is_active, ...)
- recipes (id, product_id FK, raw_material_id FK, quantity, unit)
- calculations (id, product_id FK, total_hpp, hpp_per_unit, ...)
- margin_simulations (id, calculation_id FK, product_id FK, ...)
- profit_analyses (id, product_id FK, total_revenue, net_profit, ...)
```

## 5. Data Flow

```
Screen (View)
  ↓ dispatch action
Store (Zustand)
  ↓ calls
Use Case (business logic, validation)
  ↓ calls
Repository Interface (contract)
  ↓ implements
SQLite Repository (expo-sqlite)
  ↓ reads/writes
Database (SQLite)
```

## 6. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Folders | kebab-case | `raw-material/` |
| Files (all) | kebab-case | `raw-material.entity.ts` |
| Interfaces | PascalCase | `RawMaterialRepository` |
| Types | PascalCase | `UnitType` |
| Functions | camelCase | `formatCurrency()` |
| Stores | camelCase | `useRawMaterialStore` |
| Screens | PascalCase + Screen | `DashboardScreen` |
| DTO Schemas | camelCase | `createRawMaterialSchema` |
| Use Cases | camelCase | `calculateHppUseCase` |
| Constants | UPPER_SNAKE | `UNIT_LABELS` |

## 7. Validation & Error Handling

- **Zod schemas** in `application/dtos/` define validation rules per feature.
- **Use cases** validate input with Zod before processing.
- **AppError** class carries error code (`VALIDATION_ERROR`, `NOT_FOUND`, etc.)
- **ErrorBoundary** catches React render errors at the presentation layer.
- **UI Store toast system** shows user-friendly error/success messages.

## 8. Form Handling Strategy

```
Screen
  ↓ useAppForm({ schema, defaultValues, onSubmit })
React Hook Form + Zod Resolver
  ↓
Validation via Zod schema
  ↓
On success → Store action → Use Case → Repository
  ↓
On error → Toast notification
```

## 9. Dependency Injection Approach

Dependencies are injected at initialization time in `providers.tsx`:

1. `initializeDatabase()` opens SQLite and runs migrations
2. `initializeRepositories(db)` creates concrete repository instances
3. Each Zustand store receives its repository via `setRepository()`
4. Screens consume stores via React hooks

## 10. File Count Summary

| Layer | Files |
|-------|-------|
| Config | 5 |
| Domain Entities | 7 |
| Domain Repositories | 6 |
| Domain Value Objects | 2 |
| Application DTOs | 4 |
| Application Errors | 1 |
| Application Stores | 4 |
| Application Use Cases | 4 |
| Infrastructure Database | 4 |
| Infrastructure Repositories | 6 |
| Infrastructure Mappers | 4 |
| Navigation | 2 |
| UI Components | 7 |
| Shared Components | 2 |
| Hooks | 2 |
| Screens | 8 |
| Shared Constants | 3 |
| Shared Types | 1 |
| Shared Utils | 2 |
| **Total** | **~74 files** |
