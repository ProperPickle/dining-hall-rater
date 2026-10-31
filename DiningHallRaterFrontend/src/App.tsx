import { useRoutes } from 'react-router'
import { AuthContextProvider } from './context/AuthContext.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Signin from './pages/Signin.tsx'
import Signup from './pages/Signup.tsx'
import './App.css'

function App() {
  let element = useRoutes([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: "signup/",
          element: <Signup />
        },
        {
          path: "signin/",
          element: <Signin />
        }

      ]
    }
  ])
  return (
    <AuthContextProvider>
      {element}
    </AuthContextProvider>
  )

}

export default App
