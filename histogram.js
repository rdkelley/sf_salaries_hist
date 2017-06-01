var hist = (function() {

  var svg = d3.select("svg");

  var builder = {

    salaries: [],

    graphDimensions: function () {
      margins = {top: 20, right: 21, bottom: 20, left: 21},
      svg.attr("width", "1000")
        .attr("height", "550");
      return {
        width: +svg.attr("width") - margins.right - margins.left,
        height: +svg.attr("height") - margins.top - margins.bottom,
      }
    },

    graph: function () {

      var dem = this.graphDimensions();

      var x = d3.scaleLinear()
        .domain([0, d3.max(this.salaries)])
        .rangeRound([0, dem.width]);

      var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(31))
        (this.salaries);

      var y = d3.scaleLinear()
        .domain([d3.min(bins, function(d) {
          return d.length;
        }), d3.max(bins, function(d) {
          return d.length;
        })])
        .range([dem.height, 0]);

      var g = svg.append("g")
        .attr("transform", "translate(40, 20)");

      g.selectAll("g")
        .data(bins)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d){
          console.log(x(d.x0));
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        });

      d3.selectAll(".bar")
        .append("rect")
        .attr("width", (x(bins[0].x1) - x(bins[0].x0) - 1))
        .attr("height", function(d) {
          return dem.height - y(d.length);
        })

      var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format("$,d"));

      d3.select("g")
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + dem.height + ")")
        .call(xAxis);

      d3.select("g")
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
    },
  };

  return {

    loadData : function () {
      d3.csv("Salaries.csv")
        .row(function(d) {
          var years = [2011, 2012, 2013, 2014];
          if (+d.BasePay > 0 && years.indexOf(+d.Year) !== -1) {
            return +d.BasePay
          }
        })
        .get(function(err, rows){
          builder.salaries = rows;
          builder.graph();
        });
    }
  }
})();

hist.loadData();
