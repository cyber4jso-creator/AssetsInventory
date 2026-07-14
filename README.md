# Asset Inventory Management System

A modern, scalable, and backend-ready Asset Inventory Management System designed to help organizations manage, track, and monitor their physical assets throughout their lifecycle.

The current version is a **Sprint 1** frontend prototype with realistic mock data, unified demo users, RBAC enforcement, and a structure prepared for Sprint 3 backend integration.

---

## Official Roadmap

| Sprint | Scope |
|--------|--------|
| **Sprint 1** ✅ | Identity, demo users, data consistency, RBAC, frontend stabilization |
| **Sprint 2** | Frontend polish — UX, forms, QR/print/report layouts, empty & loading states, confirmations, toasts |
| **Sprint 3** | Backend — NestJS, Prisma, PostgreSQL, authentication, REST APIs, frontend integration |

See [docs/SPRINT_ROADMAP.md](./docs/SPRINT_ROADMAP.md) for details.

---

## Overview

The system provides a centralized platform for managing organizational assets, allowing users to:

- View and search assets
- Track asset assignments
- Manage asset transfers
- Generate reports
- Manage QR Codes
- Monitor asset lifecycle
- Control access using role-based permissions
- Use an AI Assistant interface (currently mock implementation)

The application has been designed to be easily connected to PostgreSQL and REST APIs without requiring major frontend changes.

---

# Features

- Dashboard
- Asset Management
- Asset Details
- Asset Transfer
- QR Code Management
- Reports
- Notifications
- AI Assistant (UI Prototype)
- Authentication
- Role-Based Access Control (RBAC)
- Responsive User Interface
- Backend-ready Architecture

---

# Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Material UI
- Tailwind CSS
- Lucide React Icons

### Backend (Sprint 3 — planned)

- NestJS
- Prisma
- PostgreSQL
- REST APIs

---

# Project Structure

```
src/
│
├── app/
│   ├── auth/               # Authentication, RBAC, data scope (Sprint 3)
│   ├── components/         # Shared UI Components
│   ├── data/               # Mock data, demo users, dashboard stats
│   ├── features/
│   │     ├── dashboard/
│   │     ├── assets/
│   │     ├── transfers/
│   │     ├── qr/
│   │     ├── reports/
│   │     ├── notifications/
│   │     └── ai-assistant/
│   │
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
├── assets/
└── main.tsx
```

---

# Authentication

The current version uses mock authentication.

## Demo Password

```
Passw0rd!
```

## Demo Users

| Name | Role | Email |
|------|------|-------|
| Ahmed | Employee | employee@org.sa |
| Sara | Department Manager | department.manager@org.sa |
| Khalid | Sector Manager | sector.manager@org.sa |
| Fatimah | Asset Manager | asset.manager@org.sa |
| Omar | Auditor | auditor@org.sa |

All demo accounts use the same password.

---

# Role-Based Access

The system supports:

- Employee
- Department Manager
- Sector Manager
- Asset Manager
- Auditor

Permissions are managed through a centralized RBAC configuration. Data scope helpers (`auth/scope`) prepare list endpoints for Sprint 3 filtering (own / department / sector / organization).

---

# AI Assistant

The AI Assistant currently acts as a frontend prototype.

Current version:

- Chat interface
- Suggested prompts
- Loading animation
- Mock responses

Future integration will connect the assistant with:

- PostgreSQL
- Backend APIs
- Organizational asset data
- Real AI services

---

# Future Backend Integration (Sprint 3)

The frontend is prepared for:

- PostgreSQL Database
- REST APIs
- Authentication Server
- File Storage
- AI Integration
- Audit Logs
- Notification Services

---

# Getting Started

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Build Project

```bash
npm run build
```

---

# Design Principles

- Feature-Based Architecture
- Reusable Components
- Scalable Folder Structure
- Backend Ready
- Clean UI/UX
- Separation of Concerns
- Role-Based Authorization
- Future AI Integration

---

# Roadmap

See [docs/SPRINT_ROADMAP.md](./docs/SPRINT_ROADMAP.md).

**Sprint 2 (next):** Frontend polish — UX, forms, layouts, empty/loading states, confirmations, toasts.

**Sprint 3:** PostgreSQL, NestJS, Prisma, REST APIs, real authentication, scoped data filtering.

---

# Team Members

| Name | Role |
|------|------|
|Somaia Khawaji |leader of buailding phase |
|Atheer mibaraki | |
|Relam Alhazmi | |
|Ahlam Kaabi | |
| | |

---

# License

This project was developed for educational and demonstration purposes.
