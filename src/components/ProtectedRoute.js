import React, { useContext } from 'react';
import CrmContext from '../contextProvider/CrmContext';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({children, accessBy}) => {
    const {accessToken, userProfile} = useContext(CrmContext);

    if(accessBy === "not-authorized"){
        // For the routes which do NOT need authorization
        if(! accessToken){
            return children;
        }else{
            // We should use curly braces to give the dynamic path to the "to" prop in Navigate
            return <Navigate to={`/${userProfile._id}/userDashboard`} />
        }
    }else if(accessBy === "authorized"){
        // For the routes which need authorization
        if(accessToken){
            return children;
        }else{
            return <Navigate to='/login' />
        }
    }

return <Navigate to='/' />
}

export default ProtectedRoute;


