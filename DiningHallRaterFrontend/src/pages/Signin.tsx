import { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Signin.css'

function Signin({setUser}) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault(); // Prevents page from refreshing when the form is submitted
    setLoading(true);

    try {
      // Database call
      const signInResult = await axios.post("/api/auth/signin", form);
      setUser(signInResult.data);
      navigate("/");
    } catch (signInError) {
      const errorMessage = signInError.response?.data?.message || signInError.message || "Invalid sign in credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSignIn}>
        <input
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="p-3 mt-2"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
        />
        <input
          onChange={(e) => setForm({...form, password: e.target.value})}
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
