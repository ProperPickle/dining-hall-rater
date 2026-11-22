import { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import './Signup.css'

function Signup({setUser}) {
 const [form, setForm] = useState({
    name: "",
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

  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevents page from refreshing when the form is submitted
    setLoading(true);

    try {
      // Database call
      const signUpResult = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const signUpResultJSON = await signUpResult.json();
      if (!signUpResult.ok) {
        setError(signUpResultJSON.message || "Invalid sign up credentials");
        return;
      }

      setUser(signUpResultJSON.user);
      navigate("/");
    } catch (signUpError) {
      setError("An error occurred while signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='signup-page'>
      <div className='signup-card'>
        <h1 className='signup-title'>Create an account</h1>
        <p className='signup-subtitle'>Create an account to leave your own reviews</p>

        <form className='signup-form' onSubmit={handleSignUp}>
          <div className='field'>
            <label htmlFor='username'>Username</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              id="username"
              placeholder="Username"
              autoComplete="username"
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='email'>Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='password'>Password</label>
            <div className='password-wrap'>
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                autoComplete="new-password"
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className='signup-footer'>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
        <p className="signup-footer">
          <Link to="/">Back as Guest</Link>
        </p>
      </div>
    </main>
  );
}

export default Signup
