import { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import './Signin.css'

function Signin({setUser}) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault(); // Prevents page from refreshing when the form is submitted
    setLoading(true);

    try {
      // Database call
      const signInResult = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const signInResultJSON = await signInResult.json();

      if (!signInResult.ok) {
        setError(signInResultJSON.message || "Invalid sign in credentials.");
        return;
      }

      setUser(signInResultJSON.user);
      navigate("/");
    } catch (signInError) {
      setError("An unexpected error occurred while signing in.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="signin-page">
      <div className="signin-card">
        <h1 className="signin-title">Welcome back</h1>
        <p className="signin-subtitle">Sign in to your account to continue.</p>

        <form className="signin-form" onSubmit={handleSignIn}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="signin-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
        <p className="signin-footer">
          <Link to="/">Back as Guest</Link>
        </p>
      </div>
    </main>
  )

}

export default Signin
