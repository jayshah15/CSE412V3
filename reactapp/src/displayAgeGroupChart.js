import React, { useEffect, useRef, useState, Component } from 'react';
import * as d3 from 'd3';
import './ageGroupChartStyle.css';
import { filter } from 'd3';

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
                let tempData = getAgeGroupData(data);
                console.log(tempData);
                d3.selectAll("svg > *").remove();
                
                const margin = {top : 50, right : 30, bottom : 30, left : 30}
                const width = parseInt(d3.select('#d3Vis').style('width')) - margin.left - margin.right
                const height = parseInt(d3.select('#d3Vis').style('height')) - margin.top - margin.bottom


                 var svg = d3.select(d3chart.current)
                            .attr("width",width)
                            .attr("height", height)
                            .style("background-color",'#FFFFFF')

                // var filterData = d3.pie().sort(null).value(function(d){return d.value})(tempData);
                const radius = 200;

                var g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var colors = d3.scaleOrdinal()
                                .domain(tempData)
                                .range(d3.schemeDark2)  
                                    
               

                var pie = d3.pie().value(function(d) { 
                    return d.value; 
                });
    
            var arc = g.selectAll("arc")
                       .data(pie(tempData))
                       .enter();

                       var path = d3.arc()
                       .outerRadius(radius)
                       .innerRadius(0);
  
          arc.append("path")
             .attr("d", path)
             .attr("fill", function(d) { return colors(d.data.name); });

             var legends = g.append
                //console.log(filterData);
                // var segments = d3.arc()
                //                     .innerRadius(0)
                //                     .outerRadius(200)
                //                     .padAngle(.05)
                //                     .padRadius(50);


                // var sections = svg.append('g')
                //                     .attr('transform','translate(250,250)')
                //                     .selectAll("path").data(filterData); 
                // sections.enter().append("path").attr("d",segments).attr("fill", function(d)
                // {return colors(d.filterData.value);});

            })

    }, [])
    return (
        <><div id="dropDownDiv">

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

function PieChartFn(data, {
    name = ([x]) => x,  // given d in data, returns the (ordinal) label
    value = ([, y]) => y, // given d in data, returns the (quantitative) value
    title, // given d in data, returns the title text
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
    outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
    labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
    format = ",", // a format specifier for values (in the label)
    names, // array of names (the domain of the color scale)
    colors, // array of colors for names
    stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
    strokeWidth = 1, // width of stroke separating wedges
    strokeLinejoin = "round", // line join of stroke separating wedges
    padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
} = {}) {
    // Compute values.
    const N = d3.map(data, name);
    const V = d3.map(data, value);
    const I = d3.range(N.length).filter(i => !isNaN(V[i]));

    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names);

    // Chose a default color scheme based on cardinality.
    if (colors === undefined) colors = d3.schemeSpectral[names.size];
    if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

    // Construct scales.
    const color = d3.scaleOrdinal(names, colors);

    // Compute titles.
    if (title === undefined) {
        const formatValue = d3.format(format);
        title = i => `${N[i]}\n${formatValue(V[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(N[d.data]))
        .attr("d", arc)
        .append("title")
        .text(d => title(d.data));

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")
        .data(d => {
            const lines = `${title(d.data)}`.split(/\n/);
            return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (_, i) => `${i * 1.1}em`)
        .attr("font-weight", (_, i) => i ? null : "bold")
        .text(d => d);

    return Object.assign(svg.node(), { scales: { color } });
}

function getUnique(arr, comp) {

    // store the comparison  values in array
    const unique = arr?.map(e => e[comp])

        // store the indexes of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the false indexes & return unique objects
        .filter((e) => arr[e]).map(e => arr[e]);

    return unique;
}

export default PieChart;