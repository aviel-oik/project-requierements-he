// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import type { JSX } from "react/jsx-dev-runtime";

// function ProtectedRoute({ children, requiredRole }: { children: JSX.Element, requiredRole: 'admin' | 'agent' }) {
//     const navigate = useNavigate();
//     const { user } = useAuthStore();
//     if (!user) {
//         navigate("/login");
//         return <></>;
//     }
//     if (user.role !== requiredRole) {
//         navigate("/unauthorized");
//         return <></>;
//     }
//     return children;
// }

// export default ProtectedRoute;
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import type { JSX } from "react/jsx-dev-runtime";

function ProtectedRoute({ children, requiredRole }: { children: JSX.Element; requiredRole: "admin" | "agent";}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== requiredRole) {
      navigate("/");
    }
  }, [user, requiredRole, navigate]);

  if (!user || user.role !== requiredRole) {
    return null;
  }

  return children;
}

export default ProtectedRoute;