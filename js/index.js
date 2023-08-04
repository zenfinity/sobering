

const svg = d3.select('#mapInteractive');
const width = svg.attr("width");
const height = svg.attr("height");

const projection = d3.geoGuyou()
    .scale(100)
    .translate([width / 2.2, height / 1.5]);

const pathGenerator = d3.geoPath().projection(projection);


const g = svg.append('g');

const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 8])
    .translateExtent([[-100, -100], [width + 90, height + 100]])
    .on("zoom", zoomed);

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