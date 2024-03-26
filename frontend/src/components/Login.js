

import React , {useState} from 'react'
import loginImage from '../images/login.png'
import logo from '../images/buksu-logo.png'
import { GoogleLogin,  useGoogleLogin } from '@react-oauth/google';
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";



function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)

      if (data.success) {
        console.log("Login successful", data.user);
        // Add logic to handle successful login (e.g., redirect to dashboard)
        console.log(data.user.role)

          // Check the role and redirect accordingly
      if (data.user.role === "admin") {
        // Redirect to the admin dashboard
        navigate("/dashboard");
      } else if (data.user.role === "addbooker") {
        // Redirect to the addbook page
        console.log("Redirecting to:", "/addbook");
        navigate("/addbook");
      } else {
        // Redirect to the regular dashboard for other roles
        navigate("/dashboard");
      }
      
      } else if (data.message == "Incorrect password"){
        console.error("Login failed", data.message);
        alert("Incorrect password")
        // Add logic to handle login failure (e.g., show error message)
      }else if(data.message == "User not found" ){
        alert("User not found")
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };



  const handleGoogleLoginSuccess = async (tokenResponse) => {
    console.log('Google login successful', tokenResponse);
  
    try {
      const decodedToken = JSON.parse(atob(tokenResponse.credential.split('.')[1]));
      const email = decodedToken.email;
  
  
      // Now you can use the email in your request
      const response = await fetch('http://localhost:3000/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (data.success) {
        console.log('Google login successful', data.user);
        // Add logic to handle successful Google login (e.g., redirect to dashboard)
        navigate('/dashboard');
      } else if (data.message === 'Google user not found') {
        alert('Google user not found');
      } else {
        console.error('Google login failed', data.message);
        alert('Google login unsuccessful');
        // Add logic to handle Google login failure (e.g., show error message)
      }
    } catch (error) {
      console.error('Error during Google login', error);
    }
  };
  
  return (
    <div className='LOGIN'>
     <img className="logo mb-5" src={logo} alt="logo"/>

    <div className="container d-flex justify-content-center align-items-center min-vh-100">
          {/*--------------------- Login Container ------------------------*/}
          <div className="row rounded-5  bg-white shadow box-area">
            {/*------------------------- Left Box ---------------------------*/}
            <div className="col-md-6 border rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{background: 'linear-gradient(90deg, rgba(169,167,208,1) 0%, rgba(21, 21, 186, 0.6) 100%)' }}>
              <div className="featured-image mb-3">
                <img src={loginImage} className="img-fluid " style={{width: '500px'}} />
              </div>
             
            </div> 
            {/*------------------ ------ Right Box --------------------------*/}
            <div className="col-md-6 right-box p-3">
              <div className="row align-items-center mt-5 pt-4">
                <div className="header-text mb-4 text-center">
                  <h2>BukSU MoniTour</h2>
                  <p>Tracking success, ensuring safety with BukSU MoniTour </p>
                </div>
            <form className='ml-4' onSubmit={handleSubmit}>
                <div className="input-group mb-3 col-10">
                <TfiEmail  className='iIcon'/>
                  <input type="text" className="EmaiL" name='email' placeholder="Email address" value={email}onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group mb-1 col-10 ">
               <RiLockPasswordLine className='iIcon'/>
                  <input type="password" className="PassworD" name='password' placeholder="Password"   value={password}onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-group ml-5 mb-5 d-flex justify-content-between">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="formCheck" />
                    <label htmlFor="formCheck" className="form-check-label text-secondary"><small>Remember Me</small></label>
                  </div>
                  {/* <div className="forgot">
                    <small><a href="#">Forgot Password?</a></small>
                  </div> */}
                </div>
                <div className="input-group  mr-5 mb-3">
                 <button type="submit"className="LoginBtn">Login </button>
                </div>
                <div className='googleArea'>
                <GoogleLogin
                className="googleLoginButton"
                onSuccess={handleGoogleLoginSuccess}
               scopes={['profile', 'email']}
              >
                Sign in with Google
              </GoogleLogin>
                  {/* <GoogleLogin  className='googleLoginButton' onClick={() => login()}>Sign in with Google </GoogleLogin> */}
                          </div>
                {/* <div className="row">
                  <small>Don't have account? <a href="#">Sign Up</a></small>
                </div> */}
                </form>
              </div>
              
            </div> 
            
          </div>
          
        </div>
        
      </div>
    
    
    
  
  )
}

export default Login