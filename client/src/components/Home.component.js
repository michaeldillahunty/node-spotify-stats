import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/HomePage.css';
import './styles/LoginPage.css';
import '../index.css';
import apiService from '../api/api.service';
import service from '../api/axios.service';
import queryString from 'query-string';
import Login from './Login.component';
import TopItems from './TopItems.component';

import baseIcon from '../images/system_icon.png';

function DropdownItem(props){
   return(
      <li className = 'dropdownItem'>
         <img src={props.img}></img>
         <a> {props.text} </a>
      </li>
   );
}

function Home(props) {


   /// Spotify Login
   const [currentUser, setCurrentUser] = useState(null);
   const generateRandomString = (length) => {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
      for (let i = 0; i < length; i++) {
         text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
   };
  
   const handleLogin = () => {
      window.location.href = 'http://localhost:8000/auth/login';
   };

   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            const response = await fetch('http://localhost:8000/user/profile', {
               credentials: 'include' // Needed to include the session cookie
            });
            if (response.ok) {
               const profileData = await response.json();
               setCurrentUser(profileData);
            } else {
               console.error('User not authenticated');
            }
         } catch (error) {
            console.error('Error fetching user profile:', error);
         }
      };
      fetchUserProfile();
   }, []);

   const [metric, setMetric] = useState('artists');
   const [timeRange, setTimeRange] = useState('medium_term');
   const [limit, setLimit] = useState(10);
   function handleMetricChange(e) {
      setMetric(e.target.value);
   }
   
   function hanldeTimeRangeChange(e) {
      setTimeRange(e.target.value);
   }
   
   function handleLimitChange(e) {
      setLimit(e.target.value);
   }


   const [topItems, setTopItems] = useState([]);
   const testEndpoint = async () => {
      const query = queryString.stringify({
         time_range: timeRange,
         limit: limit,
      });
      const type = metric;
      await axios.get(`http://localhost:8000/topItems/${type}?${query}`)
          .then(response => {
            setTopItems(response.data);
            console.log("response data: " + JSON.stringify(response.data, null, 2));
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
   }


   function composeSummary() {
      const timeRangeMapping = {
          'short_term': 'Last Month',
          'medium_term': 'Past 6 Months',
          'long_term': 'All Time'
      };
  
      const metricMapping = {
          'artists': 'Artists',
          'tracks': 'Songs'
      };
  
      const timeRangeText = timeRangeMapping[timeRange] || '';
      const metricText = metricMapping[metric] || '';
      const limitText = limit || '';
  
      return `Your Top ${limitText} ${metricText} - ${timeRangeText}`;
   }

   const [saveStatus, setSaveStatus] = useState('');
   const [saveSuccess, setSaveSuccess] = useState(true);

   const handleSave = async () => {
      if (topItems && Array.isArray(topItems.items) && topItems.items.length > 0) {
         try {
             const response = await axios.post('http://localhost:8000/saveList', {
                 items: topItems.items,
                 user: currentUser.id,
             });
             console.log("List saved:", response.data);
             setSaveStatus('List saved successfully!');
             setSaveSuccess(true); // Indicate that the save was successful
         } catch (error) {
             console.error('Error saving list:', error);
             setSaveStatus('Failed to save list');
             setSaveSuccess(false); // Indicate that the save failed
         }
         setTimeout(() => {
            setSaveStatus('');
            setSaveSuccess(true); // Reset the success status
          }, 5000);
     } else {
         console.log("No items to save");
         setSaveStatus('No items to save.');
         setSaveSuccess(false); 
     }
  };

  const [lists, setLists] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

   const fetchUserLists = async () => {
   
   if (currentUser && currentUser.id && !isFetching) {
         setIsFetching(true); // Set to true before fetching
         try {
            const response = await axios.get(`http://localhost:8000/getLists/${currentUser.id}`);
            setLists(response.data); // Set the fetched lists to state
         } catch (error) {
            console.error('Error fetching lists:', error);
         } finally {
            setIsFetching(false); // Reset to false after fetching
         }
      }
   };


   

   return (
      <div className="Root HomePage">
         <div className="header">
            <h3 className="page-heading">Spotify Stats</h3>
         </div>
         <div className="main-content-middle">
            <div className="right-container">
                  <div className="user-data-container">
                     {currentUser && (
                        <div className="user-profile">
                           <span> User ID: { currentUser.id } </span>
                           <span> Display Name: { currentUser.display_name } </span>   
                           <span> Email: { currentUser.email } </span>
                        </div>   
                     )}
                  </div>           
               </div>
         </div>
         <div className="main-content">
            <div className="left-container">
               <div className="spotify-btn-container"> 
                  <a className="button button-spotify" onClick={handleLogin}>
                     <img src="spotify-logo.png"></img>
                     <p>Log in with Spotify </p>
                  </a>
               </div>
               <div className="user-top-item-container">
                  <label htmlFor="metric-dropdown">Metric</label>
                  <select id="metric-dropdown" className="metric-dropdown" onChange={handleMetricChange}>
                     <option value="artists">Artists</option>
                     <option value="tracks">Tracks</option>
                  </select>
               </div>
               <div className="user-top-item-container">
                  <label htmlFor="metric-dropdown" id="time-label">Time Period</label>
                  <select id="metric-dropdown" className="metric-dropdown" onChange={hanldeTimeRangeChange}>
                     <option value="short_term">Past Month</option>
                     <option value="medium_term">Past 6 Months</option>
                     <option value="long_term">All Time</option>
                  </select>
               </div>
               <div className="user-top-item-container">
                  <label htmlFor="metric-dropdown" id="time-label">Item Limit</label>
                  <select id="metric-dropdown" className="metric-dropdown" onChange={handleLimitChange}>
                     <option value={5}>5</option>
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                  </select>
               </div>
               <div className="main-button-div">
                  <button className="exec-request-btn" onClick={testEndpoint}>Get Stats</button>
               </div>
            </div>
            <div className="container-3"> 
               <div className="summary-display">
                  <p>{composeSummary()}</p>
                  
               </div>

               <div className="top-items-display">
                  {/* <p id="top-items-label">TOP  ITEMS</p> */}
                  
                  <ul className="top-items-ul">
                     {topItems.items && topItems.items.map((item, index) => (
                        <li key={index}>
                           <div className="item-data">
                              <div className="item-col-1">
                                 {/* <div className="ranking-number">[ {index + 1} ]</div> */}
                                 {item.images && item.images[0] && (
                                    <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="item-spotify-link">
                                       <img src={item.images[0].url} alt={item.name} style={{ width: '100px', height: '100px' }}/>
                                    </a>
                                 )}
                                    
                              </div>
                              <div className="item-col-2">
                                 <div className="item-info-main">{item.name} [{item.popularity}]</div>
                                 {/* {item.genres && <p className="item-genres">Genres: {item.genres.join(', ')}</p>} */}
                              </div>
                        </div>
                     </li>
                  ))}
               </ul>
               
            </div>
            <div className="save-to-db-btn">
               <button className="save-button" onClick={handleSave}>Save List</button>
               {saveStatus && (
                  <div 
                     className="save-status-message"
                     style={{ color: saveSuccess ? '#1DB954' : 'red' }}
                  >
                     {saveStatus}
                  </div>
               )}
            </div>
         </div>
            
         </div>
         <div className="secondary-row">
            <div className="fetch-lists-button-container">
               <button onClick={fetchUserLists} className="fetch-lists-button" disabled={isFetching}>  {isFetching ? 'Fetching...' : 'Fetch Previous Lists'}</button>
            </div>
            <div className="prev-user-lists-container">
               <div className="prev-list-content">
                     {lists.map((list, index) => (
                        <div className={`prev-lists ${list.items.length > 11 ? 'two-columns' : ''}`} key={index}>
                           <div className="title-card">
                              <h3>Saved List #{index + 1}</h3>
                           </div>
                           {list.items.map((item, idx) => (
                                 <div key={idx} className="list-item">
                                    {item.images[0] && item.external_urls.spotify && (
                                       <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                             <img src={item.images[0].url} alt={item.name} style={{ width: '100px', height: '100px', marginBottom: '5px' }}/>
                                       </a>
                                    )}
                                    <p>{item.name}</p>
                                 </div>
                           ))}
                        </div>
                     ))}
               </div>
            </div>
         </div>
      </div>
   );
}

export default Home;

{/* <div className='menu-container' ref={menuRef}>
            <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
               <img src={baseIcon}></img>
            </div>

            <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
               <h3>Welcome <br/></h3>
               <ul>
                  <DropdownItem img = {baseIcon} text = {"My Profile"}/>
                  <DropdownItem img = {baseIcon} text = {"Edit Profile"}/>
                  <DropdownItem img = {baseIcon} text = {"Inbox"}/>
               </ul>
            </div>
         </div>  */}