import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/TopItems.css';

const TopItems = () => {

    const [value, setValue] = useState(null);
    


    return (
        <div className="Root TopItems">
            <div className="top_items-content-container">
                <h1> Top Items </h1>
                <div className={`top_items-dropdown-wrapper`}>
                    <ul className="top_items-list">
                        {/* <DropdownItem text={"value 1"}/>
                        <DropdownItem text={"value 2"}/> */}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TopItems;
