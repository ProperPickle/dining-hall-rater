import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";

export default function DiningHallCard({ location }) {
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