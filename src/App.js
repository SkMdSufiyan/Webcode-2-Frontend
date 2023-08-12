import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import CrmProvider from './contextProvider/CrmProvider';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './components/UserDashboard';
import ViewUsers from './components/ViewUsers.js';
import AddOrEditUser from './components/AddOrEditUser';
import ViewLeads from './components/ViewLeads';
import AddOrEditLead from './components/AddOrEditLead';
import ViewServiceReqs from './components/ViewServiceReqs';
import AddOrEditServReq from './components/AddOrEditServReq';
import ActivateAccount from './components/ActivateAccount';



function App() {
  return (
    <div className="App">
      {/* As the Navbar is given fixed='top', the following breaking lines are required in the app.js. So that it will apply sufficient bottom margin after the Navbar in all the routes. */}
        <br />
        <br />
        <br />
        <br />
        <br />
       
        <p style={{color : "red", fontSize : "small", margin : "0px"}}>Kindly open and close this link one or two times before using this site. </p>
      <p style={{color : "red", fontSize : "small", margin : "0px"}}>Due to some Netlify deployment issue, it is not showing the data on opening it for the first time. </p>

      
      <br />

      <BrowserRouter>
        <CrmProvider>
          <Routes>
            {/* "Home" component displays the buttons for signup, login, forgot password */}
            <Route path="/" element={<ProtectedRoute accessBy={"not-authorized"}>< Home /></ProtectedRoute>} />
            

            {/* For registering new user */}
            <Route path="/signup" element={<ProtectedRoute accessBy={"not-authorized"}>< Signup /></ProtectedRoute>} />
            

            {/* For activating the account */}
            <Route path='/activate-account/:activationToken' element={< ActivateAccount />} />


            {/* For login */}
            <Route path="/login" element={<ProtectedRoute accessBy={"not-authorized"}>< Login /></ProtectedRoute>} />
            

            {/* For sending the password reset link through email */}
            <Route path="/forgot-password" element={<ProtectedRoute accessBy={"not-authorized"}>< ForgotPassword /></ProtectedRoute>} />
            

            {/* For resetting the password */}
            <Route path="/reset-password/:resetToken" element={< ResetPassword />} />

            {/* For user dashboard */}
            <Route path="/:userID/userDashboard" element={<ProtectedRoute accessBy={"authorized"}>< UserDashboard /></ProtectedRoute>} />
            
            {/* To view all the users */}
            <Route path="/:operatorID/viewUsers" element={<ProtectedRoute accessBy={"authorized"}>< ViewUsers /></ProtectedRoute>} />

            {/* To add a new user */}
            <Route path="/:operatorID/addOrEditUser" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditUser /></ProtectedRoute>} />

            {/* For updating an user */}
            <Route path="/:operatorID/addOrEditUser/:userID" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditUser /></ProtectedRoute>} />

            {/* To view leads and contacts (the confirmed leads are contacts) */}
            <Route path="/:userID/viewLeads" element={<ProtectedRoute accessBy={"authorized"}>< ViewLeads /></ProtectedRoute>} />

            {/* To add a new lead */}
            <Route path="/:userID/addOrEditLead" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditLead /></ProtectedRoute>} />

            {/* For updating a lead */}
            <Route path="/:userID/addOrEditLead/:leadID" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditLead /></ProtectedRoute>} />

            {/* To view service requests */}
            <Route path="/:userID/viewServiceRequests" element={<ProtectedRoute accessBy={"authorized"}>< ViewServiceReqs /></ProtectedRoute>} />

            {/* To add a new service request */}
            <Route path="/:userID/addOrEditServiceRequest" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditServReq /></ProtectedRoute>} />

            {/* For updating a service request */}
            <Route path="/:userID/addOrEditServiceRequest/:servReqID" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditServReq /></ProtectedRoute>} />


          </Routes>
        </CrmProvider>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
