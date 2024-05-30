
//Chart Area
var svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500);

//Adding Charts
var circle = svg.append("circle")
	.attr("cx", 150)
	.attr("cy", 300)
	.attr("r", 45)
	.attr("fill", "blue");

var circle = svg.append("circle")
	.attr("cx", 200)
	.attr("cy", 400)
	.attr("r", 70)
	.attr("fill", "green");

var rect = svg.append("rect")
	.attr("x", 20)
	.attr("y", 20)
	.attr("width", 100)
	.attr("height", 200)
	.attr("fill","red");

var rect = svg.append("rect")
	.attr("x", 150)
	.attr("y", 10)
	.attr("width", 80)
	.attr("height", 100)
	.attr("fill","pink");



