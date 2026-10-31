import { useState } from 'react'
import { useNavigate } from 'react-router';
import { UserAuth } from '../context/AuthContext.tsx'
import './Signup.css'

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signUpUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async(event) => {
    event.preventDefault(); // Prevents page from refreshing when the form is submitted
    setLoading(true);

    try {
      // Database call
      const signUpResult = await signUpUser(username, email, password);
      if (signUpResult.success) {
        navigate('/');
      } else if ('error' in signUpResult) {
        const errorMessage = signUpResult.error?.message || signUpResult.error || "Sign up failed.";
        setError(errorMessage);
      } else {
        setError("Sign up failed");
      }
    } catch (unexpectedError) {
      setError("An unexpected error occurred while trying to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignUp}>
        <input
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 mt-2"
          type="username"
          name="username"
          id="username"
          placeholder="Username"
        />
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
          Sign up
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )

}

export default Signup
