import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavItem, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CrmContext from '../contextProvider/CrmContext';

const ViewServiceReqs = () => {
  const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
  const navigate = useNavigate();


  const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(CrmContext);

  const typeOfUser = userProfile.typeOfUser;

  const [allServReqsData, setAllServReqsData] = useState([]);

  const getAllServReqs = async () => {
    try{
        await axios.get(`${serverUrl}/api/${userProfile._id}/serviceRequests`, config)
        .then(res => {
          setAllServReqsData(res.data.data);
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

  // Calling the "getAllServReqs" function to get all service requests data
    getAllServReqs();

    // eslint-disable-next-line
  }, []);


  const handleDeleteServiceRequest = async (id) => {
    try{
      await axios.delete(`${serverUrl}/api/${userProfile._id}/serviceRequests/${id}`, config)
      .then(res => {
        getAllServReqs();
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




      <p className='blue-color-p-class'>Service requests</p>
      {/* Showing the "apiCallError", if any error occurs */}
      <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

      <div>
            {allServReqsData.length > 0 ? (
              // If there are service requests in the database
             <div>
                <Table responsive striped >
                  <thead>
                    <tr>
                      <th>Sl.no.</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Created by</th>
                      <th>Created date</th>
                      <th>Status</th>
                      {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ? <th>Action</th> : "" }
                    </tr>
                  </thead>
                  <tbody>
                    {allServReqsData.map((val, index) => {
                      return <tr key={val._id}>
                        <td>{index+1}</td>
                        <td>{val.title}</td>
                        <td>{val.description}</td>
                        <td>{val.createdBy}</td>
                        <td>{val.createdDate}</td>
                        <td>{val.status}</td>
                        
                        {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ?
                        <td >
                            <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditServiceRequest/${val._id}` )} >Edit</Button>

                            <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteServiceRequest(val._id)} >Delete</Button>
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
                  <h6>No service requests are added. Please add one.</h6>
                  <br />
                  <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
                </div>

               }

      </div>
  </div>
  )
}

export default ViewServiceReqs;


