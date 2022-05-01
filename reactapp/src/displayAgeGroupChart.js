import React, { useEffect, useRef, useState, Component } from 'react';
import * as d3 from 'd3';
import './ageGroupChartStyle.css';
import { filter, transition } from 'd3';

const PieChart = () => {

    const d3chart = useRef()

    useEffect(() => {

        fetch("/agegroup", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(
            response => response.json()
        ).then(

            data => {
                data = getAgeGroupData(data);
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
                    return d.value; 
                });
    
            var arc = g.selectAll("arc")
                       .data(pie(data))
                       .enter();

                       var path = d3.arc()
                       .outerRadius(radius)
                       .innerRadius(0);
  
          arc.append("path")
             .attr("d", path)
             .attr("fill", function(d) { return colors(d.data.name); });

             var legend = svg.selectAll("g")
                            .data(data)
                            .enter()
                            .append("g")
                            .attr("transform", function(d, i) { 
                                var c = 2;   // number of columns
                                var h = 20;  // height of each entry
                                var w = 150; // width of each entry (so you can position the next column)
                                var tx = 10; // tx/ty are essentially margin values
                                var ty = 10;
                                var x = i % c * w + tx;
                                var y = Math.floor(i / c) * h + ty;
                                return "translate(" + x + "," + y + ")";
                             })
  

            //  var legend = svg.append("g")
            //                 .attr("transform", "translate(" + width / 8 + "," + height / 100 + ")")
            //                 .attr("class", "legend")
            //                 .selectAll("g")
            //                 .data(data)//setting the data as we know there are only two set of data[programmar/tester] as per the nest function you have written
            //                 .enter().append("g")
            //                 .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
                    
         legend.append("rect")
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", function(d, i) {
         return colors(d.value);
       });
       
         legend.append("text")
             .attr("x", 24)
             .attr("y", 9)
             .attr("dy", ".35em")
             .text(function(d) { return d.name; });


             g.append('text') 
             .attr('x', (width/30))
             .attr('y', (-margin.top*5))
             .attr('text-anchor','middle')
             .attr('font-size', '20px')
             .attr('stroke', 'blue')
             .text('pie chart for different age group who are fully vaccinated per hundred')
             
            //         var legends =  svg.append("g").attr("transform", "translate(" + width / 4 + "," + height / 4 + ")")
            //                     .selectAll(".legends").data(data);
            // var legend = legends.enter().append("g").classed("legends", true).attr("transform", 
            // function(d,i){return "translate(0," + (i+1)*30 + ")";});
            // legend.append("rect").attr("width", 20).attr("height",20).attr("fill", 
            // function(d) {return colors(d.data.value);});
            // legend.append("text").text(function (d) {return d.data.name;})
            //         .attr("fill", function(d) {return colors(d.data.value);})
            //         .attr("x", 20)
            //         .attr("y",30);

            // var filterData = d3.pie().sort(null).value(function(d){return d.value;})(tempData);
            //     console.log(filterData);
            //     var segments = d3.arc()
            //                         .innerRadius(0)
            //                         .outerRadius(200)
            //                         .padAngle(.05)
            //                         .padRadius(50);


            //     var sections = svg.append('g')
            //                         .attr('transform','translate(250,250)')
            //                         .selectAll("path").data(filterData); 
            //     sections.enter().append("path").attr("d",segments).attr("fill", function(d)
            //     {return colors(d.filterData.value);});

            })

    }, [])
    return (
        <><div id="dropDownDiv">
  <h3>This visualization shows a pie chart of  people fully vaccinated per hundred.<br></br>
            It shows data for 41 different age groups from 2020-2022.
            </h3>
        </div>
            <div id="d3Vis">
                <svg ref={d3chart}></svg>
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