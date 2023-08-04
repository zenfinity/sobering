// import {
//     select,
//     json,
//     tsv,
//     geoPath,
//     geoNaturalEarth1,
//     zoom,
//     event
//   } from 'd3';
//   import { feature } from 'topojson';

const svg = d3.select('svg'),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const projection = d3.geoGuyou()
    .scale(155)
    .translate([width / 2.2, height / 1.5]);
const pathGenerator = d3.geoPath().projection(projection);



//   svg.call(d3.zoom().on('zoom', () => {
//     g.attr('transform', event.transform);
//   }));
// g.call(d3.zoom().on("zoom", function () {
//     svg.attr("transform", d3.event.transform)
// }));
const zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[-100, -100], [width + 90, height + 100]])
    .on("zoom", zoomed);


// svg.call(d3.zoom()
//     .extent([[0, 0], [width, height]])
//     .scaleExtent([1, 8])
//     .on("zoom", zoomed));

svg.call(zoom)


function zoomed({ transform }) {
    g.attr("transform", transform);
}

function reset() {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
}

d3.select("#reset")
    .on("click", reset)

const g = svg.append('g');

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({ type: 'Sphere' }));

Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
]).then(([tsvData, topoJSONdata]) => {

    // const countryName = tsvData.reduce((accumulator, d) => {
    //     accumulator[d.iso_n3] = d.name;
    //     return accumulator;
    // }, {});


    const countryName = {};
    tsvData.forEach(d => {
        countryName[d.iso_n3] = d.name;
    });


    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
    g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .append('title')
        .text(d => countryName[d.id]);

});