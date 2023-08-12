import React, { useEffect, useState } from 'react';
import CrmContext from './CrmContext';
import { useNavigate } from 'react-router-dom';

const CrmProvider = (props) => {
    const navigate = useNavigate();
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const monitorTimeInterval = 2*60*1000; // The time interval after which this application monitor the localStorage for accessToken


    // "apiCallError" contains any errors occured during api calls or in try-catch
    const [apiCallError, setApiCallError] = useState("");

    const [logoutMessage, setLogoutMessage] = useState("");


    // Once the user is logged in, the accessToken, userProfile will be stored in localStorage (login component will do that once the user signed in)
    // After that the this "CrmProvider" will monitor the localStorage for accessToken
    // That accessToken will be maintined in this "accessToken" state
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "" );

    // "userProfile" will have the user data once the user is logged in successfully
    const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem("userProfile")) || {});


// A function to update the "accessToken" as well as "userProfile" from localStorage
    const updateAccessToken = () => {
      const token = localStorage.getItem("accessToken");
      if(! token) {
        navigate('/login');
      }
      setAccessToken(token);
      setUserProfile(JSON.parse(localStorage.getItem("userProfile")));
     
    }


    useEffect(() => {
        // setInterval to monitor access token (by calling the "updateAccessToken" function in regular intervals)
        const interval = setInterval(updateAccessToken, monitorTimeInterval);                

        // Now set interval to run the update function after every few minutes
        // Here do NOT give the parenthesis after the function; needs to give just reference of the function
              
      // Clearing the interval (when the "CrmProvider" component is unmounted)
        return () => clearInterval(interval);
        
        // eslint-disable-next-line
    }, []);


    
// "config" for sending the access token in headers for the API calls (for server side authentication)
const config = {
  "headers" : {
    "Authorization" : `Bearer ${accessToken}`
  }
};


// Function for logout (this function will clear the "accessToken" and "userProfile" from the localStorage)
const logoutUserFun = () => {
      try{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userProfile');

        setAccessToken("");
        setUserProfile({});
 

        // Setting the successful logout message
        setLogoutMessage("Signed out successfully");
        setApiCallError("");
        navigate('/');
        
      }catch(error){
        setApiCallError(error.message);
      }
}



  return (
    <CrmContext.Provider value={{accessToken, setAccessToken, userProfile, setUserProfile, apiCallError, setApiCallError, logoutMessage, setLogoutMessage, logoutUserFun, config, serverUrl}}>
        {props.children}
    </CrmContext.Provider>
  )
}

export default CrmProvider;


