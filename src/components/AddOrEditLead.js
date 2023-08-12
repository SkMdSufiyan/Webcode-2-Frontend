import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Card, Input, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import CrmContext from '../contextProvider/CrmContext';

const AddOrEditLead = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(CrmContext);

    const {userID, leadID} = useParams();

    const typeOfUser = userProfile.typeOfUser;
    let pageIs = "";
    if(leadID){
      pageIs = "Edit lead page";
    }else{
      pageIs = "Add lead page";
    }


    const todayDate = new Date().toLocaleDateString();
    const  emptyLeadFormData = {
        "leadName" : "",
        "leadEmail" : "",
        "leadAddress" : "",
        "addedBy" : userProfile.firstName + " " + userProfile.lastName,
        "addedDate" : todayDate,
        "leadStatus" : ""
    };

    const emptyLeadFormErrors = {
      "leadNameError" : "",
      "leadEmailError" : "",
      "leadAddressError" : "",
      "addedByError" : "",
      "addedDateError" : "",
      "leadStatusError" : ""
    }


    // Initializing the states
    const [leadFormData, setLeadFormData] = useState(emptyLeadFormData);
    const [leadFormErrors, setLeadFormErrors] = useState(emptyLeadFormErrors);

    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(false);

    // "isAddOrEditSuccess" will be true if the user registration is successfull
    const [isAddOrEditSuccess, setIsAddOrEditSuccess] = useState(false);

    // The email IDs of the Admins and Managers to whom email is triggered when a new lead is added
    const [emailTrigerredTo, setEmailTrigerredTo] = useState([]);
  

