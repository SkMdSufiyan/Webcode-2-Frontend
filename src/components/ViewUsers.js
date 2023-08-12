import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavItem, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CrmContext from '../contextProvider/CrmContext';


const ViewUsers = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();

    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(CrmContext);

    const typeOfUser = userProfile.typeOfUser;

    const [allUsersData, setAllUsersData] = useState([]);

    const getAllUsers = async () => {
      try{
          await axios.get(`${serverUrl}/api/${userProfile._id}/users`, config)
          .then(res => {
            setAllUsersData(res.data.data);
            setApiCallError("");
          })
          .catch(err => {
            setApiCallError(err.response.data.message);
          })
      }catch(error){
        setApiCallError(error.message);
      }
    }


    // When the component is mounted
    useEffect(() => {
      if(! accessToken){
        // If there is no accessToken, then navigating to login page
        navigate('/login');
    }

    // Calling the "getAllUsers" function to get all the users data
      getAllUsers();

      // eslint-disable-next-line
    }, []);


    const handleDeleteUser = async (id) => {
        try{
          await axios.delete(`${serverUrl}/api/${userProfile._id}/users/${id}`, config)
          .then(res => {
            getAllUsers();
            setApiCallError("");
          })
          .catch(err => {
            setApiCallError(err.response.data.message);
          })
      }catch(error){
        setApiCallError(error.message);
      }
    }



    
  return (
    <div>
      <Navbar  expand="md" className='Navbar-class' fixed='top'>
            <Nav className="mr-auto" navbar style={{alignItems : "center"}}>
                <NavItem>
                <h6 style={{color:"white"}}>Customer Relationship Management</h6>
                </NavItem>
            </Nav>
            <Nav className='ml-auto' navbar style={{alignItems : "center"}}>
                <NavItem style={{color : "white"}}>
                {userProfile.email}
                </NavItem>
                <NavItem>
                    <Button className='home-page-Button-class' color='warning' size='sm' onClick={logoutUserFun}>Log Out</Button>
                </NavItem>
            </Nav>
        </Navbar>




      <p className='blue-color-p-class'>Users</p>
      <h5 style={{color : "blue"}}>The users except you (the user who logged in) are:</h5>
      {/* Showing the "apiCallError", if any error occurs */}
      <h6 className='apiCallError-h6-class'>{apiCallError}</h6>
      
      {typeOfUser === "Admin" || typeOfUser === "Manager" ? (
        <div>
            {allUsersData.length > 1 ? (    
              // If there are other users (apart from the user who signed in) in the database

             <div>
               <Table responsive striped >
                <thead>
                  <tr>
                    <th>Sl.no.</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>ID</th>
                    {typeOfUser === "Admin" ? <th>Action</th> : "" }
                  </tr>
                </thead>
                <tbody>
                  {/* Displaying the users EXCLUDING the user who is logged in */}
                  {allUsersData.filter(doc => doc._id !== userProfile._id ).map((val, index) => {
                    return <tr key={val._id}>
                      <td>{index+1}</td>
                      <td>{val.firstName + " " + val.lastName}</td>
                      <td>{val.email}</td>
                      <td>{val.typeOfUser}</td>
                      <td  style={{maxWidth: '70px', whiteSpace: 'nowrap', overflow : "hidden", overflowX: 'scroll'}}>{val._id}</td>
                      
                      {typeOfUser === "Admin" ?
                      <td >
                          <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditUser/${val._id}` )} >Edit</Button>
                          
                          <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteUser(val._id)} >Delete</Button>
                      </td>
                      : "" }
                    </tr>
                  })}
                </tbody>

              </Table>
              <br />

              <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>

              <br />
              <br />
              <br />

            </div>

            ) : 
            <div>
                <h5>There are no other users except you.</h5>
                <br />
                <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
            </div>
             }
        </div>

      ) : (

        <div>
          <h6 style={{color : "red"}}>Access Denied !!! Only Admin and Manager have access to this page !!!</h6>
          <br />
          <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
          </div>

      ) }
   
    </div>
  )
}

export default ViewUsers;


