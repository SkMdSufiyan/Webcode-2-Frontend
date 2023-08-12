import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Card, Input, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import CrmContext from '../contextProvider/CrmContext';

const AddOrEditServReq = () => {

  const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(CrmContext);


    const {userID, servReqID} = useParams();

    const typeOfUser = userProfile.typeOfUser;
    let pageIs = "";
    if(servReqID){
      pageIs = "Edit service request page";
    }else{
      pageIs = "Add service request page";
    }


    const todayDate = new Date().toLocaleDateString();
    const emptyServReqFormData = {
        "title" : "",
        "description" : "",
        "createdBy" : userProfile.firstName + " " + userProfile.lastName,
        "createdDate" : todayDate,
        "status" : ""
    };

    const emptyServReqFormErrors = {
        "titleError" : "",
        "descriptionError" : "",
        "createdByError" : "",
        "createdDateError" : "",
        "statusError" : ""
    }


    // Initializing the states
    const [servReqFormData, setServReqFormData] = useState(emptyServReqFormData);
    const [servReqFormErrors, setServReqFormErrors] = useState(emptyServReqFormErrors);
    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(false);

    // "isAddOrEditSuccess" will be true if the user registration is successfull
    const [isAddOrEditSuccess, setIsAddOrEditSuccess] = useState(false);

     // The email IDs of the Admins and Managers to whom email is triggered when a new service request is created
    const [emailTrigerredTo, setEmailTrigerredTo] = useState([]);
  

// The "getServReqByID" function is for populating the "servReqFormData" with the data of the service request when it is UPDATE operation
    const getServReqByID = async () => {
      try{
          await axios.get(`${serverUrl}/api/${userID}/serviceRequests/${servReqID}`, config)
          .then(res => {
            setServReqFormData(res.data.data);
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

      if(servReqID){
        // If this is UPDATE operation, calling the "getServReqByID" function to populate the servReqFormData
        getServReqByID(); 
      }

      // eslint-disable-next-line
    }, []);



    // Function for making a post request to add a new service request
    const addNewServReqFun = async (servReqFormData) => {
        try{
            await axios.post(`${serverUrl}/api/${userID}/serviceRequests`, servReqFormData, config)
                .then(res => {
                    setIsAddOrEditSuccess(true);
                    setEmailTrigerredTo(res.data.successfullyTriggeredEmailTo);

                    setServReqFormData(emptyServReqFormData);
                    setApiCallError("");
                })
                .catch(err => {
                    setApiCallError(err.response.data.message);
                    setIsAddOrEditSuccess(false);
                })
        }catch(error){
            setApiCallError(error.message);
            setIsAddOrEditSuccess(false);
        }
    }


    // Function for making a put request to update a service request
    const updateServReqFun = async (servReqFormData) => {
      try{
          await axios.put(`${serverUrl}/api/${userID}/serviceRequests/${servReqID}`, servReqFormData, config)
              .then(res => {
                  setIsAddOrEditSuccess(true);
                  setServReqFormData(emptyServReqFormData);
                  setApiCallError("");
              })
              .catch(err => {
                  setApiCallError(err.response.data.message);
                  setIsAddOrEditSuccess(false);
              })
      }catch(error){
          setApiCallError(error.message);
          setIsAddOrEditSuccess(false);
      }
  }


    // Function for handling the state of "isAllValidData"
    const declareAllValidDataFunction = () => {
        // Checking whether any of the mandatory input fields is empty (not filled)
        const emptyInputFields = Object.values(servReqFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "servReqFormErrors" contains error value
        const errorsInTheForm = Object.values(servReqFormErrors).filter(val => val !== "").length;

        // Changing the state of "isAllValidData"
        if( ! emptyInputFields && ! errorsInTheForm ){
            setIsAllValidData(true);  
        }else{
            setIsAllValidData(false);
        }

    }


    useEffect(() => {
         // Calling the function "declareAllValidDataFunction" to set the state of "isAllValidData", based on which submit button will be disabled or enabled
        declareAllValidDataFunction();
        // eslint-disable-next-line
    }, [servReqFormData, servReqFormErrors]);


    // Function for handling the input field changes
    const handleServReqFormChange = (e) => {
        setServReqFormData({...servReqFormData, [e.target.name] : e.target.value});


        // Validating  title field
        if(e.target.name === "title"){
            if( ! validator.isEmpty(e.target.value)){
                setServReqFormErrors({...servReqFormErrors, "titleError" : ""});
            }else{
                setServReqFormErrors({...servReqFormErrors, "titleError" : "Title is required"});
            }
        }

        // Validating description field
        if(e.target.name === "description"){
            if( ! validator.isEmpty(e.target.value)){
                setServReqFormErrors({...servReqFormErrors, "descriptionError" : "" });
            }else{
                setServReqFormErrors({...servReqFormErrors, "descriptionError" : "Description is required"});
            }
        }

        // Validating createdBy field
        if(e.target.name === "createdBy"){
            if( ! validator.isEmpty(e.target.value )){
                setServReqFormErrors({...servReqFormErrors, "createdByError" : "" });
            }else{
                setServReqFormErrors({...servReqFormErrors, "createdByError" : "Created by is required"});
            }
        }


        // Validating createdDate field
        if(e.target.name === "createdDate"){
          if( ! validator.isEmpty(e.target.value)){
              setServReqFormErrors({...servReqFormErrors, "createdDateError" : ""});
          }else{
              setServReqFormErrors({...servReqFormErrors, "createdDateError" : "Created date is required"});
          }
      }


        // Validating status field
        if(e.target.name === "status"){
            if(validator.isEmpty(e.target.value)){
                setServReqFormErrors({...servReqFormErrors, "statusError" : "Status is required"});
            }else{
                setServReqFormErrors({...servReqFormErrors, "statusError" : "" });
            }
        }

    }


    //  Function for handling the onClick event of submit button (form submission)
    const handleSubmitServReqForm = (e) => {
        e.preventDefault();
        if(servReqID){
          updateServReqFun(servReqFormData);
        }else{
          addNewServReqFun(servReqFormData);
        }
    }



  return (
    <div className='component-main-div'>
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



        <p className='blue-color-p-class'>{pageIs}</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

        {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ? (
          <div>
              { ! isAddOrEditSuccess ? (
                // When the page is just loaded, and the data is not submitted yet
                // Then showing the service request form
                  
                  <Card style={{width: '18rem'}}>
                    <span>After submitting the form kindly wait for some time it may take some time to process</span>
                      <CardBody>
                          
                          
                          <Label>Title</Label><span>*</span>
                          <Input type='text' placeholder='Enter service request title' name='title' value={servReqFormData.title} onChange={handleServReqFormChange} />
                          <span>{servReqFormErrors.titleError} </span>
                          <br />

                          <Label>Description</Label><span>*</span>
                          <Input type='text' placeholder='Enter service request description' name='description' value={servReqFormData.description} onChange={handleServReqFormChange} />
                          <span>{servReqFormErrors.descriptionError} </span>
                          <br />

                          
                          <Label>Created by</Label><span>*</span>
                          <Input type='text' placeholder='Enter created by' name='createdBy' value={servReqFormData.createdBy} onChange={handleServReqFormChange} disabled={true} />
                          <span>{servReqFormErrors.createdByError} </span>
                          <br />

                          <Label>Created date</Label><span>*</span>
                          <Input type='text' placeholder='Enter created date' name='createdDate' value={servReqFormData.createdDate} onChange={handleServReqFormChange} disabled={true} />
                          <span>{servReqFormErrors.createdDateError} </span>
                          <br />
                          
                          <Label>Service request status</Label><span>*</span>
                          <select name='status' value={servReqFormData.status} onChange={handleServReqFormChange}>
                              <optgroup label='Select service request status'>
                                  <option value={""} disabled>Select service request status</option>
                                  <option value={"Created"}>Created</option>
                                  <option value={"Open"}>Open</option>
                                  <option value={"In process"}>In process</option>
                                  <option value={"Released"}>Released</option>
                                  <option value={"Cancelled"}>Cancelled</option>
                                  <option value={"Completed"}>Completed</option>
                              </optgroup>
                          </select>
                          <br />
                          <br />
                          

                          <Button className='Button-class' color='success' disabled={ ! isAllValidData } onClick={handleSubmitServReqForm}>Submit</Button>

                          {servReqID ? 
                          //   If it is UPDATE operation
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userID}/viewServiceRequests`)}>Cancel</Button>
                            :
                            // If it is POST operation (adding new service request)
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userID}/userDashboard`)}>Cancel</Button>
                           }
                      </CardBody>
                  </Card>     
              ) : "" }  


              { isAddOrEditSuccess ? (
                  // If the form is submitted and the service request is added or updated successfully
                  <Card style={{width: '18rem'}}>
                      <CardBody>
                          <h6 className='apiCallSuccess-h6-class'>{servReqID ? "Service request is updated successfully" : "Service request is added successfully"}</h6>

                          { servReqID ? "" : 
                          <h6 className='apiCallSuccess-h6-class'>Email is triggered to : {emailTrigerredTo}</h6>
                          }
                          
                          <br />
                          <br />
                          {servReqID ? 
                            <Button color='primary' onClick={()=>navigate(`/${userID}/viewServiceRequests`)}>To service requests page</Button>
                            :
                            <Button color='primary' onClick={()=>navigate(`/${userID}/userDashboard`)}>To dashboard</Button>
                          }
                      </CardBody>
                  </Card>
              ) : "" }
                  
          </div>
        ) : (
            <div>
                <h6 style={{color : "red"}}>Access Denied !!! You can not use this page without rights !!!</h6>
                  <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
                </div>
           ) }
            
            
    </div>
  )
}

export default AddOrEditServReq;


