import React, { useEffect, useRef,useState, Component } from 'react';
import * as d3 from 'd3';
import './multipleLineStyle.css';
import { colorbrewer } from 'd3';

const LineChart = () => {

    const d3chart = useRef()
    const parseDate = d3.timeParse("%Y-%m-%d")
    useEffect(() => {

        fetch("/lineManufacturer", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(
            response => response.json()
        ).then(

            data => {
                //console.log(data);
                const dates = [...new Set(data.map(each => [each.date.slice(0, 10), each.vaccine, each.total_vaccinations]))]
                //console.log(dates);

               let CountsByDate = []
               dates.map(time => {

                   let date = time[0]
                   let vaccine = time[1]
                   let total = time[2]
                   const counts = { date: parseDate(date), vaccine:vaccine, total:total}
                   CountsByDate.push(counts);
               })

               //console.log(CountsByDate);
                d3.selectAll("svg > *").remove();

                const margin = {top : 50, right : 30, bottom : 30, left : 30}
                const width = parseInt(d3.select('#d3Vis').style('width')) - margin.left - margin.right
                const height = parseInt(d3.select('#d3Vis').style('height')) - margin.top - margin.bottom

                //set up chart
                var h= margin.left + 20;
                const svg = d3.select(d3chart.current)
                                .attr('width', width + margin.left + margin.right )
                                .attr('height', height + margin.top + margin.bottom)
                                .style('background-color', '#7970ba')
                                .append('g')                                                
                                    .attr('transform', 'translate('+ h + ','+ margin.top+')');


                const x = d3.scaleTime()                
                                .domain(d3.extent(CountsByDate, function(d){return d.date}))
                                .range([0,width])

                svg.append('g')
                    .attr('transform', 'translate(0, '+ height +')')
                    .call(d3.axisBottom(x))

                const max = d3.max(CountsByDate, function(d){return d.total})
                const y = d3.scaleLinear()
                .domain([0,max])
                .range([height, 0])
                svg.append('g')
                .call(d3.axisLeft(y).tickFormat(function(d) {
                    const s = (d / 1e6);
                    return  `${s}M`;
                    }));

                    var sumstat = d3.group(CountsByDate, d => d.vaccine);
                    //console.log(sumstat);

                    var res = Array.from(sumstat.keys()); 
                    //console.log(res);
                    var color = d3.scaleOrdinal().domain(res)    
                    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999', '#0776ed'])

                    svg.selectAll("path")
                            .data(sumstat)
                            .join("path")
                            .attr('fill', 'none')
                            .attr('stroke-width', 1.5)
                            .attr('stroke', d => color(d[0]))
                            .attr("d", d => {
                                        return d3.line()
                                            .x(d => x(d.date))
                                            .y(d => y(+d.total))
                                             (d[1])
                                         });

               var legend = d3.select("svg")
                .selectAll('.legend')
                .data(sumstat)
                .enter()
                .append("g")
                .attr("class", "legend");

            legend.append("circle")
                .attr("cx", 150)
                .attr('cy', (d, i) => i * 30 + 100)
                .attr("r", 6)
                .style("fill", d => color(d[0]))

            legend.append("text")
                .attr("x", 170)
                .attr("y", (d, i) => i * 30 + 105)
                .text(d => d[0])

            
            })
          

    },[])
    return (
        <><div id="dropDownDiv">
  <h3>This visualization shows multi line chart for different vaccines providers and how many people<br></br>
           have been vaccinated from their vaccine (From 2020).
            </h3>
        </div>
            <div id="d3Vis">
                <svg ref={d3chart}></svg>
            </div></>
    )
}

export default LineChart;