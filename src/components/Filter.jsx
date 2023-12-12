import React, { useState, useEffect } from 'react';
import Select from "react-select";

export default function FilterComponent({ onFilterApplied }) {

    

    const [filter, setFilter] = React.useState({
        start: '',
        end: '',
        clinicianNames: [], 
        roles: [] 
    });

    const [clinicianOptions, setClinicianOptions] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/clinicians')
            .then(response => response.json())
            .then(data => setClinicianOptions(data))
            .catch(error => console.error('Error fetching clinicians:', error));
    }, []);

    
    // const clinicianOptions = [
    //     { value: 'Natasha Donnelly', label: 'Natasha' },
    //     { value: 'Tracy', label: 'Bob' },
    //     { value: 'Charlie', label: 'Charlie' },
        
    // ];
    const roleOptions = ["Nurse Practitioner", "Psychologist", "Therapist"];

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setFilter(prev => ({
                ...prev,
                [name]: checked 
                    ? [...prev[name], value] 
                    : prev[name].filter(item => item !== value)
            }));
        } else {
            setFilter(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    function handleClinicianChange(selectedOptions) {
        setFilter({
            ...filter,
            clinicianNames: selectedOptions || []
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        // Convert the selected options to a format suitable for the backend
        const filterData = {
            ...filter,
            clinicianNames: filter.clinicianNames.map(option => option.value),
            roles: filter.roles
        };

        // Send the filter data to the backend
        fetch('http://127.0.0.1:5000/filter-hours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filterData),
        })
        .then(response => response.json())
        .then(data => {
            // Call a parent component function to update the state with new data
            onFilterApplied(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <form className="filter" onSubmit={handleSubmit}>
            <label className="filter--item">
                Start Date:
                <input 
                    type="date" 
                    name="start" 
                    value={filter.start} 
                    onChange={handleChange} 
                />
            </label>
            <label className="filter--item">
                End Date: 
                <input 
                    type="date" 
                    name="end" 
                    value={filter.end} 
                    onChange={handleChange} 
                />
            </label>
            <label className="filter--item">
                Clinician Names:
                <Select className="select--container"
                    options={clinicianOptions} 
                    isMulti
                    onChange={handleClinicianChange}
                    value={filter.clinicianNames}
                />
            </label>
            <fieldset className="filter--item">
                <legend>Roles:</legend>
                {roleOptions.map((role, index) => (
                    <label key={index}>
                        <input 
                            type="checkbox"
                            name="roles"
                            value={role}
                            checked={filter.roles.includes(role)}
                            onChange={handleChange}
                        />
                        {role}
                    </label>
                ))}
            </fieldset>
            <button type="submit">Apply Filter</button>
        </form>
    );
}


