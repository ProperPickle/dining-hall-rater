import { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { shortenNumber, calculateAverageRating } from "../Helpers";

export default function DiningHallCard({ location }) {
  // Rating for the star system
  const [rating, setRating] = useState(0);

  // Rating metrics
  const [averageRating, setAverageRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  // On initial mount, set average rating, and round it to two decimal places
  useEffect(() => {
    if (location.num_ratings >= 1) {
      setTotalRatings(location.num_ratings);
      setAverageRating(calculateAverageRating(location.num_ratings, location.sum_ratings));
    }
  }, []);

  return (
    <>
      <Card className="dining-hall-card">
        <Card.Img variant="top" src={location.image} className="rounded-top" style = {{height:'180px', objectFit:'cover'}}/>
        <Card.Body>
          <Card.Title>{location.name}</Card.Title>
          <Card.Text>{location.description}</Card.Text>
          {averageRating != null && <Card.Text>Average Rating: {averageRating}</Card.Text>}
          <Card.Text>{totalRatings ? `Number of ratings: ${shortenNumber(totalRatings)}` : "No ratings yet!"}</Card.Text>
          <Rating onClick={handleRating} initialValue={rating}></Rating>
          <Button variant="primary" size="lg" className="w-25 fw-semibold">Add Review</Button>
        </Card.Body>
      </Card>
    </>
  );
}