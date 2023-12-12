import React from 'react'


export default function Navbar() {
    return (
        <nav>
            <img className="nav--logo" src="/static/cedar-logo.png"/>
            <h1 className="nav--title">MediMetrics</h1>
            <ul className="nav--list">
                <li className="nav--list--option">Dashboard</li>
                <li className="nav--list--option">Providers</li>
                <li className="nav--list--option">Financials</li>
                <li className="nav--list--option">Patients</li>
            </ul>
        </nav>

    )
    
}