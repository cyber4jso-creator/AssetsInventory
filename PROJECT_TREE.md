# شجرة المشروع — Feature-Driven Architecture
> تاريخ التحديث: 2026-07-14 · Sprint 1 complete

```
Optimize for Usability and Scalability/
├── docs/
│   ├── SPRINT_ROADMAP.md
│   ├── SPRINT_1_COMPLETION_REPORT.md
│   └── SPRINT_1_ADDENDUM_REPORT.md
├── index.html
├── package.json
├── vite.config.ts
├── PROJECT_TREE.md
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── auth/
    │   │   ├── scope/              # Data scope contract (Sprint 3 APIs)
    │   │   └── ...
    │   ├── data/
    │   │   ├── demoUsers.ts        # Demo users — single source of truth
    │   │   ├── mockReferenceDate.ts
    │   │   ├── dashboardStats.ts
    │   │   └── mock.ts
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx
    │   │   │   ├── TopBar.tsx
    │   │   │   └── AppGlobalStyles.tsx
    │   │   └── shared/
    │   │       ├── primitives.tsx           # Chip, Btn, Inp, Sel, Card
    │   │       └── index.ts
    │   └── features/
    │       ├── auth/
    │       │   └── LoginScreen.tsx
    │       ├── dashboard/
    │       │   └── DashboardScreen.tsx
    │       ├── assets/
    │       │   ├── AssetsScreen.tsx
    │       │   ├── AssetDetailScreen.tsx
    │       │   ├── AddAssetScreen.tsx
    │       │   ├── TransferScreen.tsx
    │       │   ├── QRScreen.tsx
    │       │   └── index.ts
    │       ├── requests/
    │       │   └── RequestsScreen.tsx
    │       ├── reports/
    │       │   └── ReportsScreen.tsx
    │       ├── users/
    │       │   ├── UserManagementScreen.tsx
    │       │   ├── RolesScreen.tsx
    │       │   └── index.ts
    │       ├── audit/
    │       │   └── AuditLogScreen.tsx
    │       ├── ai-assistant/
    │       │   └── AIAssistantScreen.tsx
    │       └── settings/
    │           ├── NotificationsScreen.tsx
    │           ├── SettingsScreen.tsx
    │           └── index.ts
    ├── imports/pasted_text/ams-design-system.md
    └── styles/
        ├── index.css
        ├── fonts.css
        ├── tailwind.css
        └── theme.css
```

## ما تم حذفه (Dead Code)
- `src/app/components/ui/` — 46 مكوّن shadcn غير مستخدم
- `src/app/components/figma/` — ImageWithFallback غير مستخدم
- `src/styles/globals.css` — ملف فارغ

## التبعيات الفعلية في التشغيل
`react` · `lucide-react` · `recharts` · `tailwindcss` · `tw-animate-css`
