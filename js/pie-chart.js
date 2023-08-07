(function(viz, d3) { // viz namespace

  viz.PieChart = function(dispatch) {

    init();

    function init() {
      createPieChart();
    }

    function createPieChart() {
      var svg = d3.select("#pie-chart");
      var width = svg.attr("width"),
          height = svg.attr("height"),
          margin = 20,
          borderWidth = 10;
      var radius = Math.min(width, height) / 2;

      var g = svg.append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

      var label = svg.append("text")
        .attr("class", "percentage")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

      var format = d3.format(".0%");

      var color = d3.scaleOrdinal(["steelblue", "lightsteelblue"]);

      var pie = d3.pie()
          .sort(null)
          .value(function(d) { return d; });

      var path = d3.arc()
          .outerRadius(radius - margin)
          .innerRadius(radius - margin - borderWidth);

      updatePieChart([1, 0], 1); // Start with all items selected (100%)
      dispatch.on("updateSelection", updateSelection);

      function updateSelection(selectionInfo) {
        var data = [selectionInfo.selected, selectionInfo.total - selectionInfo.selected];
        var ratioOfSelectedToUnselected = selectionInfo.selected / selectionInfo.total;
        updatePieChart(data, ratioOfSelectedToUnselected);
      }

      function updatePieChart(data, ratioOfSelectedToUnselected) {
        g.selectAll(".arc").remove();

        var arc = g.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
            .attr("class", "arc");
        arc.append("path")
          .attr("d", path)
          .attr("fill", function(d, i) { return color(i); });

        label.text(function() { return format(ratioOfSelectedToUnselected); });
      }

    }

  };

})(window.viz = window.viz || {}, window.d3);
