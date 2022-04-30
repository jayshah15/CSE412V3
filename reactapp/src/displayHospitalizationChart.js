import React, { useEffect, useRef,useState, Component } from 'react';
import * as d3 from 'd3';
import './dispHospitalizationChart.css';
import AsyncSelect from 'react-select/async';
import  {datas} from './uniqueHospData';
import {nest, filter, transition } from 'd3';


const LineChart = () => {

    const d3chart = useRef()
    let [countries, setCountries] = useState("⬇️ Select a country ⬇️")
    let [fullData,setFullData] = useState();
    let handleCountryChange = (e) => {
        setCountries(e.target.value)
    }

    const parseDate = d3.timeParse("%Y-%m-%d")
    useEffect(() => {

        fetch("/hospitalization", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(
            response => response.json()
        ).then(

            data => {

                setFullData(data);
                //fullData = getUnique(fullData,'entity');
                const entities = data.filter(entity => {
                    return (entity.entity === countries  && entity.indicator === 'Daily ICU occupancy per million') 
                })
                //console.log(entities);
                const dates = [...new Set(entities.map(each => [each.date.slice(0, 10), each.value]))]
                 //console.log(dates);

                let CountsByDate = []
                dates.map(time => {

                    let date = time[0]
                    let value = time[1]

                    const counts = { date: parseDate(date), value:value}
                    CountsByDate.push(counts);
                })
                //console.log(CountsByDate);
                d3.selectAll("svg > *").remove();

                const margin = {top : 50, right : 30, bottom : 30, left : 30}
                const width = parseInt(d3.select('#d3Vis').style('width')) - margin.left - margin.right
                const height = parseInt(d3.select('#d3Vis').style('height')) - margin.top - margin.bottom

                //set up chart

                const svg = d3.select(d3chart.current)
                                .attr('width', width + margin.left + margin.right )
                                .attr('height', height + margin.top + margin.bottom)
                                .style('background-color', '#7970ba')
                                .append('g')                                                
                                    .attr('transform', 'translate('+ margin.left + ','+ margin.top+')');


                const x = d3.scaleTime()                
                                .domain(d3.extent(CountsByDate, function(d){return d.date}))
                                .range([0,width])

                svg.append('g')
                    .attr('transform', 'translate(0, '+ height +')')
                    .call(d3.axisBottom(x))

                const max = d3.max(CountsByDate, function(d){return d.value})
        
                const y = d3.scaleLinear()
                                .domain([0,max])
                                .range([height, 0])
                svg.append('g')
                    .call(d3.axisLeft(y))

                svg.append('path')
                    .datum(CountsByDate)
                    .attr('fill','none')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 3)
                    .attr('d', d3.line()
                                    .x(function(d) {return x(d.date)})
                                    .y(function(d) {return y(d.value)})

                    )

                svg.append('text') 
                    .attr('x', (width/2))
                    .attr('y', (margin.top/5)-30)
                    .attr('text-anchor','middle')
                    .attr('font-size', '20px')
                    .attr('stroke', '#abede3')
                    .text('Daily ICU Occupancy Per Million For COVID-19 from 2020')
            })
    },[countries])
        return (
        <><div id="dropDownDiv">
        <h3>This visualization shows Daily ICU Occupancy per million for COVID-19 from 2020. <br></br>
            It shows data for 47 different countries. Select a country from the dropdown to view
            the line chart overtime for that particular country.
            </h3>
        <label>Select a country : </label>
        <select onChange={handleCountryChange}> 
        {/* Creating the default / starting option for our 
          dropdown.
         */}
      <option value="⬇️ Select a Country ⬇️"> -- Select a Country -- </option>
      {/* <option value="Algeria"> Algeria </option> */}
        
          { datas?.map((data) => <option value={data.entity}>{data.entity}</option>) }

        </select>

            </div>
            <div id="d3Vis">
                    <svg ref={d3chart}></svg>
                </div></>
        )

}

//get unique data from the object array.
function getUnique(arr, comp) {

                      // store the comparison  values in array
   const unique =  arr?.map(e => e[comp])

                  // store the indexes of the unique objects
                  .map((e, i, final) => final.indexOf(e) === i && i)

                  // eliminate the false indexes & return unique objects
                 .filter((e) => arr[e]).map(e => arr[e]);

   return unique;
}
// class displayData extends Component {

// constructor(props) {
//         super(props);

//         this.state = {
//             items: null,
//             DataisLoaded: false
//         };
//     }

//    componentDidMount() { 


//     fetch("/hospitalization", {
//       headers : { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//        }

//     }).then(
//       response => response.json()
//   ).then (

//   json=> {

//     this.setState({
//         DataisLoaded : true,
//         items : json,
//     })
//   }

//   )  
//     }

//     render() {

//     var {items, DataisLoaded} = this.state;
//         if (!DataisLoaded) return <div>
//             <h1> Pleses wait some time.... </h1> </div> ;
//         return (

//             <div>
//             <h1>Hello There</h1>
//                 {items.map((item, index) =>(
//                 <h1 key={index}>{item.entity}</h1>
//         )
//       ) }
//             </div>

//         )
//     }

// }

export default LineChart;