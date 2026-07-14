import { useState } from "react";
import { Toaster } from "sonner";
import type { Screen } from "./types";
import { NOTIFICATIONS } from "./data/mock";
import type { NotificationItem } from "./types";
import { AuthProvider, useAuth, canAccessScreen } from "./auth";
import { AccessDenied } from "./components/shared";
import { LoginScreen } from "./features/auth/LoginScreen";
import { DashboardScreen } from "./features/dashboard/DashboardScreen";
import {
  AssetsScreen,
  AssetDetailScreen,
  AssetReportScreen,
  AddAssetScreen,
  TransferScreen,
  QRScreen,
} from "./features/assets";
import { RequestsScreen } from "./features/requests/RequestsScreen";
import { ReportsScreen } from "./features/reports/ReportsScreen";
import { UserManagementScreen, RolesScreen } from "./features/users";
import { AuditLogScreen } from "./features/audit/AuditLogScreen";
import { AIAssistantScreen } from "./features/ai-assistant/AIAssistantScreen";
import { NotificationsScreen, SettingsScreen, ProfileScreen } from "./features/settings";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { AppGlobalStyles } from "./components/layout/AppGlobalStyles";
import { AssetFieldConfigProvider } from "./features/assets/contexts/AssetFieldConfigContext";
import { AssetsDataProvider } from "./features/assets/contexts/AssetsDataContext";
import { RequestsDataProvider } from "./features/requests/contexts/RequestsDataContext";
import { UsersDataProvider } from "./features/users/contexts/UsersDataContext";

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const { isAuthenticated, loading, logout, currentUser } = useAuth();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [quickSearch, setQuickSearch] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F3" }}>
        <div className="w-8 h-8 border-2 border-[#2A3172] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginScreen />;

  const onLogout = () => {
    logout();
    setScreen("dashboard");
  };

  const onOpenAsset = (id: string | null, target: Screen) => {
    setSelectedAssetId(id);
    setScreen(target);
  };

  const onSearch = (query: string) => {
    setQuickSearch(query);
    setScreen("assets");
  };

  const renderScreen = () => {
    if (!canAccessScreen(currentUser, screen, { isEditing: screen === "add-asset" && !!selectedAssetId })) {
      return <AccessDenied onBack={() => setScreen("dashboard")} />;
    }
    switch (screen) {
      case "dashboard":       return <DashboardScreen onNavigate={setScreen} onOpenAsset={onOpenAsset} />;
      case "assets":          return <AssetsScreen onOpenAsset={onOpenAsset} initialSearch={quickSearch} />;
      case "asset-detail":    return <AssetDetailScreen onNavigate={setScreen} onOpenAsset={onOpenAsset} assetId={selectedAssetId} />;
      case "asset-report":    return <AssetReportScreen assetId={selectedAssetId} onNavigate={setScreen} />;
      case "add-asset":       return <AddAssetScreen onNavigate={setScreen} assetId={selectedAssetId} />;
      case "transfer":        return <TransferScreen onNavigate={setScreen} assetId={selectedAssetId} />;
      case "qr":              return <QRScreen initialAssetId={selectedAssetId ?? undefined} />;
      case "requests":        return <RequestsScreen />;
      case "reports":         return <ReportsScreen />;
      case "user-management": return <UserManagementScreen />;
      case "roles":           return <RolesScreen />;
      case "audit-log":       return <AuditLogScreen />;
      case "ai-assistant":    return <AIAssistantScreen />;
      case "notifications":   return <NotificationsScreen notifications={notifications} onChange={setNotifications} />;
      case "profile":         return <ProfileScreen />;
      case "settings":        return <SettingsScreen />;
      default:                return null;
    }
  };

  return (
    <AssetsDataProvider>
    <RequestsDataProvider>
    <UsersDataProvider>
    <AssetFieldConfigProvider userId={currentUser!.id}>
    <div
      dir="rtl"
      className="flex h-screen overflow-hidden print:h-auto print:overflow-visible"
      style={{ fontFamily: "'Thmanyah Serif Text', system-ui, sans-serif", background: "#F7F6F3" }}
    >
      <Sidebar
        screen={screen}
        onNavigate={setScreen}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full print:overflow-visible">
        <TopBar
          screen={screen}
          unread={unreadCount}
          onNotifications={() => setScreen("notifications")}
          onProfile={() => setScreen("profile")}
          onSearch={onSearch}
        />
        <main className="flex-1 overflow-y-auto p-6 w-full min-w-0 print:overflow-visible print:p-0 print:h-auto" style={{ background: "#F7F6F3" }}>
          <div className="w-full min-w-0">{renderScreen()}</div>
        </main>
      </div>
      <AppGlobalStyles />
      <Toaster
        dir="rtl"
        position="top-left"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'Thmanyah Serif Text', system-ui, sans-serif",
            borderRadius: "12px",
          },
        }}
      />
    </div>
    </AssetFieldConfigProvider>
    </UsersDataProvider>
    </RequestsDataProvider>
    </AssetsDataProvider>
  );
}
