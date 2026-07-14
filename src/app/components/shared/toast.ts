import { toast as sonnerToast } from "sonner";

// ─────────────────────────────────────────────
// Thin Arabic-first wrapper around the sonner toast
// library already installed in the project. Keeps every
// call site consistent (icons, tone) without pulling in
// a second toast library.
// ─────────────────────────────────────────────

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),
  info: (message: string, description?: string) =>
    sonnerToast.info(message, { description }),
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, { description }),
  /** Consistent message for actions that need a real backend (export, print, upload, PDF/QR generation). */
  deferred: (featureLabel: string) =>
    sonnerToast.info(`${featureLabel} — سيتم التفعيل عند ربط الخادم`, {
      description: "هذه الميزة جاهزة في الواجهة وتنتظر الربط مع الخادم (Sprint 3).",
    }),
};
