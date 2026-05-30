"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { updateUser, changePassword, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");

  // Profile Form State
  const [name, setName] = useState(session?.user?.name || "");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Load session data when ready
  if (!name && session?.user?.name) {
    setName(session.user.name);
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMsg("");

    const { error } = await updateUser({
      name: name,
    });

    if (error) {
      setProfileMsg(error.message || t("error_generic"));
    } else {
      setProfileMsg(t("success_profile"));
    }
    setIsProfileLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMsg("");

    if (newPassword !== confirmPassword) {
      setPasswordMsg(t("error_password_mismatch"));
      setIsPasswordLoading(false);
      return;
    }

    const { error } = await changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setPasswordMsg(error.message || t("error_generic"));
    } else {
      setPasswordMsg(t("success_password"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsPasswordLoading(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  if (isPending) return <div className="p-8">Loading...</div>;

  return (
    <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-text-muted mt-1">{t("subtitle")}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-foreground"}`}
          >
            {t("tab_profile")}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "security" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-foreground"}`}
          >
            {t("tab_security")}
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "preferences" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-foreground"}`}
          >
            {t("tab_preferences")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">{t("profile_title")}</h3>
                <p className="text-sm text-text-muted">{t("profile_subtitle")}</p>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                {profileMsg && <div className="p-3 text-sm rounded bg-surface border border-border">{profileMsg}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("field_name")}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("field_email")}</label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-text-muted">Email cannot be changed directly.</p>
                </div>
                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? t("btn_saving") : t("btn_save")}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">{t("security_title")}</h3>
                <p className="text-sm text-text-muted">{t("security_subtitle")}</p>
              </div>
              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                {passwordMsg && <div className="p-3 text-sm rounded bg-surface border border-border">{passwordMsg}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("field_current_password")}</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("field_new_password")}</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("field_confirm_password")}</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? t("btn_saving") : t("btn_save")}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">{t("preferences_title")}</h3>
                <p className="text-sm text-text-muted">{t("preferences_subtitle")}</p>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("field_language")}</label>
                  <select
                    value={locale}
                    onChange={handleLanguageChange}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="en" className="bg-bg text-foreground">{t("lang_en")}</option>
                    <option value="id" className="bg-bg text-foreground">{t("lang_id")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
