import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [name, setName] = useState('')
  const [number, setNumber] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { name, number }
    try {
      const response = await axios.post('https://rupicardassnbackend-astay6318s-projects.vercel.app/submit/', data);
      console.log(response.data);
      alert('Data submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit data');
    }
  }

  return (
    <div className="App">
      <h1> Submit Your Details</h1>
      <form onSubmit={handleSubmit}>
        <label> Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
        </label>
        <br />
        <label>
          Number:
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} required/>
        </label>
        <br />
        <button type ="submit">Submit</button>
        </form>
    </div>
  );
}

export default App;
