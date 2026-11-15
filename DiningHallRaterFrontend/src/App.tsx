import { useState, useEffect } from 'react';
import { useRoutes, Navigate } from 'react-router';
import axios from 'axios';
// import { AuthContextProvider } from './context/AuthContext.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Signin from './pages/Signin.tsx';
import Signup from './pages/Signup.tsx';
import './App.css';

// Sends cookies with every request
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the current user's data
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  let element = useRoutes([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Dashboard user={user} setUser={setUser}/>
        },
        {
          path: "signup/",
          element: <Signup setUser={setUser}/>
        },
        {
          path: "signin/",
          element: user ? <Navigate to="/" /> : <Signin setUser={setUser} />
        }

      ]
    }
  ])

  if (loading) {
    return (
      <div style={{color: "white", backgroundColor: "#7d7777", minHeight: "100dvh" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
    {element}
    </>
  );

}

export default App
