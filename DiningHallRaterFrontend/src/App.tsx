import { useRoutes } from 'react-router'
import './App.css'
import Dashboard from './pages/Dashboard.tsx'
import Signin from './pages/Signin.tsx'
import Signup from './pages/Signup.tsx'

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
    <>
      {element}
    </>
  )

}

export default App
