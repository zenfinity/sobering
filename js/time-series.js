(function(viz, d3) { // viz namespace

  viz.TimeSeries = function(dispatch, data, nestedData, dateFormat) {

    init();

    function init() {
      createTimeSeriesChart();
    }

    function createTimeSeriesChart() {
      var parseDate = d3.timeParse(dateFormat);
      var dates = nestedData
        .rollup(function(leaf) { return leaf.length; })
        .entries(data)
        .map(function(d) {
          return {
            date: parseDate(d.key),
            count: d.value
          };
        });

      var svg = d3.select("#time-series");
      var width = svg.attr("width"),
          height = svg.attr("height"),
          margin = {top: 20, right: 20, bottom: 30, left: 75};

      var w = width - margin.left - margin.right,
          h = height - margin.top - margin.bottom;

      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleTime()
        .domain(d3.extent(dates, function(d) { return d.date; }))
        .rangeRound([0, w]);

      var y = d3.scaleLinear()
        .domain([0, d3.max(dates, function(d) { return d.count; })])
        .rangeRound([h, 0]);

      var area = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(y(0))
        .y1(function(d) { return y(d.count); });

      g.append("path")
        .datum(dates)
        .attr("fill", "lightsteelblue")
        .attr("d", area);

      g.append("path")
        .datum(dates)
        .attr("class", "selection")
        .attr("fill", "steelblue")
        .attr("d", area)
        .attr("clip-path", "url(#selectionClipPath)");

      var selectionClipPath = svg.append("defs")
        .append("clipPath")
          .attr("id", "selectionClipPath")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", w)
          .attr("height", h);

      var xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%e %b %Y"));
      g.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

      var yAxis = d3.axisLeft(y);
      g.append("g")
        .call(yAxis)
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dx", "-30px")
        .attr("dy", "-55px")
        .attr("text-anchor", "end")
        .attr("font-size", "14px")
        .text("Items / Day");

      var brush = d3.brushX()
        .extent([[1, 0], [w, h - 1]])
        .on("start brush", function() { brushed(); })
        .on("end", function() { brushed(); });

      g.append("g")
        .attr("class", "brush")
        .call(brush);

      function brushed() {
        var s = d3.event.selection;
        if (!s) return;
        var x0 = s[0],
            x1 = s[1];
        var dateRange = {
          from: x.invert(x0),
          to: x.invert(x1)
        };
        updateTimeSeriesChart(x0, x1);
        dispatch.call("selectDateRange", this, dateRange);
      }

      dispatch.on("removeSelection", removeSelection);

      function removeSelection() {
        svg.select(".brush").call(brush.move, null);
      }

      function updateTimeSeriesChart(x0, x1) {
        selectionClipPath
          .attr("x", x0)
          .attr("width", x1 - x0);
      }

    }

  };

})(window.viz = window.viz || {}, window.d3);
