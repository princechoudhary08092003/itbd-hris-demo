import { createContext, useContext, useMemo, useState } from "react";
import { useDataStore } from "./DataStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { db } = useDataStore();
  const [loginId, setLoginId] = useState(() => {
    try {
      const stored = sessionStorage.getItem("itbd-hris-login-id");
      if (stored && db.demoLogins.some((l) => l.login_id === stored)) return stored;
    } catch {
      // sessionStorage unavailable — fall back to default
    }
    return db.demoLogins[0].login_id;
  });

  function switchLoginPersisted(id) {
    setLoginId(id);
    try {
      sessionStorage.setItem("itbd-hris-login-id", id);
    } catch {
      // ignore
    }
  }

  const value = useMemo(() => {
    const login = db.demoLogins.find((l) => l.login_id === loginId) ?? db.demoLogins[0];
    const role = db.securityRoles.find((r) => r.role_id === login.role_id);
    return {
      login,
      role,
      employmentId: login.employment_id,
      isManager: login.role_id === "ROLE-MANAGER" || login.role_id === "ROLE-HR-ADMIN" || login.role_id === "ROLE-SUPER-ADMIN",
      isHRAdmin: login.role_id === "ROLE-HR-ADMIN" || login.role_id === "ROLE-SUPER-ADMIN",
      isSuperAdmin: login.role_id === "ROLE-SUPER-ADMIN",
      switchLogin: switchLoginPersisted,
      availableLogins: db.demoLogins,
    };
  }, [db.demoLogins, db.securityRoles, loginId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
