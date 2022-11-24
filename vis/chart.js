var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("./ressource/data.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.weight); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")

  var circles = node.append("circle")
    .attr("r", function(d) { return d.value3*10; })
    .attr("fill", function(d) { return color(d.id); })
    .attr("cx", function(d) { return d.value1; })
    .attr("cy", function(d) { return d.value2; });

  // Create a drag handler and append it to the node object instead
  var drag_handler = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

  drag_handler(node);
  
  var lables = node.append("text")
      .text(function(d) {
        return d.label;
      })
      .attr('x', 6)
      .attr('y', 3);

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}




// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

// var simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(function(d) { return d.id; }))
//     .force("charge", d3.forceManyBody().strength(-400))
//     .force("center", d3.forceCenter(width / 2, height / 2));


// d3.json("./ressource/data.json", function(error, graph) {
//   if (error) throw error;         

//   var link = svg.append("g")
//                 .style("stroke", "#aaa")
//                 .selectAll("line")
//                 .data(graph.links)
//                 .enter().append("line");

//   var node = svg.append("g")
//             .attr("class", "nodes")
//   .selectAll("circle")
//             .data(graph.nodes)
//   .enter().append("circle")
//           .attr("r", function(d) { return d.value3*10; })
//           .call(d3.drag()
//               .on("start", dragstarted)
//               .on("drag", dragged)
//               .on("end", dragended));
  
//   var label = svg.append("g")
//       .attr("class", "labels")
//       .selectAll("text")
//       .data(graph.nodes)
//       .enter().append("text")
//         .attr("class", "label")
//         .text(function(d) { return d.label; })
//         // .style("font-size", "0.5em")

//   simulation
//       .nodes(graph.nodes)
//       .on("tick", ticked);

//   simulation.force("link")
//       .links(graph.links);

//   function ticked() {
//     link
//         .attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });

//     node
//          .attr("r", function(d) { return d.value3*50; })
//          .style("fill", "#d9d9d9")
//          .style("stroke", "#969696")
//          .style("stroke-width", "1px")
//          .attr("cx", function (d) { return d.x+6; })
//          .attr("cy", function(d) { return d.y-6; });
    
//     label
//     		.attr("x", function(d) { return d.x; })
//             .attr("y", function (d) { return d.y; })
//             .style("font-size", "10px").style("fill", "#4393c3");
//   }
// });

// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//   d.fx = d.value1;
//   d.fy = d.value2;
// }

// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }

// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
// }