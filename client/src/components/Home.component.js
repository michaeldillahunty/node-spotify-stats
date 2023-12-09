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
   const [limit, setLimit] = useState(5);
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
          // Determine the type based on the items in topItems, this assumes you have such information
          const type = determineType(topItems.items); // This should return 'track' or 'artist'
          console.log("TYPE : " + type)
          
          const response = await axios.post('http://localhost:8000/saveListType', {
            items: topItems.items,
            user: currentUser.id,
            type: type,
          });
          
          console.log("List saved:", response.data);
          setSaveStatus('List saved successfully!');
          setSaveSuccess(true); // Indicate that the save was successful
        } catch (error) {
          console.error('Error saving list:', error);
          setSaveStatus('Failed to save list');
          setSaveSuccess(false); // Indicate that the save failed
        }
        // Clear the save status after 5 seconds
        setTimeout(() => {
          setSaveStatus('');
          setSaveSuccess(null); // Reset the success status to null or undefined
        }, 5000);
      } else {
        console.log("No items to save");
        setSaveStatus('No items to save.');
        setSaveSuccess(false);
      }
    };
    
    const determineType = (items) => {
      if (items[0].album) {
        return 'track';
      } else {
        return 'artist';
      }
    };


   const [artistLists, setArtistLists] = useState([]);
   const [trackLists, setTrackLists] = useState([]);
   const [isFetching, setIsFetching] = useState(false);

   const fetchUserLists = async () => {
   
   if (currentUser && currentUser.id && !isFetching) {
         setIsFetching(true); // Set to true before fetching
         try {
            const response = await axios.get(`http://localhost:8000/getLists/${currentUser.id}`);
            console.log(response.data);
            if (response.data.artistLists) {
               setArtistLists(response.data.artistLists);
           }
           if (response.data.trackLists) {
               setTrackLists(response.data.trackLists);
           }
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
               <section className="artist-list-content">
                  <h3 className="list-type-h3"> Top Arists List(s) </h3>
                     {Array.isArray(artistLists) && artistLists.map((list, index) => (
                        <div className={`prev-lists ${list.items.length > 11 ? 'two-columns' : ''}`} key={index}>
                           {/* <div className="title-card">
                              <h3>Saved Artist List #{index + 1}</h3>
                           </div> */}
                           {list.items.map((item, idx) => (
                                 <div key={idx} className="list-item">
                                    {item.images[0] && item.external_urls.spotify && (
                                       <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                             <img src={item.images[0].url} alt={item.name} style={{ width: '75px', height: '75px', marginBottom: '5px' }}/>
                                       </a>
                                    )}
                                    <p>{item.name}</p>
                                 </div>
                           ))}
                        </div>
                     ))}
               </section>
               <div className="track-list-content">
                  <h3 className="list-type-h3"> Your Top Tracks Lists</h3>
                  <div className="track-item-row">
                     {Array.isArray(trackLists) && trackLists.map((list, index) => (
                        <div className={`track-prev-lists ${list.items.length > 11 ? 'two-columns' : ''}`} key={index}>
                           {/* <div className="title-card">
                              <h3>Saved Track List #{index + 1}</h3>
                           </div> */}
                           {list.items.map((item, idx) => (
                              <div key={idx} className="list-item">
                              
                                 <div className="track-col-1">
                                 
                                    {item.album.images[0] && (
                                    <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                       <p className="track-rank">{idx + 1}</p>
                                       <img href={item.external_urls.spotify} src={item.album.images[0].url} alt={item.name} style={{ width: '75px', height: '75px', marginBottom: '5px' }}/>
                                       <p className="track-col-song-name">{item.name}</p>
                                       <p className="track-col-artist">{item.artists[0].name}</p>
                                       <p className="track-col-album">{item.album.name}</p>
                                       <p className="track-col-duration">{formatSongDuration(item.duration_ms)}</p>
                                       {item.preview_url && (
                                          <>
                                             <div className="play-preview-wrapper">
                                             <audio id={`preview-audio-${idx}`} src={item.preview_url}>
                                                Your browser does not support the audio element.
                                             </audio>
                                             <button className="preview-button" onClick={(e) => {
                                                e.preventDefault(); // Stop the button from triggering the link
                                                const audio = document.getElementById(`preview-audio-${idx}`);
                                                if (audio.paused) {
                                                   audio.play();
                                                } else {
                                                   audio.pause();
                                                   audio.currentTime = 0; // Reset the audio to the start
                                                }
                                             }}>
                                                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 kPpCsU"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>

                                             </button>
                                             </div>
                                          </>
                                          )}
                                    </a>
                                    )}
                                    {/* <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 kPpCsU"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg> */}
                                    
                                    
                                 </div>
                              </div>
                              ))}
                        </div>
                     ))}
                     </div>
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
                  <DropdownItem img = {baseIcon} text = {"My  Profile"}/>
                  <DropdownItem img = {baseIcon} text = {"Edit Profile"}/>
                  <DropdownItem img = {baseIcon} text = {"Inbox"}/>
               </ul>
            </div>
         </div>  */}


function formatSongDuration(ms) {
   const minutes = Math.floor(ms / 60000);
   const seconds = ((ms % 60000) / 1000).toFixed(0);
   return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;  // returns "X:XX" format
}