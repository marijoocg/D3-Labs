
var margin={left:100,right:10,top:10,bottom:100};
var width=600;
var height=400;
var g = d3.select("#chart-area").append("svg")
    .attr("width", width+margin.right+margin.left)
    .attr("height", height+margin.bottom+margin.top)
    .append("g")
    .attr("transform","translate("+margin.left+", "+margin.top+")");

d3.json("data/buildings.json").then((data)=> { 
    console.log(data);
    data.forEach((d)=>{
  		d.height = +d.height;
  	});
    
    var names=data.map((d)=>{return d.name;});
    
    var x = d3.scaleBand()
	    .domain(names)
	    .range(([0,width]))
	    .paddingInner(0.3)
	    .paddingOuter(0.2);

    var y = d3.scaleLinear()
        .domain([828,0])
        .range([0,height]);

    var color = d3.scaleOrdinal()
      .domain(names)
      .range(d3.schemeSet3);

    var buildings = g.selectAll("rect")
        .data(data)

    buildings.enter()
        .append("rect")
        .attr("x", (d, i) =>{return x(d.name)})
        .attr("y", (d)=>{return y(d.height)})
        .attr("width", x.bandwidth())
        .attr("height", (d)=>{return height-y(d.height);})
        .attr("stroke","black")
        .attr("fill",(d)=>{return color(d.name)});

    var bottomAxis=d3.axisBottom(x);
    
    g.append("g")
        .attr("class", "bottom axis")
        .attr("transform", "translate(0, " + height+ ")")
	    .call(bottomAxis).selectAll("text")
	        .attr("y", "10")
	        .attr("x", "-5")
	        .attr("text-anchor", "end")
	        .attr("transform", "rotate(-15)");
    
    var leftAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat((d)=>{return d+"m";});

    g.append("g")
	    .attr("class", "left axis")
	    .call(leftAxis);

    g.append("text")
        .attr("class", "x axis-label")
        .attr("x",  width / 2)
        .attr("y", height+140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform","translate(0,-55)")
        .style("fill","black")
        .text("The world's tallest buildings");

    g.append("text")
        .attr("class", "y axis-label")
        .attr("x",  -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("fill","black")
        .text("Height (m)");

}).catch((error)=>{
    console.log(error)
});

