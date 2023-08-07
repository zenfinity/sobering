//https://curran.github.io/dataviz-course-2018/#week-5
//https://vizhub.com/curran/4fb5e4e665474a169325bd18cdc3d0c0
// import {
//     select,
//     json,
//     tsv,
//     geoPath,
//     // projection,
//     map,
//     // geoNaturalEarth1,
//     // geoMercator,
//     geo,
//     zoom,
//     event
// } from 'd3';

// import {geoProjection as projection} from "d3-geo-projection";
// import {d3, map} from "@d3/world-map"
// import {d3, map} from {projection} from "@d3/world-map"
if (HTMLScriptElement.supports?.("importmap")) {
    console.log("Browser supports import maps.");
  }
  
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import topojson from "https://d3js.org/topojson.v1.min.js";
const svg = d3.select('#mapsimple');

var proj = d3.geoNaturalEarth1()
    .scale(150)
    .translate([svg.width / 2, svg.height / 2]);
var pathGenerator = d3.geoPath().projection(proj);

const g = svg.append('g');

// g.append('path')
//     .attr('class', 'sphere')
//     .attr('d', pathGenerator({ type: 'Sphere' }));

svg.call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
 }));

Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, topoJSONdata]) => {
    console.log("Inside Promise.all")
    const countryName = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name;
        return accumulator;
    }, {});

    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
    console.log("Pulled data")
    console.log(countries.features)
    g.selectAll('path')
        .enter().append('path')
        .datum(countries.features)
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .append('title')
        .text(d => countryName[d.id]); 

});