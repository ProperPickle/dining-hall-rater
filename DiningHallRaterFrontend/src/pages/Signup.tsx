import { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Signup.css'

function Signup({setUser}) {
 const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevents page from refreshing when the form is submitted
    setLoading(true);

    try {
      // Database call
      const signUpResult = await axios.post("/api/auth/signup", form);
      setUser(signUpResult.data);
      navigate("/");
    } catch (signUpError) {
      const errorMessage = signUpError.response?.data?.message || signUpError.message || "An error occurred while signing up.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignUp}>
        <input
          onChange={(e) => setForm({...form, name: e.target.value})}
          className="p-3 mt-2"
          type="username"
          name="username"
          id="username"
          placeholder="Username"
        />
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
          Sign up
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )

}

export default Signup
