import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Input, Navbar, Nav, NavItem, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import CrmContext from '../contextProvider/CrmContext';

const UserDashboard = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config, setUserProfile} = useContext(CrmContext);

    const typeOfUser = userProfile.typeOfUser;

    // Intialising the states
    const [viewProfile, setViewProfile] = useState(false); // Related to "View your profile" button
    const [isEditProfile, setIsEditProfile] = useState(false); // Related to "Edit" button in profile


    // When the component is mounted
    useEffect(() => {
        if( ! accessToken){
            // If there is no accessToken, then navigating to login page
            navigate('/login');
        }

        // eslint-disable-next-line
    }, [] );



    const emptyProfileFormErrors = {
        "firstNameError" : "",
        "lastNameError" : ""
    }

    const initialProfileFormData = {
        "email" : userProfile.email,
        "firstName" : userProfile.firstName,
        "lastName" : userProfile.lastName,
        "_id" : userProfile._id,
        "typeOfUser" : userProfile.typeOfUser
    };

    const [profileFormData, setProfileFormData] = useState(initialProfileFormData);
    const [profileFormErrors, setProfileFormErrors] = useState(emptyProfileFormErrors);
    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(true);


    // "getSelfProfile" function to get and store the updated userProfile, when it is updated
    // This function will be called inside "updateUserProfileFun"
    const getSelfProfile = async (id) => {
        try{
            await axios.get(`${serverUrl}/api/${id}/users/getSelfProfile/${id}`, config)
            .then(res => {
              const userDat = {...res.data.data};
            //   Deleting the "hashedPassword" from the user data
              delete userDat.hashedPassword;
            //   Storing the "userDat" in the localStorage as new "userProfile"
              localStorage.setItem('userProfile', JSON.stringify(userDat));
              setUserProfile(userDat);

              setApiCallError("");
            })
            .catch(err => {
              setApiCallError(err.response.data.message);
            })
        }catch(error){
          setApiCallError(error.message);
        }
      } 



    const updateUserProfileFun = async (profileFormData) => {
        try{       
            const id = profileFormData._id;
            // For removing the _id from the "profileFormData", taking a copy of that and deleting the _id
            const newProfile = {...profileFormData};
            delete newProfile._id;

            await axios.put(`${serverUrl}/api/${id}/users/updateProfile/${id}`, newProfile, config)
                .then(res => { 
                    getSelfProfile(id);
                    
                    setIsEditProfile(false);
                    setApiCallError("");
                })
                .catch(err => {
                    setApiCallError(err.response.data.message);
                    setIsEditProfile(true);
                })
        }catch(error){
            setApiCallError(error.message);
        }

    }


    // Function for handling the state of "isAllValidData"
    const declareAllValidDataFunction = () => {
        // Checking whether any of the mandatory input fields is empty (not filled)
        const emptyInputFields = Object.values(profileFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "profileFormErrors" contains error value
        const errorsInTheForm = Object.values(profileFormErrors).filter(val => val !== "").length;

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
    }, [profileFormData, profileFormErrors]);



    const handleUpdateProfileChange = (e) => {
        setProfileFormData({...profileFormData, [e.target.name] : e.target.value.trim()});


        // Validating firstName field
        if(e.target.name === "firstName"){
            if(validator.isLength(e.target.value.trim(), {"min" : 3}) && ! validator.isEmpty(e.target.value)){
                setProfileFormErrors({...profileFormErrors, "firstNameError" : "" });
            }else{
                setProfileFormErrors({...profileFormErrors, "firstNameError" : "Should contain atleast 3 characters"});
            }
        }

        // Validating lastName field
        if(e.target.name === "lastName"){
            if( ! validator.isEmpty(e.target.value )){
                setProfileFormErrors({...profileFormErrors, "lastNameError" : "" });
            }else{
                setProfileFormErrors({...profileFormErrors, "lastNameError" : "Last name is required"});
            }
        }

    }

     //  Function for handling the onClick event of submit button (form submission)
     const handleSubmitProfileForm = (e) => {
        e.preventDefault();
        updateUserProfileFun(profileFormData);
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



        <p className='blue-color-p-class'>User dashboard</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>


        <div className='dashboard-button-div'>
            <Button className='dashboard-Button-class' color='info' onClick={()=>setViewProfile(true)}>View Your Profile</Button>
            <Table responsive striped>
                <tbody>
                    {typeOfUser === "Admin" || typeOfUser === "Manager" ?(
                        <tr>
                            <td><Button className='dashboard-Button-class' color='primary' onClick={()=>navigate(`/${userProfile._id}/viewUsers`)}>View Users</Button></td>
                            <td><Button className='dashboard-Button-class' color='success' onClick={()=>navigate(`/${userProfile._id}/addOrEditUser`)}>Add User</Button></td>
                        </tr>
                    ) : "" }
                    

                    {typeOfUser === "Admin" || typeOfUser === "Manager" || typeOfUser === "Employee with rights" ? (
                        <tr>
                            <td><Button className='dashboard-Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/addOrEditLead`)}>Add Lead</Button></td>
                            <td><Button className='dashboard-Button-class' color='success' onClick={()=>navigate(`/${userProfile._id}/addOrEditServiceRequest`)}>Add Service Request</Button></td>
                        </tr>
                    ) : "" }

                    <tr>
                    <td><Button className='dashboard-Button-class' color='info' onClick={()=>navigate(`/${userProfile._id}/viewLeads`)}>View Leads</Button></td>
                    <td><Button className='dashboard-Button-class' color='secondary' onClick={()=>navigate(`/${userProfile._id}/viewServiceRequests`)}>View Service Requests</Button></td>
                    </tr>


                </tbody>
            </Table>

        </div>



            {viewProfile ? (
                // If the user clicked the "View yout profile" button
                // Showing the user profile
                <div className='profile-div'>
                    {/* Showing the "apiCallError", if any error occurs */}
                    <h6 className='apiCallError-h6-class'>{apiCallError}</h6>
                    {/* <span>If you edit the profile please refresh the page once</span> */}
                    <br />
                <Label>Email</Label>
                <Input name='email' type='text' value={profileFormData.email} disabled={ true } onChange={handleUpdateProfileChange} />
                <br />
                <Label>First name</Label>
                <Input type='text' name='firstName' value={profileFormData.firstName} disabled={! isEditProfile} onChange={handleUpdateProfileChange} />
                <span>{profileFormErrors.firstNameError} </span>
                <br />
                <Label>Last name</Label>
                <Input type='text' name='lastName' value={profileFormData.lastName} disabled={! isEditProfile} onChange={handleUpdateProfileChange} />
                <span>{profileFormErrors.lastNameError} </span>
                <br />
                <Label>Id</Label>
                <Input type='text' name='_id' value={profileFormData._id} disabled={true} onChange={handleUpdateProfileChange} />
                <br />
                <Label>Type of user</Label>
                <Input type='text' name='typeOfUser' value={profileFormData.typeOfUser} disabled={true} onChange={handleUpdateProfileChange} />
                <br />

                {isEditProfile ? (
                    <div>
                        <Button className='dashboard-Button-class' color='success' onClick={handleSubmitProfileForm} disabled={! isAllValidData}>Update</Button>
                        <Button className='dashboard-Button-class' color='warning' onClick={()=>{setProfileFormData(initialProfileFormData);setIsEditProfile(false)}}>Cancel</Button>
                    </div>


                ) : (
                    <div>
                        <Button className='dashboard-Button-class' color='info' onClick={()=>setViewProfile(false)}>Close</Button>
                        <Button className='dashboard-Button-class' color='warning' onClick={()=>setIsEditProfile(true)}>Edit</Button>
                    </div>
                )}
                </div>

            ) : "" }


      
      </div>
  )
}

export default UserDashboard;


