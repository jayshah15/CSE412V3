import React, {useEffect, useState, Component} from 'react'
import DispData from './displayLocationChart'
import DispAgeGroup from './displayAgeGroupChart'
import DispHospitalizationChart from './displayHospitalizationChart'


//import axios from 'axios'

class App extends Component {

  render() {
  return (
    <div>
    <DispHospitalizationChart></DispHospitalizationChart>
    <DispAgeGroup/>
  </div>
  )
  }
}

export default App