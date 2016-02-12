
var width = 960,
    height = 500,
    active = d3.select(null);

// var projection = d3.geo.albersUsa()
var projection = d3.geo.mercator()
// var projection = d3.geo.kavrayskiy7()
// var projection = d3.geo.equirectangular()
    .scale(140)
    .translate([width / 2, height / 1.5]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g")
    .style("stroke-width", "1.5px");

// d3.json("/js/us.json", function(error, us) {
//   if (error) throw error;

//   g.selectAll("path")
//       .data(topojson.feature(us, us.objects.states).features)
//     .enter().append("path")
//       .attr("d", path)
//       .attr("class", "feature")
//       .on("click", clicked);

//   g.append("path")
//       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//       .attr("class", "mesh")
//       .attr("d", path);
// });

queue()
    .defer(d3.json, "/js/world.json")
    .defer(d3.tsv, "/js/world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {
  if (error) throw error;

  var countries = topojson.feature(world, world.objects.countries).features;
  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  g.selectAll("path")
      .data(countries)
      .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .attr("id", function(d, i) { return countries[i].name; })
      .on("click", clicked);

  g.append("path")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);



  // console.log(countries);

  // g.selectAll("path")
  //     .attr("id", function(d, i) {
  //       return countries[i % countries.length].name;
  //     })

  g.select("#Antarctica").remove();
}

// var color = d3.scale.category10();

// d3.json("/js/world.json", function(error, world) {
//   if (error) throw error;
//   var countries = topojson.feature(world, world.objects.countries).features,
//       neighbors = topojson.neighbors(world.objects.countries.geometries);
//   svg.selectAll(".country")
//       .data(countries)
//     .enter().insert("path", ".graticule")
//       .attr("class", "country")
//       .attr("d", path)
//       .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });
//   svg.insert("path", ".graticule")
//       .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
//       .attr("class", "boundary")
//       .attr("d", path);
// });


function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  g.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  g.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}
