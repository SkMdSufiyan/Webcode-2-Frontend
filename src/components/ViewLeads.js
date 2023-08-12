import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavItem, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CrmContext from '../contextProvider/CrmContext';

const ViewLeads = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(CrmContext);

    const typeOfUser = userProfile.typeOfUser;

    const [allLeadsData, setAlLeadsData] = useState([]);

    const getAllLeads = async () => {
      try{
          await axios.get(`${serverUrl}/api/${userProfile._id}/leads`, config)
          .then(res => {
            setAlLeadsData(res.data.data);
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

    // Calling "getAllLeads" function to get all leads data
      getAllLeads();

      // eslint-disable-next-line
    }, []);


    const handleDeleteLead = async (id) => {
      try{
        await axios.delete(`${serverUrl}/api/${userProfile._id}/leads/${id}`, config)
        .then(res => {
          getAllLeads();
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
    <div >
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




      {/* <p className='blue-color-p-class'>Leads and Contacts</p> */}
      <h6 style={{color : "green"}}>Leads and Contacts</h6>
      {/* Showing the "apiCallError", if any error occurs */}
      <h6 className='apiCallError-h6-class'>{apiCallError}</h6>
      <br />


      <div>
            {allLeadsData.length > 0 ? (
              // If there are leads in the database
              <div>
                {/* Displaying leads */}
                <p className='blue-color-p-class'>Leads</p>
                  <Table responsive striped >
                  <thead>
                    <tr>
                      <th>Sl.no.</th>
                      <th>Lead name</th>
                      <th>Email address</th>
                      <th>Address</th>
                      <th>Added by</th>
                      <th>Added date</th>
                      <th>Status</th>
                      {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ? <th>Action</th> : "" }
                    </tr>
                  </thead>
                  <tbody>
                    {allLeadsData.filter(doc => doc.leadStatus !== "Confirmed").map((val, index) => {
                      return <tr key={val._id}>
                        <td>{index+1}</td>
                        <td>{val.leadName}</td>
                        <td>{val.leadEmail}</td>
                        <td>{val.leadAddress}</td>
                        <td>{val.addedBy}</td>
                        <td>{val.addedDate}</td>
                        <td>{val.leadStatus}</td>
                        
                        {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ?
                        <td >
                            <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditLead/${val._id}` )} >Edit</Button>
                            
                            <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteLead(val._id)} >Delete</Button>
                        </td>
                        : "" }
                      </tr>
                    })}
                  </tbody>
                </Table>

                    <br />
                    <br />
                    {/* Displaying contacts (contacts are the leads with status Confirmed) */}
                    <p className='blue-color-p-class'>Contacts</p>

                <Table responsive striped >
                  <thead>
                    <tr>
                      <th>Sl.no.</th>
                      <th>Contact name</th>
                      <th>Email address</th>
                      <th>Address</th>
                      <th>Added by</th>
                      <th>Added date</th>
                      <th>Status</th>
                      {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ? <th>Action</th> : "" }
                    </tr>
                  </thead>
                  <tbody>
                    {allLeadsData.filter(doc => doc.leadStatus === "Confirmed").map((val, index) => {
                      return <tr key={val._id}>
                        <td>{index+1}</td>
                        <td>{val.leadName}</td>
                        <td>{val.leadEmail}</td>
                        <td>{val.leadAddress}</td>
                        <td>{val.addedBy}</td>
                        <td>{val.addedDate}</td>
                        <td>{val.leadStatus}</td>
                        
                        {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ?
                        <td >
                            <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditLead/${val._id}` )} >Edit</Button>
                            
                            <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteLead(val._id)} >Delete</Button>
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
                  <h6>No leads are added. Please add one.</h6>
                  <br />
                  <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
                </div>

               }

      </div>
  </div>
  )
}

export default ViewLeads;


