import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map.tsx';
import DiningHallCard from '../components/DiningHallCard.tsx'
import './Dashboard.css';
const { Button } = ReactBootstrap;

function Dashboard({user, setUser}) {
 const [diningHalls, setDiningHalls] = useState([
    {
      id: 1,
      name: "De Neve",
      description: "Classic American comfort food and late night.",
      image: "/images/De Neve.png",
      position: [34.07040, -118.45040]
    },
    {
      id: 2,
      name: "Bruin Plate",
      description: "Health-conscious, locally sourced cuisine.",
      image: "/images/Bruin Plate.png",
      position: [34.07180, -118.44988]
    },
    {
      id: 3,
      name: "Epicuria at Covel",
      description: "Global flavors and Mediterranean dishes.",
      image: "/images/Epic at Covel.png",
      position: [34.07301, -118.44996]
    },
    {
      id: 4,
      name: "FEAST at Rieber",
      description: "Asian-inspired street food and grill.",
      image: "/images/Feast.png",
      position: [34.07195, -118.45152]
    },
    {
      id: 5,
      name: "Bruin Bowl",
      description: "Customizable grain and protein bowls.",
      image: "/images/Bruin Bowl.png",
      position: [34.07048, -118.45027]
    },
    {
      id: 6,
      name: "Bruin Café",
      description: "Coffee, specialty drinks, sandwiches, and wraps.",
      image: "/images/Bruin Cafe.png",
      position: [34.07255, -118.45018]
    },
    {
      id: 7,
      name: "Café 1919",
      description: "Paninis, gelatos, and specialty Italian coffee.",
      image: "/images/Cafe 1919.png",
      position: [34.07292, -118.45120]
    },
    {
      id: 8,
      name: "Epicuria at Ackerman",
      description: "Mediterranean-inspired dishes located in Ackerman Union.",
      image: "/images/Epic at Ackerman.png",
      position: [34.07040, -118.44428]
    },
    {
      id: 9,
      name: "Food Trucks",
      description: "Rotating campus food trucks accepting meal swipes.",
      image: "/images/Food Trucks.png",
      position: null
    },
    {
      id: 10,
      name: "Rendezvous",
      description: "Mexican and East Asian quick-service takeout.",
      image: "/images/Rendevous.png",
      position: [34.07260, -118.45178]
    },
    {
      id: 11,
      name: "The Drey",
      description: "Grab-and-go options, cold cuts, and hot sandwiches at Olympic Hall.",
      image: "/images/The Drey.png",
      position: [34.07200, -118.45270]
    },
    {
      id: 12,
      name: "The Study at Hedrick",
      description: "Artisan bakery, custom bagel sandwiches, crepes, and study space.",
      image: "/images/The Study.png",
      position: [34.07329, -118.45241]
    }
  ]);

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
        return;
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
        <div className="dining-hall-cards">
          {diningHalls.map((location) => (
            <div
              key={location.id}
              ref={(el) => { itemRefs.current[location.id] = el; }}
              className={`hall-wrapper ${selectedId === location.id ? 'selected' : ''}`}
            >
              <DiningHallCard location={location} />
            </div>
          ))}
        </div>
        <div className="map-container">
          <Map locations={diningHalls} onMarkerClick={handleMarkerClick} />
        </div>
      </div>
    </div>
  );

}

export default Dashboard
