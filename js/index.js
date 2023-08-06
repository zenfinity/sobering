/////////////////////////// World Map ///////////////////////////
// Initialize map elements
const svg = d3.select('#mapInteractive');
const width = svg.attr("width"); // Grab from html tag
const height = svg.attr("height");

const projection = d3.geoEqualEarth()
    .scale(175)
    .translate([width / 2, height / 2]);

const pathGenerator = d3.geoPath().projection(projection);

const graticule = d3.geoGraticule();

const g = svg.append('g');

// projection.fitExtent([[0, 0], [width, height]], g);
// projection.fitSize([width, height], g);

//_________________Zoom
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





// Lat Lng lines

g.insert("path", "path.countries")
    .datum(graticule.outline)
    .attr("class", "outline")
    .attr("d", pathGenerator)
g.insert("path", "path.countries")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", pathGenerator)


// Background "Sphere"
// g.append('path')
//     .attr('class', 'sphere')
//     .attr('d', pathGenerator({ type: 'Sphere' }));






Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
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
        .text(d => countryName[d.id])

    // g.append("path")
    //     .datum(graticule)
    //     .attr("class", "graticule")
    //     .attr("d", path);
    
    // d3.select("svg").insert("path", "path.countries")
    //     .datum(graticule.outline)
    //     .attr("class", "graticule outline")
    //     .attr("d", geoPath)



});