import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminPanel } from "./components/AdminPanel";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { ProfileSection } from "./components/ProfileSection";
import { ReferEarnSection } from "./components/ReferEarnSection";
import { TasksSection } from "./components/TasksSection";
import { WalletSection } from "./components/WalletSection";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import {
  AppContext,
  type AppData,
  type WithdrawalRequest,
  loadAdminWithdrawals,
  loadAppData,
  saveAdminWithdrawals,
  saveAppData,
} from "./store/appStore";

type Section =
  | "home"
  | "tasks"
  | "wallet"
  | "refer"
  | "leaderboard"
  | "profile"
  | "admin";

export default function App() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const { data: isAdmin = false } = useIsAdmin();
  const [activeSection, setActiveSection] = useState<Section>("home");
  const principal = identity?.getPrincipal().toString() ?? "__guest__";

  const [appData, setAppData] = useState<AppData>(() => loadAppData(principal));
  const [adminWithdrawals, setAdminWithdrawals] = useState<WithdrawalRequest[]>(
    () => loadAdminWithdrawals(),
  );

  // Reload data when principal changes (login/logout)
  useEffect(() => {
    setAppData(loadAppData(principal));
  }, [principal]);

  const updateAppData = useCallback(
    (updater: (prev: AppData) => AppData) => {
      setAppData((prev) => {
        const next = updater(prev);
        saveAppData(principal, next);
        return next;
      });
    },
    [principal],
  );

  const updateAdminWithdrawals = useCallback(
    (requests: WithdrawalRequest[]) => {
      setAdminWithdrawals(requests);
      saveAdminWithdrawals(requests);
    },
    [],
  );

  // Handle Stripe callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const depositStatus = params.get("deposit");
    const sessionId = params.get("session_id");

    if (depositStatus === "success" && sessionId && actor) {
      const verifyDeposit = async () => {
        try {
          const status = await actor.getStripeSessionStatus(sessionId);
          if (status.__kind__ === "completed") {
            // Parse amount from session response
            toast.success("Deposit successful! Money added to wallet.");
          } else {
            toast.error("Payment verification failed.");
          }
        } catch {
          toast.error("Could not verify payment.");
        }
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      };
      verifyDeposit();
    } else if (depositStatus === "cancel") {
      toast.error("Payment cancelled.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [actor]);

  const handleNavigate = (section: Section) => {
    if (
      (section === "wallet" || section === "refer" || section === "profile") &&
      !identity
    ) {
      login();
      return;
    }
    if (section === "admin" && !isAdmin) {
      toast.error("Admin access required");
      return;
    }
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppContext.Provider
      value={{
        appData,
        updateAppData,
        adminWithdrawals,
        updateAdminWithdrawals,
      }}
    >
      <div className="min-h-screen bg-background">
        <Header
          activeSection={activeSection}
          onNavigate={handleNavigate}
          isAdmin={isAdmin}
        />

        <main>
          {activeSection === "home" && (
            <>
              <HeroSection
                onStartEarning={() => handleNavigate("tasks")}
                onViewTasks={() => handleNavigate("tasks")}
                isLoggedIn={!!identity}
                onLogin={login}
              />
              {/* Quick preview sections on home */}
              <TasksSection onLoginRequired={login} />
              <div className="gradient-card py-1" />
              <LeaderboardSection />
            </>
          )}

          {activeSection === "tasks" && (
            <TasksSection onLoginRequired={login} />
          )}

          {activeSection === "wallet" && identity && <WalletSection />}

          {activeSection === "refer" && identity && <ReferEarnSection />}

          {activeSection === "leaderboard" && <LeaderboardSection />}

          {activeSection === "profile" && identity && <ProfileSection />}

          {activeSection === "admin" && isAdmin && <AdminPanel />}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-12 py-6 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            EarnMax is compliant with RBI guidelines on digital payments.
          </p>
        </footer>
      </div>
      <Toaster richColors position="top-right" />
    </AppContext.Provider>
  );
}
