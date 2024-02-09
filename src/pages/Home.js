import React, { useEffect,useState } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    // Load backend URL from environment variable
    setBackendUrl(process.env.REACT_APP_BACKEND_URL);
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user || !backendUrl) {
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/workouts`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_WORKOUTS', payload: json });
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [dispatch, user, backendUrl]);

  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;
