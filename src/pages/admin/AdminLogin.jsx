import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { auth } from "../../lib/store";
import { useSession } from "../../hooks/useStore";
import RetroMark from "../../components/common/RetroMark";

export default function AdminLogin() {
  const session = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session) return <Navigate to="/admin" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    const res = auth.signIn(email.trim(), password);
    if (res.ok) navigate("/admin");
    else setError(res.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <RetroMark className="h-11 w-11" />
          <div className="text-center">
            <p className="font-display text-2xl text-bone">Admin Panel</p>
            <p className="text-xs text-mist">Retro Clothing</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-[24px] p-7">
          <div className="mb-5">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-mist">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-line bg-charcoal/60 px-4 py-3 text-sm text-bone focus:border-line-strong focus:outline-none"
              placeholder="admin@retroclothing.in"
            />
          </div>
          <div className="mb-2">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-mist">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-line bg-charcoal/60 px-4 py-3 text-sm text-bone focus:border-line-strong focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="mt-3 text-[12px] text-bone/80">{error}</p>}

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-bone py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
          >
            <Lock size={13} strokeWidth={2} /> Sign In
          </button>

          <p className="mt-5 text-center text-[11px] text-mist">
            Demo credentials — {auth.demoCredentials.email} / {auth.demoCredentials.password}
          </p>
        </form>
      </div>
    </div>
  );
}
