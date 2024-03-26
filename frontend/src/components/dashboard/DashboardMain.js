// import Sidebar from '../Sidebar'
import React, { useState } from 'react';
import { GoScreenFull } from "react-icons/go";
import Reminder from '../../layout/Reminder';
import Map from '../../layout/Map';



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
<h3><strong>DASHBOARD</strong>    <p className="userName">Administrator</p>
	</h3>
</div></div>
    <div className='Dashboard-container'>
    <section class="spacethis">
				<div class="row">
        {/* <div >
      <Reminder/>
      </div> */}
					<div className= "container-9 text-success text-center p-2 border border-success fw-bolder alert-success">
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