import React, { useEffect, useState } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from '@mui/material/CircularProgress';


// components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [backendUrl, setBackendUrl] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading state

  useEffect(() => {
    // Load backend URL from environment variable
    setBackendUrl(process.env.REACT_APP_BACKEND_URL);
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user || !backendUrl) {
        setLoading(true);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/workouts`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_WORKOUTS', payload: json });
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchWorkouts();
  }, [dispatch, user, backendUrl]);

  return (
    <div className="home">
      <div className="workouts">
        {/* Check if loading is true, if true display loader */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginTop: 200 }}>
           <CircularProgress color='success'/>
          </div>
        ) : (
          // If loading is false, display workouts or "No Records" message
          <>
           <div className='workouts-container'> 
           {workouts && workouts.map((workout) => (
              <WorkoutDetails key={workout._id} workout={workout} />
            ))}
            </div>
            {/* If there are no workouts, display no records message */}
            {(!workouts || workouts.length === 0) && (
              <div className='norecord'>
                <span>No Records</span>
              </div>
            )}
          </>
        )}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;
