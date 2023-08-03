
// The svg
var svg = d3.select("mapworld"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoNaturalEarth1()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])

// Load external data and boot
// d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function (data) {

d3.queue()
    .defer(d3.json, "sobering/data/world-50m.json")
    // .defer(d3.tsv, "/sobering/data/walmart.tsv", typeWalmart)
    // .defer(d3.csv, "/sobering/data/avgDrinksLocationsSimple.csv", consumptionCountries)
    .await(ready);

function ready(error, world) {
    if (error) throw error;
    console.log(world)
    // consumption.row(function (d) {
    //     return {
    //         litres: d.litres,
    //         lat: d.latitude,
    //         lng: d.longitude
    //     };
    // })
    //     .get(function (data) {
    //         console.log(data);
    //     });
    svg.append("path")
        .datum(topojson.feature(world, us.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.countries, function (a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);

    // svg.append("g")
    //     .attr("class", "hexagon")
    //     .selectAll("path")
    //     .data(hexbin(walmarts).sort(function (a, b) { return b.length - a.length; }))
    //     .enter().append("path")
    //     .attr("d", function (d) { return hexbin.hexagon(radius(d.length)); })
    //     .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    //     .attr("fill", function (d) { return color(d3.median(d, function (d) { return +d.date; })); });
}

