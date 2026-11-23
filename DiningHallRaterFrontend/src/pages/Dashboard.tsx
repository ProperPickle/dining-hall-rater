import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map.tsx';
import DiningHallList from '../components/DiningHallList.tsx';
import './Dashboard.css';
const { Button } = ReactBootstrap;

function Dashboard({user, setUser}) {
 const [diningHalls, setDiningHalls] = useState([]);

  const navigate = useNavigate();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMarkerClick = (id: number) => {
    setSelectedId(id);
    itemRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const signOutResult = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include"
      });
      
      if (!signOutResult.ok) {
        throw new Error();
      }

      setUser(null);
      navigate("/signin");
    } catch (signOutError) {
      alert("An unexpected error occurred while trying to sign out of your account.");
      console.error(signOutError);
    }
  };

  
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
  
    try {
      const accountDeletionResult = await fetch(`/api/auth/user`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!accountDeletionResult.ok) {
        const accountDeletionResultJSON = await accountDeletionResult.json();
        console.error(accountDeletionResultJSON.message || "Could not delete account.");
        throw new Error();
      }
      
      setUser(null);
      navigate("/signup");
    } catch (accountDeletionError) {
      alert("An unexpected error ocurred while trying to delete your account.");
      console.error(accountDeletionError);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="d-flex justify-content-between align-items-center p-3 flex-shrink-0">
        <div>
          <h1 className="mb-0">Dining Hall Dashboard</h1>
          <p className="text-muted mb-0">Rate and review your favorite dining halls!</p>
        </div>

        <div className="d-flex gap-2 flex-shrink-0">
          {!user ? (
            <>
              <Button variant="outline-primary" onClick={() => navigate('/signin')}>Sign In</Button>
              <Button variant="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="sm" className="fw-semibold" onClick={handleSignOut}>Sign Out</Button>
              <Button variant="danger" size="sm" className="fw-semibold" onClick={handleDeleteAccount}>Delete Account</Button>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        <DiningHallList
          itemRefs={itemRefs}
          diningHalls={diningHalls}
          setDiningHalls={setDiningHalls}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
        <div className="map-container">
          <Map locations={diningHalls} onMarkerClick={handleMarkerClick} />
        </div>
      </div>
    </div>
  );

}

export default Dashboard
