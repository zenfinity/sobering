// d3.select("my_box")
//     .append("line")
//     .attr({"x1":20, "y1":20, "x2":250, "y2":250})
//     .style("stroke","red")
//     .style("stroke-width","4px");

// d3.select("my_box")
//     .append("text")
//     .attr({"x": 20, "y": 20})
//     .text("HELLO");
// d3.select("my_box")
//     .append("circle")
//     .attr({"r": 20, "cx": 20, "cy": 20})
//     .style("fill","purple");
    
// d3.select("my_box")
//     .append("circle")
//     .attr({"r": 100, "cx": 400, "cy": 400})
//     .style("fill", "lightblue");
// d3.select("my_box")
//     .append("text")
//     .attr({"x": 400, "y": 400})
//     .text("WORLD");

var data = [210, 36, 322, 59, 123, 350, 290];

var width = 400, height = 300;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var bars = svg.selectAll(".myBars")
    .data(data)
    .enter()
    .append("rect");

bars.attr("x", 10)
    .attr("y", function(d,i){ return 10 + i*40})
    .attr("width", function(d){ return d})
    .attr("height", 30);