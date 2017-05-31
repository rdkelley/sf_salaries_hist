var hist = (function() {

  var svg = d3.select("svg");

  var builder = {
    salaries: [],
    setGraphDimensions: function () {
      svg.attr("width", "500")
        .attr("height", "500");
    },
    graph: function() {

      this.setGraphDimensions();

      var x = d3.scaleLinear()
        .domain([0, d3.max(this.salaries)])

      var bins = d3.histogram()
        .domain(x.domain())
        (this.salaries);

      console.log(bins);

    }
  };

  return {

    loadData : function () {
      d3.csv("Salaries.csv")
        .row(function(d) {
          return +d.BasePay
        })
        .get(function(err, rows){
          builder.salaries = rows;
          builder.graph();
        });
    }
  }
})();

hist.loadData();
