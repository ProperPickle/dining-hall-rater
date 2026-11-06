import { useState } from 'react'
import { useNavigate } from 'react-router';
import { UserAuth } from '../context/AuthContext.tsx'
import './Signin.css'

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async(event) => {
    event.preventDefault(); // Prevents page from refreshing when the form is submitted
    setLoading(true);

    try {
      // Database call
      const signInResult = await signInUser(email, password);
      if (signInResult.success) {
        navigate('/');
      } else if ('error' in signInResult) {
        const errorMessage = signInResult.error?.message || signInResult.error || "Sign in failed.";
        setError(errorMessage);
      } else {
        setError("Sign in failed.");
      }
    } catch (unexpectedError) {
      setError("An unexpected error occurred while trying to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSignIn}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mt-2"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mt-2"
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <button type="submit" disabled={loading}>
          Sign in
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )

}

export default Signin
