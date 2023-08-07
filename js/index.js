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

    var hexData;

    //_________________ Helper Functions
    //Make a gradient rectangle of the color scale being used
    //id must be an svg with width and heigth attributes assigned
    function drawScale(id, interpolator) {
        // console.log(id)
      var data = Array.from(Array(100).keys());

      var cScale = d3.scaleSequential()
        .interpolator(interpolator)
        .domain([0, 99]);

      var xScale = d3.scaleLinear()
        .domain([0, 99])
        .range([0, 580]);

      var u = d3.select("#" + id)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => Math.floor(xScale(d)))
        .attr("y", 0)
        .attr("height", 40)
        .attr("width", (d) => {
          if (d == 99) {
            return 6;
          }
          return Math.floor(xScale(d + 1)) - Math.floor(xScale(d)) + 1;
        })
        .attr("fill", (d) => cScale(d));
    }//drawScale


    
    //_________________ Zoom
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


    //_________________ Lat Lng lines
    g.insert("path", "path.countries")
      .datum(graticule.outline)
      .attr("class", "outline")
      .attr("d", pathGenerator)
    g.insert("path", "path.countries")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", pathGenerator)


    //_________________ Draw
    // Map and countries
    Promise.all([
      d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
      d3.csv('/sobering/data/avgDrinksLocations.csv'),
      d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ]).then(([tsvData, csvData, topoJSONdata]) => {
      // hexData = csvData.forEach(function (d) {
      //     d.litres = +d.litres;
      //     d["life_expectancy"] = +d["life_expectancy"];
      // });
      // console.log(hexData);
      const countryName = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = {
          'countryName': d.name,
          'countryCode': d.iso_a3
        };
        return accumulator;
      }, {});

      const countryCode = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_a3] = {
          'countryID': d.iso_n3,
          'countryName': d.name //add coordinates here for centroid?

        };
        return accumulator;
      }, {});

      // console.log(tsvData)
      // console.log(countryName)
      // console.log(countryCode)
      // console.log(csvData)

      //Create new dict to get lat lng for centroid calc
      var countryInfo = {};
      csvData.forEach(d => {
        countryInfo = {
          'countryID': countryCode[d.country_code],
          'countryCode': d.country_code,
          // 'countryName': d.country_name,
          'litres': d.litres = +d.litres, //convert string to number
          'life_Expectancy': d.life_expectancy = +d.life_expectancy,
          'latitude': d.latitude = +d.latitude,
          'longitude': d.longitude = +d.longitude
        }
      });

      // console.log(countryInfo)

      const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
      g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .append('title')
        .text(d => countryName[d.id].countryName)

    });


    // Circle markers separately
    var myColor = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, 20]); //manual range for litre min/max


    d3.csv('/sobering/data/avgDrinksLocations.csv', function (d) {
      // console.log(d)
      d.longitude = +d.longitude;
      d.latitude = +d.latitude;
      d.litres = +d.litres;
      return d;
    }).then(csvData => {
      g.selectAll(".marker")
        .data(csvData)
        .enter().append("circle")
        .attr("class", "countryInfo")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", d => Math.sqrt(+d.life_expectancy) * 1) // Adjust the scale as needed
        .attr("fill", d => myColor(d.litres));
    });


    // Thanks test circle you did well
    // g
    //   .append("circle")
    //   .attr("class", "testCircle")
    //   .attr('r', 10)
    //   .attr('cx', 10)
    //   .attr('cy', 10)
    // var colorA = "purple", colorB = "orange";



    drawScale("litreScale", d3.interpolateBlues);