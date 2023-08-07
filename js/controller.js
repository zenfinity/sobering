(function(viz, d3) { // viz namespace

  viz.Controller = function(world, data, dateFormat) {
    // https://github.com/d3/d3-dispatch
    var dispatch = d3.dispatch("selectDateRange", "removeSelection", "updateSelection");

    // https://github.com/d3/d3-collection#nests
    var nestedData = d3.nest()
      .key(function(d) { return d.Date; });

    init();

    function init() {
      new viz.HexbinMap(dispatch, world, data, nestedData, dateFormat);
      new viz.TimeSeries(dispatch, data, nestedData, dateFormat);
      new viz.PieChart(dispatch);
    }
  };

})(window.viz = window.viz || {}, window.d3);
