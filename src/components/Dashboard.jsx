import React from 'react'
import FilterComponent from './Filter';

export default function Dashboard() {
    const [monthlyTotals, setMonthlyTotals] = React.useState([]);
   
    const [hoursImage, setHoursImage] = React.useState("http://127.0.0.1:5000/get-monthly-hours-image");
    const [billableHoursData, setBillableHoursData] = React.useState({});
    const [allMonths, setAllMonths] = React.useState([]);
    const [allClinicians, setAllClinicians] = React.useState([]);

    React.useEffect(() => {
        fetch("http://127.0.0.1:5000/")
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setMonthlyTotals(data.monthlyTotals);
                const transformedData = {};
                
                const cliniciansSet = new Set();

                const monthsSet = new Set();
                data.billableHours.forEach(item => {
                    monthsSet.add(parseInt(item.Month, 10));  // Convert month to integer
                });
    
                // Sort months numerically and convert back to strings if needed
                const sortedMonths = [...monthsSet].sort((a, b) => a - b)
                                                  .map(month => month.toString());
    
                setAllMonths(sortedMonths);

                data.billableHours.forEach(item => {
                    const { Clinician, Month, 'Billable Hours (%)': BillableHours } = item;
                    monthsSet.add(Month);
                    cliniciansSet.add(Clinician);

                    if (!transformedData[Clinician]) {
                        transformedData[Clinician] = {};
                    }
                    transformedData[Clinician][Month] = BillableHours;
                });

                setBillableHoursData(transformedData);
                
                setAllClinicians([...cliniciansSet]);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    function handleFilterApplied(newData) {
        // Add a timestamp to the image URL to make it unique
        const newImageUrl = `http://127.0.0.1:5000/get-monthly-hours-image?${new Date().getTime()}`;
        setHoursImage(newImageUrl);
    }
  

    return (
        <div className="dashboard">
            <h1 className="dashboard--title">Dashboard</h1>
            <FilterComponent onFilterApplied={handleFilterApplied}/>
            <div className="grid-container">
                <div className="grid-item tall">
                    <h3>Average Monthly Income</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Clinician</th>
                                <th>Month</th>
                                <th>Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyTotals.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Clinician}</td>
                                    <td>{row.Month}</td>
                                    <td>{row['Amount Paid']}</td>
                                </tr>
                            ))}
                        </tbody>
                </table>
                </div>
                <div className="grid-item wide">
                    <h2>Average Monthly Hours</h2>
                    <img src={hoursImage} alt="Monthly Hours" />

                </div>
                <div className="grid-item wide">
                    <h3>Billable Hours</h3>
                    <table className="table billable-hours-table">
                        <thead>
                            <tr>
                                <th>Clinician</th>
                                {allMonths.map(month => <th key={month}>{month}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {allClinicians.map(clinician => (
                                <tr key={clinician}>
                                    <td>{clinician}</td>
                                    {allMonths.map(month => (
                                        <td key={month}>{billableHoursData[clinician]?.[month] || 'N/A'}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="grid-item">4</div>
                <div className="grid-item">5</div>
                <div className="grid-item">6</div>
                <div className="grid-item">7</div>
                <div className="grid-item">8</div>
                <div className="grid-item">9</div>
            </div>


        </div>
    )
    
}