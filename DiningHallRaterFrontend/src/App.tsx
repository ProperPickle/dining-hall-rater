import { useState, useEffect } from 'react';
import { useRoutes, Navigate } from 'react-router';
// import { AuthContextProvider } from './context/AuthContext.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Signin from './pages/Signin.tsx';
import Signup from './pages/Signup.tsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the current user's data
        const getUserDataResult = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include"
        });

        const getUserDataResultJSON = await getUserDataResult.json();
        if (!getUserDataResult.ok) {
          console.error(getUserDataResultJSON.message || "Could not get user's data");
          return;
        }
        setUser(getUserDataResultJSON.user);
      } catch (err) {
        console.error("An unexpected error occurred while getting the user's data");
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
