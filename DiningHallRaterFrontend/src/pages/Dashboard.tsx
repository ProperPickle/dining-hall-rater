import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState, useEffect } from 'react'
import './Dashboard.css'

const { Badge, Button, Card } = ReactBootstrap

function DiningHallCard({ location }) {
  return (
    <>
      <Card className="dining-hall-card">
        <Card.Img variant="top" src={location.image} alt={location.name} />
        <Card.Body>
          <Card.Title>{location.name}</Card.Title>
          <Card.Text>{location.description}</Card.Text>
          <Button variant="primary">Add Rating</Button>
        </Card.Body>
      </Card>
    </>
  )
}

function Dashboard() {
  const [diningHalls, setDiningHalls] = useState([
    { 
      id: 1, 
      name: "De Neve", 
      description: "Classic American comfort food and late night.",
      image: "/images/De Neve.png" 
    },
    { 
      id: 2, 
      name: "Bruin Plate", 
      description: "Health-conscious, locally sourced cuisine.",
      image: "/images/Bruin Plate.png"
    },
    { 
      id: 3, 
      name: "Epicuria at Covel", 
      description: "Global flavors and Mediterranean dishes.",
      image: "/images/Epic at Covel.png"
    },
    { 
      id: 4, 
      name: "FEAST at Rieber", 
      description: "Asian-inspired street food and grill.",
      image: "/images/Feast.png"
    },
    {
      id: 5,
      name: "Bruin Bowl",
      description: "Customizable grain and protein bowls.",
      image: "/images/Bruin Bowl.png"
    },
    {
      id: 6,
      name: "Bruin Café",
      description: "Coffee, specialty drinks, sandwiches, and wraps.",
      image: "/images/Bruin Cafe.png"
    },
    {
      id: 7,
      name: "Café 1919",
      description: "Paninis, gelatos, and specialty Italian coffee.",
      image: "/images/Cafe 1919.png"
    },
    {
      id: 8,
      name: "Epicuria at Ackerman",
      description: "Mediterranean-inspired dishes located in Ackerman Union.",
      image: "/images/Epic at Ackerman.png"
    },
    {
      id: 9,
      name: "Food Trucks",
      description: "Rotating campus food trucks accepting meal swipes.",
      image: "/images/Food Trucks.png"
    },
    {
      id: 10,
      name: "Rendezvous",
      description: "Mexican and East Asian quick-service takeout.",
      image: "/images/Rendevous.png"
    },
    {
      id: 11,
      name: "The Drey",
      description: "Grab-and-go options, cold cuts, and hot sandwiches at Olympic Hall.",
      image: "/images/The Drey.png"
    },
    {
      id: 12,
      name: "The Study at Hedrick",
      description: "Artisan bakery, custom bagel sandwiches, crepes, and study space.",
      image: "/images/The Study.png"
    }
  ]);


  return (
    <div>
      <h1>Dining Hall Dashboard</h1>
      <p className="text-muted">Rate and review your favorite dining halls!</p>

      <div className="dining-hall-cards">
        {diningHalls.map((location) => (
          <DiningHallCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  )

}

export default Dashboard
