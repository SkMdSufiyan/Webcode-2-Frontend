import React, { useEffect, useState } from 'react';
import { Button, Label, Card, Input, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import validator from "validator";
import axios from "axios";

const ResetPassword = () => {
  const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
  const navigate = useNavigate();

  // Taking the resetToken from the params of the reset link
  const {resetToken} = useParams();

  const emptyUserNewCred = {
    "email" : "",
    "newPassword" : "",
    "confirmNewPassword" : ""
  };

  const emptyUserNewCredErrors = {
    "emailError" : "",
    "newPasswordError" : "",
    "confirmNewPasswordError" : ""
  };

  // Initializing the states
  const [isTokenValid, setIsTokenValid] = useState(false);
  // "apiCallError" contains any errors occured during api calls or in try-catch
  const [apiCallError, setApiCallError] = useState("");

  const [userNewCredentials, setUserNewCredentials] = useState(emptyUserNewCred);
  const [userNewCredErrors, setUserNewCredErrors] = useState(emptyUserNewCredErrors);

  // Initialising the state for disabling the submit button
  const [disableSubmit, setDisableSubmit] = useState(true);

  const [isResetPasswordSuccess, setIsResetPasswordSuccess] = useState(false);

  // Function for verifying whether the token is valid and not expired
  const resetTokenVerificationFun = async (resetToken) => {
    try{
      await axios.get(`${serverUrl}/api/verify-resetaccesstoken/${resetToken}`)
      .then(res => {
        setIsTokenValid(true);
        // Taking the email (username) of the user
        setUserNewCredentials({...userNewCredentials, "email" : res.data.data.email});
        setApiCallError("");
      })
      .catch(err => {
        setApiCallError(err.response.data.message);
        setIsTokenValid(false);
      })

    }catch(error){
      setApiCallError(error.message);
    }
  }

  // Executing the "resetTokenVerificationFun" function once when this component is mounted
  useEffect(() => {
    resetTokenVerificationFun(resetToken);
    // eslint-disable-next-line
  }, []);

// Function for making a PUT call for updating the password
  const resetPasswordFunction = async (userNewCredentials) => {
    try{
      await axios.put(`${serverUrl}/api/reset-password/${resetToken}`, userNewCredentials)
      .then(res => {
        setIsResetPasswordSuccess(true);
        setApiCallError("");
        setUserNewCredentials(emptyUserNewCred);
      })
      .catch(err => {
        setApiCallError(err.response.data.message);
        setIsResetPasswordSuccess(false);
      })

    }catch(error){
      setApiCallError(error.message);
    }
  }


  // Function for handling the state of "disableSubmit"
  const handleDisableSubmit = () => {
      // Checking whether any of the mandatory input fields is empty (not filled)
      const emptyInputFields = Object.values(userNewCredentials).filter(val => val === "").length;
      // Checking whether any of the fields of "signupFormErrors" contains error value
      const errorsInTheForm = Object.values(userNewCredErrors).filter(val => val !== "").length;

      // Changing the state of "isAllValidData"
      if( ! emptyInputFields && ! errorsInTheForm ){
          setDisableSubmit(false);  
      }else{
          setDisableSubmit(true);
      }

  }


  useEffect(() => {
    // Calling "handleDisableSubmit"
    handleDisableSubmit();
    // eslint-disable-next-line
  }, [userNewCredentials, userNewCredErrors]);


  // Function for handling the input field changes
  const handleNewCredChange = (e) => {
    setUserNewCredentials({...userNewCredentials, [e.target.name] : e.target.value.trim()});

    // Validating the new password length to be minimum 8 characters
    if(e.target.name === "newPassword"){
      if(validator.isLength(e.target.value.trim(), {"min" : 8}) && ! validator.isEmpty(e.target.value)){
        setUserNewCredErrors({...userNewCredErrors, "newPasswordError" : ""});
      }else{
        setUserNewCredErrors({...userNewCredErrors, "newPasswordError" : "Should contain atleast 8 characters"});
      }
    }

    // Validating whether the new password and confirm new password are matching or not
    if(e.target.name === "confirmNewPassword"){
      if(userNewCredentials.newPassword === e.target.value.trim()){
        setUserNewCredErrors({...userNewCredErrors, "confirmNewPasswordError" : ""});
      }else{
        setUserNewCredErrors({...userNewCredErrors, "confirmNewPasswordError" : "Password and confirm password should match"});
      }
    }

  }


  // Function for handling the onClick event of "Submit" button (form submission)
  const handleSubmitNewCred = (e) => {
    e.preventDefault();
    resetPasswordFunction(userNewCredentials);
  }


  return (
    <div className='component-main-div'>
      <Navbar  expand="md" className='Navbar-class' fixed='top'>
          <Nav className="mx-auto" navbar style={{alignItems : "center"}}>
            <NavItem>
              <h6 style={{color:"white"}}>Customer Relationship Management</h6>
            </NavItem>
          </Nav>
        </Navbar>


        <Card style={{width: '18rem'}}>
            <CardBody>
            <p className='blue-color-p-class'>Reset password</p>
            {/* Showing the "apiCallError", if any error occurs */}
            <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

            {isTokenValid && ! apiCallError && ! isResetPasswordSuccess ? (
              // If "isTokenValid" is true, "apiCallError" is false, "isResetPasswordSuccess" is false
              // i.e after verifying the reset token------the form for new password submission is shown 
              <div>
                <Label >Username (email)</Label>
                <Input type='text' name='email' value={userNewCredentials.email} disabled={true} onChange={handleNewCredChange} />
                <br />
                <Label >New password</Label>
                <Input type='password' name='newPassword' placeholder='Enter new password' value={userNewCredentials.newPassword} onChange={handleNewCredChange} />
                <span>{userNewCredErrors.newPasswordError}</span>
                <br />
                <Label>Confirm new password</Label>
                <Input type='password' placeholder='Re enter new password' name='confirmNewPassword' value={userNewCredentials.confirmNewPassword} onChange={handleNewCredChange} />
                <span>{userNewCredErrors.confirmNewPasswordError}</span>
                <br />

                <Button color='success' disabled={disableSubmit} className='Button-class' onClick={handleSubmitNewCred}>Submit</Button>

              </div>

            ) : "" }


            {isTokenValid && ! apiCallError && isResetPasswordSuccess ? (
              // If "isTokenValid" is true, "apiCallError" is false, "isResetPasswordSuccess" is true
              // i.e. when the password of the user is updated successfully
              <div>
                <h6 className='apiCallSuccess-h6-class'>Password has been updated successfully</h6>
                <br />
                <br />
                <Button color='info' className='Button-class' onClick={() => navigate('/login')}>Login</Button>
              </div>

            ) : "" }

            </CardBody>
        </Card>
        

    </div>
  )
}

export default ResetPassword;


