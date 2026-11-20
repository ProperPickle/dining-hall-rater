# Dining Hall Rater


## Overview

A rating app that allows users to rate and leave a review on UCLA Dining Halls, see how others have rated the dining halls, and read other user reviews.


## Getting Started

Begin by cloning the repo
```
git clone https://github.com/ProperPickle/dining-hall-rater
```

### Frontend
Head to the frontend, and install the node dependencies
```
cd DiningHallRaterFrontend
npm install
```

Create a .env file, and put the local target URL you will be using to connect to the backend (following the .env.example file). \
For example, a backend running on port 3001 would assign VITE_API_TARGET_URL to http://localhost:3001 \
Remember this URL for the backend setup steps.

Run the frontend with the following command
```
npm run dev
```

### Backend
Head to the backend, and install the node dependencies
```
cd DiningHallRaterBackend
npm install
```

Create a .env file, and follow the .env.example file. Replace the placeholders with the appropriate keys. \
Your CLIENT_URL should be the port that the frontend application will run on. For instance, Vite's default frontend development port is 5173, so the URL should be  http://localhost:5173 \
Assign the PORT variable to the same port number used in the frontend's VITE_API_TARGET_URL env variable. If you used http://localhost:3001 for this, assign PORT to 3001.

Confirmed to work for Node Version: 22.19.0.

Run the backend with the following command
```
npm run dev
```