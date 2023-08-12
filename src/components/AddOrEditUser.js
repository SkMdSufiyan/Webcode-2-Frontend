import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Card, Input, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import CrmContext from '../contextProvider/CrmContext';


// This component displays the add or edit user page
const AddOrEditUser = () => {
    
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(CrmContext);

    const {operatorID, userID} = useParams();
    const typeOfUser = userProfile.typeOfUser;
    let pageIs = "";
    let isDisableEmailField = false;

    if(userID){
      pageIs = "Edit user page";
      isDisableEmailField = true;
    }else{
      pageIs = "Add user page";
    }

    // If the operation is updating-------> then we will load the email, firstName, lastName, typeOfUser fields data from the database
    

    let emptyUserFormData = {};
   if(userID){
        emptyUserFormData = {
            "email" : "",
            "firstName" : "",
            "lastName" : "",
            "typeOfUser" : ""
        };

   }else{
        emptyUserFormData = {
            "email" : "",
            "firstName" : "",
            "lastName" : "",
            "password" : "",
            "typeOfUser" : ""
        };
   }

    const emptyUserFormErrors = {
        "emailError" : "",
        "firstNameError" : "",
        "lastNameError" : "",
        "passwordError" : "",
        "typeOfUserError" : ""
    }



    // Initializing the states
    const [userFormData, setUserFormData] = useState(emptyUserFormData);
    const [userFormErrors, setUserFormErrors] = useState(emptyUserFormErrors);

    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(false);

    // "isAddOrEditSuccess" will be true if the user registration is successfull
    const [isAddOrEditSuccess, setIsAddOrEditSuccess] = useState(false);
  

// The "getUserByID" function is for populating the "userFormData" with the data of the user when it is UPDATE operation
    const getUserByID = async () => {
      try{
          await axios.get(`${serverUrl}/api/${operatorID}/users/${userID}`, config)
          .then(res => {
            const userDat = res.data.data;
            setUserFormData({...userFormData, "email" : userDat.email, "firstName" : userDat.firstName, "lastName" : userDat.lastName, "typeOfUser" : userDat.typeOfUser});

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

      if(userID){
        // If this is UPDATE operation, calling the "getUserByID" function to populate the userFormData
        getUserByID(); 
      }

      // eslint-disable-next-line
    }, []);



    // Function for making a post request to add a new user
    const addNewUserFun = async (userFormData) => {
        try{
            await axios.post(`${serverUrl}/api/${operatorID}/users`, userFormData, config)
                .then(res => {
                    setIsAddOrEditSuccess(true);
                    setUserFormData(emptyUserFormData);
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


    // Function for making a PUT call to update an user
    const updateUserFun = async (userFormData) => {
      try{
          await axios.put(`${serverUrl}/api/${operatorID}/users/${userID}`, userFormData, config)
              .then(res => {
                  setIsAddOrEditSuccess(true);
                  setUserFormData(emptyUserFormData);
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
        const emptyInputFields = Object.values(userFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "userFormErrors" contains error value
        const errorsInTheForm = Object.values(userFormErrors).filter(val => val !== "").length;

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
    }, [userFormData, userFormErrors]);


    // Function for handling the input field changes
    const handleUserFormChange = (e) => {
        setUserFormData({...userFormData, [e.target.name] : e.target.value});


        // Validating email field
        if(e.target.name === "email"){
            if(validator.isEmail(e.target.value.trim())){
                setUserFormErrors({...userFormErrors, "emailError" : ""});
            }else{
                setUserFormErrors({...userFormErrors, "emailError" : "Enter a valid email id"});
            }
        }

        // Validating firstName field
        if(e.target.name === "firstName"){
            if(validator.isLength(e.target.value.trim(), {"min" : 3}) && ! validator.isEmpty(e.target.value)){
                setUserFormErrors({...userFormErrors, "firstNameError" : "" });
            }else{
                setUserFormErrors({...userFormErrors, "firstNameError" : "Should contain atleast 3 characters"});
            }
        }

        // Validating lastName field
        if(e.target.name === "lastName"){
            if( ! validator.isEmpty(e.target.value )){
                setUserFormErrors({...userFormErrors, "lastNameError" : "" });
            }else{
                setUserFormErrors({...userFormErrors, "lastNameError" : "Last name is required"});
            }
        }

        if( ! userID ){
            // Validating password field (only when adding new user)
            if(e.target.name === "password"){
                if(validator.isLength(e.target.value.trim(), {"min" : 8}) && ! validator.isEmpty(e.target.value)){
                    setUserFormErrors({...userFormErrors, "passwordError" : ""});
                }else{
                    setUserFormErrors({...userFormErrors, "passwordError" : "Should contain minimum 8 characters"});
                }
            }
        }

        // Validating typeOfUser field
        if(e.target.name === "typeOfUser"){
            if(validator.isEmpty(e.target.value)){
                setUserFormErrors({...userFormErrors, "typeOfUserError" : "Type of user is required"});
            }else{
                setUserFormErrors({...userFormErrors, "typeOfUserError" : "" });
            }
        }

    }

    //  Function for handling the onClick event of submit button (form submission)
    const handleSubmitUserForm = (e) => {
        e.preventDefault();
        if(userID){
          updateUserFun(userFormData);

        }else{
          addNewUserFun(userFormData);
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
        

        {typeOfUser === "Admin" || typeOfUser === "Manager" ? (
          <div>
              { ! isAddOrEditSuccess ? (
                // When the page is just loaded, and the data is not submitted yet
                // Then showing the user form
                  
                  <Card style={{width: '18rem'}}>
                    <span>After submitting the form kindly wait for some time it may take some time to process</span>
                      <CardBody>
                                                                  
                          
                          <Label>Username (email)</Label><span>*</span>
                          <Input type='text' placeholder='Enter email' name='email' value={userFormData.email} onChange={handleUserFormChange} disabled={ isDisableEmailField } />
                          <span>{userFormErrors.emailError} </span>
                          <br />

                          <Label>First name</Label><span>*</span>
                          <Input type='text' placeholder='Enter first name' name='firstName' value={userFormData.firstName} onChange={handleUserFormChange} />
                          <span>{userFormErrors.firstNameError} </span>
                          <br />

                          <Label>Last name</Label><span>*</span>
                          <Input type='text' placeholder='Enter last name' name='lastName' value={userFormData.lastName} onChange={handleUserFormChange} />
                          <span>{userFormErrors.lastNameError} </span>
                          <br />
                          
                          {userID ? (
                            //   If it is UPDATE operation
                            ""
                          ) : (
                            // If it is POST operation (adding new user)
                            <div>
                                <Label>Password</Label><span>*</span>
                                <Input type='password' placeholder='Enter password' name='password' value={userFormData.password} onChange={handleUserFormChange} />
                                <span>{userFormErrors.passwordError} </span>
                                <br />
                            </div>
                          )}
                          
                          <Label>Type of user</Label><span>*</span>
                          <select name='typeOfUser' value={userFormData.typeOfUser} onChange={handleUserFormChange}>
                              <optgroup label='Select user type'>
                                  <option value={""} disabled>Select user type</option>
                                  <option value={"Admin"}>Admin</option>
                                  <option value={"Manager"}>Manager</option>
                                  <option value={"Employee with rights"}>Employee with rights</option>
                                  <option value={"Employee without rights"}>Employee without rights</option>
                              </optgroup>
                          </select>
                          <br />
                          <br />

                          <Button className='Button-class' color='success' disabled={ ! isAllValidData } onClick={handleSubmitUserForm}>Submit</Button>
                          {userID ? 
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${operatorID}/viewUsers`)}>Cancel</Button>
                            :
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${operatorID}/userDashboard`)}>Cancel</Button>
                        }
                      </CardBody>
                  </Card>     
              ) : "" }  


              { isAddOrEditSuccess ? (
                  // If the form is submitted and the user is added or updated successfully
                  <Card style={{width: '18rem'}}>
                      <CardBody>
                          <h6 className='apiCallSuccess-h6-class'>{userID ? "User is updated successfully" : "User is added and activated successfully"}</h6>
                          <br />
                          <br />
                          {userID ? 
                            <Button color='primary' onClick={()=>navigate(`/${operatorID}/viewUsers`)}>To users page</Button>
                            : 
                            <Button color='primary' onClick={()=>navigate(`/${operatorID}/userDashboard`)}>To dashboard</Button>
                          }
                      </CardBody>
                  </Card>
              ) : "" }
                  
          </div>
        ) : (
            <div>
                <h6 style={{color : "red"}}>Access Denied !!! Only Admin or Manager can add user, and only Admin can edit user !!!</h6>
                  <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
                </div>
           )  
        }
            
            
    </div>
  )
}


export default AddOrEditUser;








