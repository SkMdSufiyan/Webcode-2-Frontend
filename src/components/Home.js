import React, { useContext } from 'react';
import { Button, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import CrmContext from '../contextProvider/CrmContext';

// This component displays the home page of this application
const Home = () => {
    const navigate = useNavigate();
    const {logoutMessage} = useContext(CrmContext);

  return (
    <div className='component-main-div'>
      <Navbar  expand="md" className='Navbar-class' fixed='top'>
          <Nav className="mr-auto" navbar style={{alignItems : "center"}}>
            <NavItem>
              <h6 style={{color:"white"}}>Customer Relationship Management</h6>
            </NavItem>
          </Nav>
          <Nav className='ml-auto' navbar style={{alignItems : "center"}}>
            <NavItem>
                <Button className='home-page-Button-class' color='primary' size='sm' onClick={() => navigate('/login')}>Login</Button>
            </NavItem>
            <NavItem>
                <Button className='home-page-Button-class' color='info' size='sm' onClick={()=>navigate('/signup')}>Signup</Button>
            </NavItem>
          </Nav>
    </Navbar>
      
      

        <h5 style={{color: "blue"}}>Welcome to CRM application </h5>
        <p className='blue-color-p-class'>(customer relationship management)</p>
        {/* A message will be displayed when an user logged out successfully */}
        <h5 style={{color : "green"}}>{logoutMessage}</h5>


        <br />

        {/* Application usage suggestions */}


        <h6>Instructions</h6>
        <div className='home-page-suggestion-flex'>
          <div className='home-page-suggestion-divs'>
            <ul>
            <li><p className='home-page-suggestion-p-red'><b>This page will monitor the localStorage (for access token) every 2 minutes. So, during login, signup, forgot-password operations, please fill the details in less than 2 minutes. Otherwise, it will reload the login page again.</b></p></li>
            <li><p className='home-page-suggestion-p-green'>All the recommended features are implemented.</p></li>
            <li><p className='home-page-suggestion-p-red'>The "Forgot password" or "Reset password" link is given in the login page.</p></li>
            <li><p className='home-page-suggestion-p-green'><b>In the "View users" page, the users' details EXCLUDING the user (admin or manager) who is signed in  will be displayed.</b></p></li>
            
            <li><p className='home-page-suggestion-p-red'>For using pages which do not need authentcation, logout from your account first.</p></li>

            <li><p className='home-page-suggestion-p-green'><b>In the signup page, "trim()" is used while storing the form inputs (to avoid the white spaces in names, passwords, email etc.). </b></p></li>
            <li><p className='home-page-suggestion-p-red'><b>Therefore, to give more than one word in the "First name" field enter the words and then give the space between them (eg. give "word1word2" and then give space between them to make it "word1 word2". the similar case for "Last name" field also.) </b></p></li>
            

            </ul>
           

          </div>
          <div className='home-page-suggestion-divs'>
          <ul>
          <li><p className='home-page-suggestion-p-red'>The user during SIGNUP, should give valid and working email id. An account-activation link will be sent to the registered email id.</p></li>
          <li><p className='home-page-suggestion-p-green'>When Admin or Manager adds an user, then the user email (of the user who is being added by the manager or admin) need not be working email. That account will be activated without sending the account-activation link.</p></li>
            <li><p className='home-page-suggestion-p-red'>It is assumed that there can be multiple Admins and multiple managers.</p></li>
            <li><p className='home-page-suggestion-p-green'>So, when a new lead or service request is added, this application will trigger an email to all the admins and managers.</p></li>
            <li><p className='home-page-suggestion-p-red'><b>A lead with status "Confirmed" is considered as a "Contact".</b></p></li>

          </ul>           
          </div>

        </div>

    </div>
  )
}

export default Home;