// The "getLeadByID" function is for populating the "leadFormData" with the data of the lead when it is UPDATE operation
    const getLeadByID = async () => {
      try{
          await axios.get(`${serverUrl}/api/${userID}/leads/${leadID}`, config)
          .then(res => {
            setLeadFormData(res.data.data);
            setIsAllValidData(true);
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

      if(leadID){
        // If this is UPDATE operation, calling the "getLeadByID" function to populate the leadFormData
        getLeadByID(); 
      }

      // eslint-disable-next-line
    }, []);



    // Function for making a POST request to ADD a new lead
    const addNewLeadFun = async (leadFormData) => {
        try{
            await axios.post(`${serverUrl}/api/${userID}/leads`, leadFormData, config)
                .then(res => {
                    setIsAddOrEditSuccess(true);
                    setEmailTrigerredTo(res.data.successfullyTriggeredEmailTo);

                    setLeadFormData(emptyLeadFormData);
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


    // Function for making a PUT call to UPDATE a lead
    const updateLeadFun = async (leadFormData) => {
      try{
          await axios.put(`${serverUrl}/api/${userID}/leads/${leadID}`, leadFormData, config)
              .then(res => {
                  setIsAddOrEditSuccess(true);
                  setLeadFormData(emptyLeadFormData);
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
        const emptyInputFields = Object.values(leadFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "leadFormErrors" contains error value
        const errorsInTheForm = Object.values(leadFormErrors).filter(val => val !== "").length;

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
    }, [leadFormData, leadFormErrors]);


    // Function for handling the input field changes
    const handleLeadFormChange = (e) => {
        setLeadFormData({...leadFormData, [e.target.name] : e.target.value});


        // Validating  leadEmail field
        if(e.target.name === "leadEmail"){
            if(validator.isEmail(e.target.value.trim())){
                setLeadFormErrors({...leadFormErrors, "leadEmailError" : ""});
            }else{
                setLeadFormErrors({...leadFormErrors, "leadEmailError" : "Enter a valid email id"});
            }
        }

        // Validating leadName field
        if(e.target.name === "leadName"){
            if(validator.isLength(e.target.value.trim(), {"min" : 3}) && ! validator.isEmpty(e.target.value)){
                setLeadFormErrors({...leadFormErrors, "leadNameError" : "" });
            }else{
                setLeadFormErrors({...leadFormErrors, "leadNameError" : "Should contain atleast 3 characters"});
            }
        }

        // Validating lastAddress field
        if(e.target.name === "leadAddress"){
            if( ! validator.isEmpty(e.target.value )){
                setLeadFormErrors({...leadFormErrors, "leadAddressError" : "" });
            }else{
                setLeadFormErrors({...leadFormErrors, "leadAddressError" : "Lead address is required"});
            }
        }

        // Validating addedBy field
        if(e.target.name === "addedBy"){
            if( ! validator.isEmpty(e.target.value)){
                setLeadFormErrors({...leadFormErrors, "addedByError" : ""});
            }else{
                setLeadFormErrors({...leadFormErrors, "addedByError" : "Added by is required"});
            }
        }

        // Validating addedDate field
        if(e.target.name === "addedDate"){
          if( ! validator.isEmpty(e.target.value)){
              setLeadFormErrors({...leadFormErrors, "addedDateError" : ""});
          }else{
              setLeadFormErrors({...leadFormErrors, "addedDateError" : "Added date is required"});
          }
      }


        // Validating leadStatus field
        if(e.target.name === "leadStatus"){
            if(validator.isEmpty(e.target.value)){
                setLeadFormErrors({...leadFormErrors, "leadStatusError" : "Lead status is required"});
            }else{
                setLeadFormErrors({...leadFormErrors, "leadStatusError" : "" });
            }
        }

    }

    //  Function for handling the onClick event of submit button (form submission)
    const handleSubmitLeadForm = (e) => {
        e.preventDefault();
        if(leadID){
          updateLeadFun(leadFormData);

        }else{
          addNewLeadFun(leadFormData);
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
                // Then showing the lead form
                  
                  <Card style={{width: '18rem'}}>
                    <span>After submitting the form kindly wait for some time it may take some time to process</span>
                      <CardBody>
                                                                          
                          <Label>Lead name</Label><span>*</span>
                          <Input type='text' placeholder='Enter lead name' name='leadName' value={leadFormData.leadName} onChange={handleLeadFormChange} />
                          <span>{leadFormErrors.leadNameError} </span>
                          <br />

                          <Label>Lead email</Label><span>*</span>
                          <Input type='text' placeholder='Enter lead email' name='leadEmail' value={leadFormData.leadEmail} onChange={handleLeadFormChange} />
                          <span>{leadFormErrors.leadEmailError} </span>
                          <br />

                          <Label>Lead address</Label><span>*</span>
                          <Input type='text' placeholder='Enter lead addresse' name='leadAddress' value={leadFormData.leadAddress} onChange={handleLeadFormChange} />
                          <span>{leadFormErrors.leadAddressError} </span>
                          <br />
                          
                          <Label>Added by</Label><span>*</span>
                          <Input type='text' placeholder='Enter added by' name='addedBy' value={leadFormData.addedBy} onChange={handleLeadFormChange} disabled={true} />
                          <span>{leadFormErrors.addedByError} </span>
                          <br />

                          <Label>Added date</Label><span>*</span>
                          <Input type='text' placeholder='Enter added date' name='addedDate' value={leadFormData.addedDate} onChange={handleLeadFormChange} disabled={true} />
                          <span>{leadFormErrors.addedDateError} </span>
                          <br />
                          
                          <Label>Lead status</Label><span>*</span>
                          <select name='leadStatus' value={leadFormData.leadStatus} onChange={handleLeadFormChange}>
                              <optgroup label='Select lead status'>
                                  <option value={""} disabled>Select lead status</option>
                                  <option value={"New"}>New</option>
                                  <option value={"Contacted"}>Contacted</option>
                                  <option value={"Qualified"}>Qualified</option>
                                  <option value={"Lost"}>Lost</option>
                                  <option value={"Cancelled"}>Cancelled</option>
                                  <option value={"Confirmed"}>Confirmed</option>
                              </optgroup>
                          </select>
                          <br />
                          <br />
                          

                          <Button className='Button-class' color='success' disabled={ ! isAllValidData } onClick={handleSubmitLeadForm}>Submit</Button>

                          {leadID ? 
                        //   If it is UPDATE operation
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userID}/viewLeads`)}>Cancel</Button>

                            : 

                            // If it is POST operation (adding new lead)
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userID}/userDashboard`)}>Cancel</Button>
                          }
                      </CardBody>
                  </Card>     
              ) : "" }  


              { isAddOrEditSuccess ? (
                  // If the form is submitted and the lead is added or updated successfully
                  <Card style={{width: '18rem'}}>
                      <CardBody>
                          <h6 className='apiCallSuccess-h6-class'>{leadID ? "Lead is updated successfully" : "Lead is added successfully"}</h6>

                          { leadID ? "" : 
                          <h6 className='apiCallSuccess-h6-class'>Email is triggered to : {emailTrigerredTo}</h6>
                          }

                          <br />
                          <br />
                          {leadID ? 
                            <Button color='primary' onClick={()=>navigate(`/${userID}/viewLeads`)}>To leads page</Button>
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
           )  
        }
            
            
    </div>
  )
}

export default AddOrEditLead;


