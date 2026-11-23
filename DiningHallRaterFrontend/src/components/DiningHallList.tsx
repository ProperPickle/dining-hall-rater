import { useState, useEffect } from 'react';
import DiningHallCard from './DiningHallCard.tsx'
import './DiningHallList.css'

export default function DiningHallList({itemRefs, diningHalls, setDiningHalls, selectedId, setSelectedId}) {
    const [loading, setLoading] = useState(true);

    // Get all of the dining halls from the database's locations table
    useEffect(() => {
        const getAllDiningHalls = async () => {
            try {
                const getLocationsResults = await fetch("/api/auth/locations", {
                    method: "GET"
                });

                if (!getLocationsResults.ok) {
                    throw new Error();
                }

                const getLocationsResultsJSON = await getLocationsResults.json();
                const {locations} = getLocationsResultsJSON;
                setDiningHalls(locations);
                setLoading(false);
            } catch (getLocationsError) {
                console.error("Error getting locations:", getLocationsError);
            }
        }

        getAllDiningHalls();
    },[]);


    return (
        <div className="dining-hall-cards">
            {loading &&
            <div style={{color: "white", backgroundColor: "#7d7777", minHeight: "100dvh" }}>
                <h1>Loading...</h1>
            </div>
            }

            {!loading &&
            diningHalls.map((location) => (
                <div
                    key={location.location_id}
                    ref={(el) => { itemRefs.current[location.location_id] = el; }}
                    className={`hall-wrapper ${selectedId === location.location_id ? 'selected' : ''}`}
                >
                    <DiningHallCard location={location} />
                </div>
            ))
            }
        </div>
    );
}