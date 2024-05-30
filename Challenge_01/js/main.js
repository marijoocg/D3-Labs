var svg = d3.select("#chart-area").append("svg")
    .attr("width", 900)
    .attr("height", 900);

d3.json("data/buildings.json").then((data)=> {
    console.log(data);
    data.forEach((d)=>{
  		d.height = +d.height;
  	});
    
    var buildings = svg.selectAll("rect")
        .data(data)

    buildings.enter()
        .append("rect")
        .attr("x", (d, i) =>{return 70*i+10})
        .attr("y", (d)=>{return 900-d.height})
        .attr("width", 45)
        .attr("height", (d)=>{return d.height})
        .attr("stroke","black")
        .attr("fill","#008c00");
}).catch((error)=>{
    console.log(error)
});