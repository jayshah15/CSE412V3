import React, {useEffect, useState, Component} from 'react'
import DispData from './displayLocationChart'
import DispManufacturer from './displayManufacturerChart'
import DispAgeGroup from './displayAgeGroupChart'
import DispHospitalizationChart from './displayHospitalizationChart'
import DispMultipleChart from './displayMultipleLineChart'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


//import axios from 'axios'

export default function App() {

  const [active, setActive] = useState("");
  return (

    
      
    <div className='App'>
      <div class="card text-center">
  <h3 class="card-header">
    CSE412 Project
  </h3>
  <div class="card-body">
    <h5 class="card-title">Visualizing COVID-19 Data using PERN stack.</h5>
    <p class="card-text">Three different graphs with different datas visualized using postgresql database</p>
 <nav>
        <button className="btn-primary"  onClick={() => setActive("hospChart")}>Show Chart One</button>{' '}
        <button className="btn-primary"  onClick={() => setActive("ageChart")}>Show Chart Two</button>{' '}
        <button className="btn-primary"  onClick={() => setActive("manChart")}>Show Chart Three</button>{' '}
        <button className="btn-primary"  onClick={() => setActive("multipleChart")}>Show Chart Four</button>{' '}

      </nav>  </div>
  <div class="card-footer text-muted">
    Team : Jay Shah, Ethan Buranday, Shawn Mian, Hamdan Almehrzi
  </div>
</div>
     

      <div>
        {active==="hospChart" && <DispHospitalizationChart/>}
        {active==="ageChart" && <DispAgeGroup/>}
        {active==="manChart" && <DispManufacturer/>}
        {active==="multipleChart" && <DispMultipleChart/>}


      </div>
    {/* <DispHospitalizationChart/> */}
    {/* <DispAgeGroup/> */}
  </div>
  )
  
}

