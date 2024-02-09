import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    // Load backend URL from environment variable
    setBackendUrl(process.env.REACT_APP_BACKEND_URL);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !backendUrl) {
      setError('You must be logged in');
      return;
    }

    const workout = { title, load, reps };

    try {
      const response = await fetch(`${backendUrl}/api/workouts`, {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        dispatch({ type: 'CREATE_WORKOUT', payload: json });
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input 
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Number of Repetitions:</label>
      <input 
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
