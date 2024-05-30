/*
*   main.js
*/

/*d3.csv("data/ages.csv").then((data)=> {
	console.log(data);
});
d3.tsv("data/ages.tsv").then((data)=> {
	console.log(data);
});
d3.json("data/ages.json").then((data)=> {
	console.log(data);
});*/

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

d3.json("data/ages.json").then((data)=> {
	data.forEach((d)=>{
		d.age = +d.age;
	});
	console.log(data);
    var circles=svg.selectAll("circle")
        .data(data);

    circles.enter()
        .append("circle")
        .attr("cx",(d,i)=>{return 50*i+10})
        .attr("cy",200)
        .attr("r",(d)=>{return d.age})
        .attr("fill",(d)=>{
            if(d.age<10)
                return "#FF0000";                    
            return "#008c00";
        });

}).catch((error)=>{
    console.log(error);
});