var width = 960,
  height = 600;

var color = d3.scale.category20();

var fisheye = d3.fisheye.circular()
  .radius(100)
  .distortion(5);

var force = d3.layout.force()
  .charge(-440)
  .linkDistance(60)
  .size([width, height]);

var svg = d3.select("#chart1").append("svg")
  .attr("width", width)
  .attr("height", height);

var lens = svg.append("circle")
  .attr("class","lens")
  .attr("r", fisheye.radius());;

var mag = svg.append("path")
  .attr("class", "mag");


var omega = 0.78;


var mag2 = svg.append("path")
  .attr("class", "mag2");



d3.json("./ressource/data.json", function(data) {
  var n = data.nodes.length;

  force.nodes(data.nodes).links(data.links);

  
  data.nodes.forEach(function(d, i) { d.x = d.y = width / n * i; });


  force.start();
  for (var i = n; i > 0; --i) force.tick();
  force.stop();


  var ox = 0, oy = 0;
  data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
  ox = ox / n - width / 2, oy = oy / n - height / 2;
  data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });

  var link = svg.selectAll(".link")
    .data(data.links)
    .enter().append("line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .style("stroke-width", function(d) { return Math.sqrt(d.weight); });

  var node = svg.selectAll(".node")
    .data(data.nodes)
    .enter().append("g")
    .attr("class", "node");

  render("path");

  function render(shape) {
    node.selectAll(".link").remove();
    node.selectAll(".circle").remove();
    node.selectAll(".text").remove();

    lens.style("stroke-opacity", shape == "circle" ? 1 : 0);
    mag.style("stroke-opacity", shape == "path" ? 1 : 0);
    mag2.style("stroke-opacity", shape == "path" ? 1 : 0);

    var nodeEnter = node
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.value3*10; })
      .style("fill", function(d) { return color(d.id); })
      .call(force.drag);

    var text = node.append("text")
      .attr("class", "text")
      .attr("dy", function(d) { return d.y; })
      .attr("dx", function(d) { return d.x; })
      .text(function(d) { return d.label; });

    node.append("title")
      .text(function(d) { return d.label; });

    svg.on("mousemove", function() {
      fisheye.focus(d3.mouse(this));

      var mouseX = d3.mouse(this)[0];
      var mouseY = d3.mouse(this)[1];
      var r = fisheye.radius();

      if (shape == "circle") {
      
        lens
          .attr("cx", mouseX)
          .attr("cy", mouseY);
      }
      else {
       
        var magPath = "M " + mouseX + "," + mouseY + " m -" + r + ", 0 a " + r + "," + r + " 0 1,0 " + (r * 2) + ",0 a " + r + "," + r + " 0 1,0 -" + (r * 2) + ",0";

        
        var x1 = mouseX + r * Math.sin(omega);
        var y1 = mouseY + r * Math.cos(omega);

        
        var mag2Path = "M " + (x1 + 2) + "," + (y1 + 2) + " L" + (mouseX + r * 1.7) + "," + (mouseY + r * 1.7);

        
        mag.attr("d", magPath);


        mag2.attr("d", mag2Path);
      };

      nodeEnter.each(function(d) { d.fisheye = fisheye(d); })
        .attr("cx", function(d) { return d.fisheye.x; })
        .attr("cy", function(d) { return d.fisheye.y; })
        .attr("r", function(d) { return d.fisheye.z * 4.5; });

      text.attr("dx", function(d) { return d.fisheye.x; })
        .attr("dy", function(d) { return d.fisheye.y; });

      link.attr("x1", function(d) { return d.source.fisheye.x; })
        .attr("y1", function(d) { return d.source.fisheye.y; })
        .attr("x2", function(d) { return d.target.fisheye.x; })
        .attr("y2", function(d) { return d.target.fisheye.y; });
    });
  }
  d3.select("#circle").on("click", function () { render("circle");});
  d3.select("#path").on("click", function () { render("path");});
})