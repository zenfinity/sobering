https://www.geeksforgeeks.org/d3-js-geoalbers-function/
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// geoAlbers projection
var gfg = d3.geoAugust()
    .scale(width / 2 / Math.PI)
    .translate([width / 1.75, height / 2])

// Loading the json data
d3.json("https://raw.githubusercontent.com/janasayantan/datageojson/master/geoworld%20.json",
    function (data) {
        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("fill", "grey")
            .attr("d", d3.geoPath()
                .projection(gfg)
            )
            .style("stroke", "#ffff")
    })