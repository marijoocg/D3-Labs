var svg = d3.select("#chart-area").append("svg")
    .attr("width", 500)
    .attr("height", 500);

d3.json("data/buildings.json").then((data)=> { 
    console.log(data);
    data.forEach((d)=>{
  		d.height = +d.height;
  	});
    
    var names=data.map((d)=>{return d.name;});
    
    var x = d3.scaleBand()
	    .domain(names)
	    .range(([0,400]))
	    .paddingInner(0.3)
	    .paddingOuter(0.2);

    var y = d3.scaleLinear()
        .domain([0,828])
        .range([0,400]);

    var color = d3.scaleOrdinal()
      .domain(names)
      .range(d3.schemeSet3);
      

    var buildings = svg.selectAll("rect")
        .data(data)

    buildings.enter()
        .append("rect")
        .attr("x", (d) =>{return x(d.name)})
        .attr("y", (d)=>{return 500-y(d.height)})
        .attr("width", x.bandwidth())
        .attr("height", (d)=>{return y(d.height);})
        .attr("stroke","black")
        .attr("fill",(d)=>{return color(d.name)});
}).catch((error)=>{
    console.log(error)
});