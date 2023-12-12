import React, { useState, useEffect } from 'react';
import './style.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FilterComponent from './components/Filter';


function App() {
    const [text, setText] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:5000/")
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => setText(data.clinician))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>    
            <Navbar/>
            <Dashboard/>
            <h1>{text}</h1>
        </div>
    );
}

export default App;

