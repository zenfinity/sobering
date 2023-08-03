(function(viz, d3) { // viz namespace

  viz.HexbinMap = function(dispatch, world, data, nestedData, dateFormat) {

    // var formatDate = d3.timeFormat(dateFormat);

    // var keyedTweets = {};
    // nestedData.entries(data).forEach(function(nestedTweet) {
    //   keyedTweets[nestedTweet.key] = nestedTweet.values;
    // });

    init();

    function init() {
      createHexbinChart();
    }

    function createHexbinChart() {
      var svg = d3.select("#map");
      var width = svg.attr("width"),
          height = svg.attr("height");

      var projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 2]);

      var path = d3.geoPath()
        .projection(projection);
      
      var colorFill = d3.domain(0, 20)
        .range(["black", "steelblue"])
        .interpolate(d3.interpolateLab);

      data.forEach(function(country) {
        country.projection = projection([country.longitude, country.latitude]);
      });

      var points = data.map(function(country) {
        return country.projection;
      });

      var hexbinsGroup;
      var hexbin = d3.hexbin()
        .radius(5);
      var color = d3.scaleSequential(d3.interpolateMagma);

      addMap();
      createHexbins(points);

      dispatch.on("selectDateRange", selectDateRange);

      function selectDateRange(dateRange) {
        var filteredTweets = filterTweetsByDateRange(dateRange);
        var filteredPoints = filteredTweets.map(function(tweet) {
          return tweet.projection;
        });
        updateHexbins(filteredPoints);

        dispatch.call("updateSelection", this, {
          total: points.length,
          selected: filteredPoints.length
        });
      }

      function filterTweetsByDateRange(dateRange) {
        var dayDifference = d3.timeDay.count(dateRange.from, dateRange.to);
        if (dayDifference === 0 ) return [];

        var keys = d3.range(0, dayDifference + 1)
          .map(function(n) {
            var d = d3.timeDay.offset(dateRange.from, n);
            return formatDate(d);
          });

        var arraysToConcat = [];
        keys.forEach(function(key) {
          if (key in keyedTweets) {
            arraysToConcat.push(keyedTweets[key]);
          }
        });
        var filteredTweets = [].concat.apply([], arraysToConcat);
        return filteredTweets;
      }

      function removeSelection() {
        updateHexbins(points);
      }

      function addMap() {
        svg = d3.select("#map")
          .attr("width", width)
          .attr("height", height)
          .on("click", function() {
            dispatch.call("removeSelection", this);
            removeSelection();
          });

        svg.append("path")
         .datum(topojson.feature(world, world.objects.land))
         .attr("class", "land")
         .attr("d", path);

        svg.append("path")
         .datum(topojson.mesh(world, world.objects.countries))
         .attr("class", "boundary")
         .attr("d", path);

         hexbinsGroup = svg.append("g")
           .attr("clip-path", "url(#clip)");
      }

      function createHexbins(points) {
        var bins = hexbin(points);

        color
          .domain([d3.max(bins, function(d) { return d.length; }), 0]);

        hexbinsGroup
          .selectAll(".hexagon")
            .data(bins, function(d) { return d.x + "," + d.y; })
          .enter().append("path")
            .attr("class", "hexagon")
            .attr("d", hexbin.hexagon())
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style("fill", function(d) { return colorFill(d.length); });
      }

      function updateHexbins(points) {
        var bins = hexbin(points);

        color
          .domain([d3.max(bins, function(d) { return d.length; }), 0]);

        var hexagon = hexbinsGroup.selectAll(".hexagon")
          .data(bins, function(d) { return d.x + "," + d.y; });

        hexagon.exit().remove();

        hexagon
          .enter().append("path")
            .attr("class", "hexagon")
            .attr("d", hexbin.hexagon())
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .merge(hexagon)
            .style("fill", function(d) { return color(d.length); });
      }
    }

  };

})(window.viz = window.viz || {}, window.d3);
