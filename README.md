<div align="center">

# Asset Inventory Management System

### نظام حصر الأصول

**Arabic-first enterprise frontend for managing organizational assets, requests, permissions, reports, QR labels, and audit activities.**

![Status](https://img.shields.io/badge/status-Frontend%20Release%20Candidate-2A3172)
![Sprint](https://img.shields.io/badge/sprint-2.5-D0A165)
![React](https://img.shields.io/badge/React-18.3.1-20232A?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Direction](https://img.shields.io/badge/UI-Arabic%20RTL-4F7C5A)
![Backend](https://img.shields.io/badge/backend-Planned-lightgrey)

</div>

<div dir="rtl" align="right">

## نبذة مختصرة

نظام حصر الأصول هو نموذج واجهة مؤسسية باللغة العربية يهدف إلى توحيد إدارة الأصول داخل الجهة، وتقليل الاعتماد على ملفات Excel المتعددة، وتحسين البحث والتتبع والموافقات وإعداد التقارير. يدعم النظام خمسة أدوار بصلاحيات ونطاقات بيانات مختلفة، ويوفر واجهات لإدارة الأصول والطلبات والتقارير ورموز QR وسجل المراجعة والإعدادات.

النسخة الحالية هي **Frontend Release Candidate** تعتمد على بيانات وخدمات تجريبية. لم يتم حتى الآن تنفيذ الخادم الخلفي أو قاعدة PostgreSQL أو المصادقة المؤسسية الفعلية. تم تجهيز بنية الواجهة لتسهيل استبدال الخدمات التجريبية بـ REST APIs في المرحلة القادمة.

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Current Delivery Status](#current-delivery-status)
- [Problem and Proposed Solution](#problem-and-proposed-solution)
- [Implemented Features](#implemented-features)
- [Roles, Permissions, and Data Scope](#roles-permissions-and-data-scope)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Application Data and Persistence](#application-data-and-persistence)
- [Security and Authorization Notes](#security-and-authorization-notes)
- [Quality Assurance](#quality-assurance)
- [Planned Backend Integration](#planned-backend-integration)
- [Roadmap](#roadmap)
- [Project Documentation](#project-documentation)
- [Team](#team)
- [License and Attribution](#license-and-attribution)

---

## Project Overview

The **Asset Inventory Management System** is an Arabic RTL enterprise web application for managing organizational assets throughout their operational lifecycle. It centralizes asset records, supports role-based workflows, provides scoped reporting, and improves accountability through history and audit views.

The project is currently a **frontend-only prototype** built with realistic mock data. It is designed to demonstrate the complete user experience and establish a backend-ready application structure before integrating NestJS, Prisma, PostgreSQL, and organizational authentication.

### Primary objectives

- Centralize asset records in one controlled system.
- Reduce dependency on multiple inconsistent spreadsheets.
- Improve asset search, filtering, classification, and tracking.
- Apply role-based access control and organizational data scope.
- Support asset requests, approvals, transfers, and lifecycle actions.
- Provide QR label printing and local PNG export.
- Improve auditability, reporting, and operational visibility.
- Prepare a maintainable frontend architecture for backend integration.

---

## Current Delivery Status

| Area | Status | Notes |
|---|---|---|
| Frontend application | **Implemented** | Arabic RTL interface with responsive enterprise screens |
| Authentication | **Implemented as mock** | Demo accounts, session restore, and Remember Me |
| RBAC enforcement | **Implemented in frontend** | Sidebar, screen, action, and data-scope checks |
| Assets and requests | **Implemented with mock state** | Changes are available during the current browser session |
| Configurable columns | **Implemented** | Admin configuration and per-user preferences use `localStorage` |
| QR management | **Implemented locally** | Deterministic prototype graphic, printing, and PNG download |
| Reports | **Partially implemented** | Scoped report cards, CSV export, and print layouts |
| Audit log | **Implemented with mock data** | Read access depends on role and scope |
| AI Assistant | **UI prototype** | Suggested prompts and mock responses only |
| Power BI | **Placeholder** | Embedded connection is not configured |
| Backend APIs | **Not started** | Planned for Sprint 3 |
| PostgreSQL | **Not connected** | Proposed persistent data store |
| Entra ID / LDAP | **Not connected** | Planned authentication integration |
| File storage | **Not implemented** | Planned for attachments and generated files |

> **Important:** Frontend authorization improves the prototype user experience but is not a production security boundary. The future backend must enforce every permission and organizational scope independently.

---

## Problem and Proposed Solution

### Current challenges

Organizations may maintain asset data across multiple spreadsheets with different columns and inconsistent values. This can make it difficult to determine an asset's status, location, assigned user, ownership history, warranty condition, or approval state. Manual reporting also increases effort and reduces auditability.

### Proposed solution

The system provides one Arabic-first interface for:

- Exploring all assets through scoped lists and filters.
- Viewing category-specific and lifecycle information.
- Creating, editing, archiving, deleting, and transferring authorized assets.
- Submitting and approving operational requests.
- Generating and printing QR labels.
- Viewing reports, notifications, and audit records.
- Managing users, roles, columns, and custom fields where authorized.

---

## Implemented Features

### Dashboard

- Role-scoped KPI cards.
- Monthly activity chart.
- Asset distribution chart.
- Recent assets and quick actions.
- Responsive layout and loading states.

### Asset management

- Unified assets list.
- Arabic and English case-insensitive search.
- Role-aware filters for sector, department, employee, category, status, and location.
- Category tabs, sorting, pagination, and empty states.
- Configurable table columns.
- Add and edit asset forms with validation.
- Asset archive and delete confirmations.
- Asset transfer workflow.

### Asset details

- Overview and core asset information.
- QR side card.
- Lifecycle history timeline.
- Maintenance records.
- Attachments interface.
- Movement and transfer history.
- Asset-level audit entries.
- Print-ready asset report.

### Requests and approvals

- Request types: transfer, maintenance, purchase, and disposal.
- Priority and status handling.
- Search, tabs, pagination, and request details.
- New-request form.
- Approve and reject actions for authorized managers.
- Confirmation dialogs and user feedback toasts.

### QR management

- Asset-specific deterministic prototype QR graphic.
- Asset search and selection.
- Browser print support.
- Local SVG-to-PNG download.
- Printable card with asset information.

> The current QR graphic is a frontend prototype and does not yet encode a production asset URL or signed payload.

### Reports and analytics

- Scoped asset counts.
- Annual inventory, movement, and warranty report cards.
- Report search.
- CSV export based on the current user's data scope.
- Print-friendly layouts.
- Power BI Embedded placeholder.

### Administration and configuration

- User-management interface.
- Live role-permission matrix generated from the centralized RBAC configuration.
- Activate and deactivate user records in local mock state.
- System-wide optional column configuration.
- Per-user asset-table column visibility.
- Custom fields with text, number, date, dropdown, checkbox, and currency types.

### General experience

- Arabic RTL layout.
- Responsive desktop, laptop, and tablet behavior.
- Notifications and profile screens.
- Mock AI Assistant interface.
- Access-denied states.
- Loading, empty, confirmation, and toast patterns.
- Keyboard and ARIA improvements across major interactions.

---

## Roles, Permissions, and Data Scope

The system uses a centralized, typed permission configuration rather than checking role names directly throughout the UI.

| Role | Data scope | Asset capabilities | Request capabilities | Reports and administration |
|---|---|---|---|---|
| **Employee** | Assigned assets / own scope | View assets and generate QR | View and create requests | View and export own reports |
| **Department Manager** | Department | View, edit, transfer, and generate QR | View, create, approve, and reject | Department reports and audit access |
| **Sector Manager** | Sector | Create, view, edit, transfer, and generate QR | View, create, approve, and reject | Sector reports and audit access |
| **Asset Manager** | Organization | Full asset management, including archive/delete | Full request workflow | Organization reports, users, roles, settings, and audit |
| **Auditor** | Organization read-only | View assets | View requests | View/export reports and audit records |

### Authorization layers in the frontend

1. **Navigation filtering** — hides inaccessible sidebar modules.
2. **Screen guards** — prevents unauthorized screens from rendering.
3. **Action guards** — hides or blocks restricted buttons and actions.
4. **Object/data scope** — filters assets, requests, dashboard values, and reports according to the user's organizational scope.

The source of truth is located in:

```text
src/app/auth/config/rolePermissions.ts
src/app/auth/config/screenPermissions.ts
src/app/auth/permissions/permissions.ts
src/app/auth/scope/dataScope.ts
src/app/utils/assetScope.ts
```

---

## System Architecture

The current application is implemented as a modular frontend. Sprint 3 will replace mock data contexts and the mock authentication service with server APIs while preserving the main UI, hooks, and feature boundaries.

<p align="center">
  <img src="docs/images/system-architecture.png" alt="Implemented frontend and proposed Sprint 3 backend architecture" width="720" />
</p>

### Architectural principles

- Feature-based organization.
- Centralized authentication and permission configuration.
- Separation between screens, shared components, data contexts, and utilities.
- Reusable UI primitives and consistent interaction patterns.
- No direct future database access from React components.
- Mock services and contexts designed as replacement seams for APIs.
- Permission checks based on capabilities rather than scattered role comparisons.

---

## Technology Stack

### Implemented frontend

| Technology | Purpose |
|---|---|
| React 18 | Component-based user interface |
| TypeScript | Typed frontend contracts and permission model |
| Vite 6 | Development server and production build |
| Tailwind CSS 4 | Layout and utility styling |
| Material UI / Emotion | Selected interface components and styling support |
| Radix UI | Accessible dialogs, tabs, menus, and interaction primitives |
| Recharts | Dashboard charts and analytics visualization |
| Lucide React | Interface icons |
| Sonner | Toast notifications |
| React Hook Form | Form handling |
| date-fns | Date utilities |

### Proposed Sprint 3 backend

| Technology | Planned purpose |
|---|---|
| NestJS | REST API and modular business services |
| Prisma | Typed database access and migrations |
| PostgreSQL | Persistent relational data storage |
| Entra ID / LDAP | Organizational authentication and identity integration |
| File storage service | Asset attachments and generated documents |
| Power BI Embedded | Interactive analytical dashboards |

---

## Project Structure

```text
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── auth/
│   │   ├── config/              # Roles, permissions, screen rules
│   │   ├── contexts/            # Authentication state
│   │   ├── hooks/               # Auth access hooks
│   │   ├── permissions/         # Permission helpers
│   │   ├── scope/               # Future API data-scope contract
│   │   ├── services/            # Replaceable mock auth service
│   │   └── types/               # Typed auth contracts
│   ├── components/
│   │   ├── layout/              # Sidebar, top bar, global styles
│   │   └── shared/              # Reusable components and primitives
│   ├── data/                    # Demo users, mock records, constants
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── assets/
│   │   ├── requests/
│   │   ├── reports/
│   │   ├── users/
│   │   ├── audit/
│   │   ├── settings/
│   │   └── ai-assistant/
│   ├── types/                   # Shared domain models
│   └── utils/                   # Search, pagination, export, scope, dates
└── styles/                      # Theme, fonts, Tailwind, global CSS
```

For a more detailed tree, see [`PROJECT_TREE.md`](./PROJECT_TREE.md).

---

## Getting Started

### Prerequisites

- Git
- A current LTS version of Node.js
- npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd AssetsInventory
```

### 2. Install dependencies

For a reproducible installation using the committed lock file:

```bash
npm ci
```

Alternatively:

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

### 4. Create a production build

```bash
npm run build
```

The static frontend output is generated in the `dist/` directory.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Generate the production frontend build |

No environment variables or backend services are required for the current mock frontend.

---

## Demo Accounts

All demo users use the password:

```text
Passw0rd!
```

| User | Role | Email |
|---|---|---|
| Ahmed | Employee | `employee@org.sa` |
| Sara | Department Manager | `department.manager@org.sa` |
| Khalid | Sector Manager | `sector.manager@org.sa` |
| Fatimah | Asset Manager | `asset.manager@org.sa` |
| Omar | Auditor | `auditor@org.sa` |

> Demo credentials are intended only for local testing and demonstrations. They must never be used in a production deployment.

---

## Application Data and Persistence

The prototype intentionally separates different kinds of local state:

| Data type | Current behavior |
|---|---|
| Authentication session | Stored in `sessionStorage`, or `localStorage` when Remember Me is selected |
| Assets, requests, and managed users | In-memory React context; reset after a page refresh |
| Admin column configuration | Stored in `localStorage` |
| Custom field definitions | Stored in `localStorage` |
| Per-user column preferences | Stored in `localStorage` |
| Audit, notifications, charts, and history | Seeded mock data |

This behavior is for frontend demonstration only. Sprint 3 will replace operational state with persistent, server-controlled data.

---

## Security and Authorization Notes

### Implemented prototype controls

- Typed role and permission model.
- Centralized permission mapping.
- Navigation, screen, and action guards.
- Role-aware data filtering.
- Inactive-account rejection in the mock authentication service.
- Session permissions are re-derived from the centralized role configuration rather than trusted from stored session data.
- Confirmation dialogs for destructive or sensitive actions.
- Audit-oriented UI and event history.

### Required before production

- Server-side authentication and authorization.
- Object-level permission checks on every API endpoint.
- Server-enforced department, sector, and organization scope.
- Secure password or identity-provider handling.
- TLS and secure cookie/token configuration.
- Input validation and output sanitization.
- File type, size, and malware validation.
- Database constraints, transactions, backups, and recovery testing.
- Centralized audit events that cannot be modified by normal users.
- Data classification, retention, and privacy controls according to organizational policy.

---

## Quality Assurance

Sprint 2.5 completed a frontend QA and release-candidate pass covering:

- Search across major management screens.
- Asset sorting and reusable pagination.
- Empty states and stable table behavior.
- QR printing and local PNG export.
- Print-ready report layouts with RTL support.
- Role and scope access checks.
- Responsive tables, dialogs, and grids.
- ARIA labels, keyboard activation, tab roles, and dialog focus management.
- Dead-code removal and shared utility consolidation.
- Resolution of known React key and access-fallback issues.

The latest documented production build completed successfully. See [`docs/SPRINT_2.5_RELEASE_CANDIDATE_REPORT.md`](./docs/SPRINT_2.5_RELEASE_CANDIDATE_REPORT.md).

### Current testing limitation

The repository does not yet include a committed automated unit, integration, or end-to-end test suite. Automated tests should be introduced with the backend integration and maintained in the CI pipeline.

---

## Planned Backend Integration

The frontend is structured so that Sprint 3 can replace mock contexts and services without redesigning the user interface.

### Proposed API modules

- Authentication and session management.
- Users, roles, and permissions.
- Organization, sectors, and departments.
- Assets and category-specific details.
- Asset lifecycle, movement, transfers, and maintenance.
- Requests and approval history.
- Attachments and file metadata.
- Reports and exports.
- Notifications.
- Audit logs.
- System settings and custom fields.

### Proposed data model

The target relational design uses a shared `Assets` entity for common fields, with specialized detail tables for heterogeneous asset categories such as:

- Systems
- Applications
- Networks
- Circuits
- Licenses

Additional entities will support users, roles, permissions, departments, sectors, requests, approvals, transfers, maintenance, attachments, notifications, and audit events.

### Backend integration rules

- React components must call API/service modules rather than access database concerns.
- The backend is the final source of truth for permissions and scope.
- Mutating workflows should use database transactions.
- Lists should support pagination, filtering, sorting, and scoped queries.
- The API should return a consistent error format.
- File content should be stored separately from relational metadata.

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| Sprint 1 | Authentication foundation, demo identity, RBAC, scope contract, stabilization | **Complete** |
| Sprint 2 | UX refinement, forms, states, QR, print, reports, component consistency | **Complete** |
| Sprint 2.5 | Frontend QA and release candidate | **Complete** |
| Sprint 3 | NestJS, Prisma, PostgreSQL, real authentication, REST APIs, frontend integration | **Not started** |
| Future | Power BI Embedded, production AI assistant, enterprise file storage, advanced analytics | **Planned** |

---

## Project Documentation

| Document | Purpose |
|---|---|
| [`PROJECT_TREE.md`](./PROJECT_TREE.md) | Current feature-driven repository structure |
| [`docs/SPRINT_ROADMAP.md`](./docs/SPRINT_ROADMAP.md) | Original delivery roadmap |
| [`docs/SPRINT_1_COMPLETION_REPORT.md`](./docs/SPRINT_1_COMPLETION_REPORT.md) | Sprint 1 implementation summary |
| [`docs/SPRINT_1_ADDENDUM_REPORT.md`](./docs/SPRINT_1_ADDENDUM_REPORT.md) | Sprint 1 additional work |
| [`docs/SPRINT_1_STABILIZATION_COMPLETION_REPORT.md`](./docs/SPRINT_1_STABILIZATION_COMPLETION_REPORT.md) | Stabilization and cleanup details |
| [`docs/SPRINT_2.5_RELEASE_CANDIDATE_REPORT.md`](./docs/SPRINT_2.5_RELEASE_CANDIDATE_REPORT.md) | Latest frontend QA and readiness report |
| [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) | Third-party components and image attribution |

### Recommended screenshot structure

Add clean, data-safe application screenshots before publishing the repository:

```text
docs/screenshots/
├── login.png
├── dashboard.png
├── assets-list.png
├── asset-details.png
├── request-approval.png
├── qr-management.png
├── reports.png
└── audit-log.png
```

A concise README preview can then be added using:

```html
<p align="center">
  <img src="docs/screenshots/dashboard.png" width="48%" alt="Dashboard" />
  <img src="docs/screenshots/assets-list.png" width="48%" alt="Assets list" />
</p>
```

---

## Team

| Name | Project role |
|---|---|
| **Somaia Khawaji** | Tech Lead / Building Phase Lead |
| **Atheer Mubaraki** | Project Member |
| **Relam Alhazmi** | Project Member |
| **Ahlam Kaabi** | Project Member |

---

## License and Attribution

This repository was developed for educational, training, and demonstration purposes. No open-source license is currently granted unless a separate `LICENSE` file is added.

The project includes third-party components and images subject to their original licenses. See [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) for details.

---

<div align="center">

**Current release:** Sprint 2.5 Frontend Release Candidate  
**Next milestone:** Sprint 3 Backend and Database Integration

</div>
