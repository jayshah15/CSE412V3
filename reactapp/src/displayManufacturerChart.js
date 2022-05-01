import React, { useEffect, useRef, useState, Component } from 'react';
import * as d3 from 'd3';
import './manufacturerChartStyle.css';
import { filter, transition } from 'd3';

const PieChart = () => {

    const d3chart = useRef()

    useEffect(() => {

        fetch("/manufacturer", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(
            response => response.json()
        ).then(

            data => {
                //console.log(data);
                d3.selectAll("svg > *").remove();
                
                const margin = {top : 50, right : 30, bottom : 30, left : 30}
                const width = parseInt(d3.select('#d3Vis').style('width')) - margin.left - margin.right
                const height = parseInt(d3.select('#d3Vis').style('height')) - margin.top - margin.bottom


                 var svg = d3.select(d3chart.current)
                            .attr("width",width)
                            .attr("height", height)
                            .style("background-color",'#d4edff')

                // var filterData = d3.pie().sort(null).value(function(d){return d.value})(tempData);
                const radius = 200;

                var g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var colors = d3.scaleOrdinal()
                                .domain(data)
                                .range(d3.schemeDark2)  
                                    
               

                var pie = d3.pie().value(function(d) { 
                    return d.sum; 
                });
    
            var arc = g.selectAll("arc")
                       .data(pie(data))
                       .enter();

                       var path = d3.arc()
                       .outerRadius(radius)
                       .innerRadius(0);
  
          arc.append("path")
             .attr("d", path)
             .attr("fill", function(d) { return colors(d.data.vaccine); });


             var legendG = svg.selectAll(".legend")
             .data(pie(data))
             .enter().append("g")
             .attr("transform", function(d,i){
               return "translate(" + (width - 150) + "," + (i * 20) + ")";
             })
             .attr("class", "legend");   
           
           legendG.append("rect")
             .attr("width", 10)
             .attr("height", 10)
             .style("fill", function(d, i) {
               return colors(i);
             });
           
           legendG.append("text")
             .text(function(d){
               return d.data.vaccine+ "(" +d.data.sum + ")";
             })
             .style("font-size", 12)
             .attr("y", 10)
             .attr("x", 11);
    //          var legend = svg.selectAll("g")
    //                         .data(data)
    //                         .enter()
    //                         .append("g")
    //                         .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")";})
  

    //      legend.append("rect")
    //          .attr("width", 18)
    //          .attr("height", 18)
    //          .style("fill", function(d, i) {
    //      return colors(d.sum);
    //    });
       
    //      legend.append("text")
    //          .attr("x", 24)
    //          .attr("y", 9)
    //          .attr("dy", ".35em")
    //          .text(function(d) { return d.vaccine; });


             g.append('text') 
             .attr('x', (width/30))
             .attr('y', (-margin.top*5))
             .attr('text-anchor','middle')
             .attr('font-size', '20px')
             .attr('stroke', 'blue')
             .text('pie chart for total vaccinations by different vaccine providers.')
             
     
            })

    }, [])
    return (
        <><div id="dropDownDiv">
  <h3>This visualization shows pie chart for different vaccines providers and how many people<br></br>
           have been vaccinated from their vaccine (From 2020).
            </h3>
        </div>
            <div id="d3Vis">
                <svg id = "svgId" ref={d3chart}></svg>
            </div></>
    )

}

//get unique data from the object array.
// function getUnique(arr, comp) {

//                       // store the comparison  values in array
//    const unique =  arr?.map(e => e[comp])

//                   // store the indexes of the unique objects
//                   .map((e, i, final) => final.indexOf(e) === i && i)

//                   // eliminate the false indexes & return unique objects
//                  .filter((e) => arr[e]).map(e => arr[e]);

//    return unique;
// }

function getAgeGroupData(arr) {


    var holder = {};

    arr.forEach(function (d) {
        if (holder.hasOwnProperty(d.age_group)) {
            holder[d.age_group] = holder[d.age_group] + d.people_fully_vaccinated_per_hundred;
        } else {
            holder[d.age_group] = d.people_fully_vaccinated_per_hundred;
        }
    });

    var obj2 = [];

    for (var prop in holder) {
        obj2.push({ name: prop, value: holder[prop] });
    }
    return obj2;
}


export default PieChart;