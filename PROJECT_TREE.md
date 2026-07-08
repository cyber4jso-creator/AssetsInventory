# شجرة المشروع — Feature-Driven Architecture
> تاريخ التحديث: 2026-07-06

```
Optimize for Usability and Scalability/
├── index.html
├── package.json
├── vite.config.ts
├── PROJECT_TREE.md
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx                          # Shell: routing + layout (~77 سطر)
    │   ├── types/
    │   │   └── index.ts                     # Screen, AssetStatus, NavigateFn
    │   ├── data/
    │   │   └── mock.ts                      # بيانات تجريبية مشتركة
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
