import * as React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { UserAuth } from '../context/AuthContext.tsx';
import Map from '../components/Map.tsx';
import './Dashboard.css';
const { Badge, Button, Card } = ReactBootstrap;

function DiningHallCard({ location }) {
  const [rating, setRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  return (
    <>
      <Card className="dining-hall-card">
        <Card.Img variant="top" src={location.image} className="rounded-top" style = {{height:'180px', objectFit:'cover'}}/>
        <Card.Body>
          <Card.Title>{location.name}</Card.Title>
          <Card.Text>{location.description}</Card.Text>
          <Rating onClick={handleRating} initialValue={rating}></Rating>
          <Button variant="primary" size="lg" className="w-25 fw-semibold">Add Review</Button>
        </Card.Body>
      </Card>
    </>
  );
}

function Dashboard() {

  const { session, signOutUser, deleteAccount } = UserAuth();
  const navigate = useNavigate();

  const [diningHalls, setDiningHalls] = useState([
    {
      id: 1,
      name: "De Neve",
      description: "Classic American comfort food and late night.",
      image: "/images/De Neve.png",
      position: [34.0722, -118.4495]
    },
    {
      id: 2,
      name: "Bruin Plate",
      description: "Health-conscious, locally sourced cuisine.",
      image: "/images/Bruin Plate.png",
      position: [34.0728, -118.4508]
    },
    {
      id: 3,
      name: "Epicuria at Covel",
      description: "Global flavors and Mediterranean dishes.",
      image: "/images/Epic at Covel.png",
      position: [34.0728, -118.4508]
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
      position: [34.0722, -118.4495]
    },
    {
      id: 6,
      name: "Bruin Café",
      description: "Coffee, specialty drinks, sandwiches, and wraps.",
      image: "/images/Bruin Cafe.png",
      position: [34.07191, -118.45054]
    },
    {
      id: 7,
      name: "Café 1919",
      description: "Paninis, gelatos, and specialty Italian coffee.",
      image: "/images/Cafe 1919.png",
      position: [34.0724, -118.4517]
    },
    {
      id: 8,
      name: "Epicuria at Ackerman",
      description: "Mediterranean-inspired dishes located in Ackerman Union.",
      image: "/images/Epic at Ackerman.png",
      position: [34.0704, -118.4448]
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
      position: [34.07265, -118.45225]
    },
    {
      id: 11,
      name: "The Drey",
      description: "Grab-and-go options, cold cuts, and hot sandwiches at Olympic Hall.",
      image: "/images/The Drey.png",
      position: [34.0723, -118.4527]
    },
    {
      id: 12,
      name: "The Study at Hedrick",
      description: "Artisan bakery, custom bagel sandwiches, crepes, and study space.",
      image: "/images/The Study.png",
      position: [34.07356, -118.45270]
    }
  ]);

  const handleSignOut = async (e) => {
    e.preventDefault();

    const signOutResult = await signOutUser();
    if (signOutResult.success) {
      navigate("/signin");
    } else {
      alert("An unexpected error ocurred while trying to signing out of your account.");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    const deletionResult = await deleteAccount();
    if (deletionResult.success) {
      navigate("/signin");
    } else {
      alert("An unexpected error ocurred while trying to deleting your account.");
    }
  };


  return (
    <div>
      <h1>Dining Hall Dashboard</h1>
      <p className="text-muted">Rate and review your favorite dining halls!</p>

      <div className='d-flex gap-2'>
        {!session && <Button variant="outline-primary" onClick={() => navigate('/signin')}>Sign In</Button>}
        {!session && <Button variant="primary" onClick={() => navigate('/signup')}>Sign Up</Button>}
      </div>

      {session && <Button variant="primary" size="sm" className="w-10 fw-semibold" onClick={handleSignOut}>Sign Out</Button>}
      {session && <Button variant="danger" size="sm" className="w-10 fw-semibold" onClick={handleDeleteAccount}>Delete Account</Button>}
      <div className="dashboard-content">
        <div className="dining-hall-cards">
          {diningHalls.map((location) => (
            <DiningHallCard key={location.id} location={location} />
          ))}
        </div>
        <div className="map-container">
          <Map locations={diningHalls} />
        </div>
      </div>
    </div>
  );

}

export default Dashboard
