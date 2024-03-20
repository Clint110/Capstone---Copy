import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {

    const navigate = useNavigate();

    
    const handleLogoutButtonClick = () => {
        navigate('/'); 
      };

      const handlebackButtonClick = () => {
        navigate('/dashboard'); 
      };


      // const handleLogoutButtonClick = async () => {
      //   try {
      //     // Add your server logout route here
      //     await axios.post('/logout'); // Assuming your server handles the logout logic
    
      //     // After successful logout, navigate to the home page
      //     navigate('/');
      //   } catch (error) {
      //     console.error('Logout failed:', error);
      //     // Handle logout failure, if needed
      //   }
      // };
      

  return (
    
    <div>
        <div className="logouts">
            <br></br>
            <div className="container-Logout">
                {/* <span class="close" id="closeModal">&times;</span> */}
                <h3><strong>Log Out</strong></h3>
                <hr></hr>
                <p>Are you sure you want to logout?</p>
                <hr></hr>
                <button id="cancelButton" className="red-button"  onClick={handleLogoutButtonClick} >Log Out</button> &nbsp;
                <button id="logoutConfirmButton"  className="white-button" onClick={handlebackButtonClick}>Cancel</button> 
            </div><br></br>
            </div>
            </div>
        
       
    
  )
}

export default Logout