// import Sidebar from '../Sidebar'
import React, { useState } from 'react';
import { GoScreenFull } from "react-icons/go";
import Reminder from '../../layout/Remindercopy';
import Map from '../../layout/Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';


function DashboardMain() {
  const [show, setShow] = useState(false);

  const [containerVisible, setContainerVisible] = useState(true);

  const toggleContainer = () => {
    setContainerVisible(!containerVisible);
  };


  return (
    <>
    <div className="header-wrapper">
<div className='header-container'>   
<h4><strong>DASHBOARD</strong> 	</h4>   <span className="userName"><span className="userName-text">Administrator</span>   <FontAwesomeIcon icon={faCircleUser} className="icon-circle" /></span>

	
</div></div>
    <div className='Dashboard-container'>
    <section class="spacethis">
				<div class="row">
        {/* <div >
      <Reminder/>
      </div> */}
					<div className= "container-9 text-success text-center ">
          <Reminder/>
          <Map/>
        </div>
</div>
</section>

</div>



  {/* </div>
  */}

</>
  )
}


  
export default DashboardMain