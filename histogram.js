var hist = (function() {

  var svg = d3.select("svg");

  var builder = {

    salaries: [],

    graphDimensions: function () {
      svg.attr("width", "1000")
        .attr("height", "500");
      return {
        width: svg.attr("width"),
        height: svg.attr("height"),
      }
    },

    graph: function () {

      var dem = this.graphDimensions();

      var x = d3.scaleLinear()
        .domain([0, d3.max(this.salaries)])
        .range([0, this.graphDimensions().width]);


      var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(30))
        (this.salaries);

        console.log(bins);

      var y = d3.scaleLinear()
        .domain([d3.min(bins, function(d) {
          return d.length;
        }), d3.max(bins, function(d) {
          return d.length;
        })])
        .range([dem.height, 0]);


      var g = svg.append("g");

      g.selectAll("g")
        .data(bins)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d){
          console.log();
          return "translate(" + Math.floor(x(d.x0)) + "," + y(d.length) + ")";
        });

      d3.selectAll(".bar")
        .append("rect")
        .attr("width", (x(bins[0].x1) - x(bins[0].x0) - 1))
        .attr("height", function(d) {
          return dem.height - y(d.length);
        })

    },
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
