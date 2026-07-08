# Asset Inventory Management System

A modern, scalable, and backend-ready Asset Inventory Management System designed to help organizations manage, track, and monitor their physical assets throughout their lifecycle.

The project focuses on usability, maintainability, and future scalability while following a feature-based architecture and role-based access control (RBAC). The current version includes a complete frontend prototype with realistic mock data and is prepared for backend and database integration.

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

### Planned Backend

- Node.js / Express (Planned)
- PostgreSQL (Planned)

---

# Project Structure

```
src/
│
├── app/
│   ├── auth/               # Authentication & RBAC
│   ├── components/         # Shared UI Components
│   ├── data/               # Mock Data
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

| Role | Email |
|------|-------|
| Super Admin | n.qahtani@org.sa |
| Asset Manager | a.shammari@org.sa |
| Department Manager | r.anzi@org.sa |
| Employee | b.harbi@org.sa |
| Auditor | m.dosari@org.sa |

All demo accounts use the same password.

---

# Role-Based Access

The system currently supports:

- Super Admin
- Asset Manager
- Department Manager
- Employee
- Auditor

Permissions are managed through a centralized RBAC configuration.

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

# Future Backend Integration

The frontend has been prepared for:

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

- PostgreSQL Integration
- REST API Integration
- File Upload Support
- Real Authentication
- Asset History
- Maintenance Module
- Audit Logs
- AI Assistant Integration
- Dashboard Analytics
- Notification System

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
