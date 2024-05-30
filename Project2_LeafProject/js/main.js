/*
*    main.js
*/

var margin={left:100,right:10,top:10,bottom:100};
width=600;
height=400; 
var flag=true;
var t=d3.transition().duration(750);

var g=d3.select("#chart-area").append("svg")
    .attr("width",width+margin.right+margin.left)
    .attr("height",height+margin.bottom+margin.top)
    .append("g")
    .attr("transform","translate("+margin.left+", "+margin.top+")");

var x= d3.scaleLog()
	.domain([142,150000])
	.range([0,width])
	.base(10);
 
var y=d3.scaleLinear()
	.domain([0,90])
	.range([height,0]);    

var area=d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI]);

var color = d3.scaleOrdinal()
	.range(d3.schemePastel1);	

var bottomAxis=d3.axisBottom(x)
	.tickValues([400,4000,40000])
	.tickFormat(d3.format("$"));
	
var leftAxis=d3.axisLeft(y);

g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + height + ")")
	.call(bottomAxis)
	.attr("fill","#a2a29f")
	.selectAll("text")
		.attr("y", 10)
		.attr("x", -5)
		.attr("text-anchor", "middle")
		.attr("fill","#8c8e92");

g.append("g")
	.attr("class", "left axis")
	.call(leftAxis)
	.attr("fill","#a2a29f")
    .selectAll("text")
    .attr("fill","#8c8e92");		

g.append("text")
    .attr("class","x axis-label")
    .attr("x",width/2)
    .attr("y",height+140)
    .attr("font-size","30px")
    .attr("text-anchor","middle")
    .attr("fill","#ddddd2")
    .attr("transform","translate(0,-90)")
    .text("GDP Per Capita ($)");     
	
g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -60)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("fill","#ddddd2")
	.attr("transform", "rotate(-90)")
	.text("Life expectancy (Years)");

var legend=g.append("g")
	.attr("transform","translate("+(width-10)+","+(height-200)+")");

var yearText=g.append("text")	
	.attr("class","x axis-label")
	.attr("x",width-55)
	.attr("y",height+73)
	.attr("font-size","50px")
	.attr("text-anchor","middle")
	.attr("fill","#747576")
	.attr("transform","translate(0,-90)")
	.text("Year");     

d3.json("data/data.json").then((data)=>{
    console.log(data);	
    data.forEach(d => {
        d.year=+d.year;        
    });
	const formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
		var dataExists = (country.income && country.life_exp);
		return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	var years=data.map((d)=>{return d.year});
	var continent=formattedData[0].map((d)=>{return d.continent;});
	var continents=[...new Set(continent)];

	color.domain(continents);
	continents.forEach((d,i)=>{
		var row=legend.append("g")
			.attr("transform","translate(0, "+(i*20)+")");

		row.append("rect")
			.attr("width",10)
			.attr("height",10)
			.attr("fill",color(d));

		row.append("text")
			.attr("x",-10)
			.attr("y",10)
			.attr("text-anchor", "end")			
			.attr("fill","#747576")			
			.style("text-transform", "capitalize")			
			.text(d);
	});
	
	var pos = 0;
   	d3.interval( ( )=>{
	   if (pos >= years.length)pos = 0;	   
	   update(years[pos], formattedData[pos], continents);
	   pos++;
	}, 1000);

}).catch((error)=>{
    console.log(error);
});

function update(year,data){
	var label=year;
	yearText.text(label);
	
	var circles=g.selectAll("circle")
		.data(data,(d)=>{return d.country;});

	circles.exit()
		.attr("fill",(d)=>{return color(d.continent);})
		.transition(t)
			.attr("cy",(d)=>{return y(d.life_exp);})
			.attr("cx",(d)=>{return x(d.income);})
			.attr("r",(d)=>{return Math.sqrt(area(d.population)/Math.PI);})
			.remove();

	circles.transition(t)
		.attr("cy",(d)=>{return y(d.life_exp);})
		.attr("cx",(d)=>{return x(d.income);})
		.attr("r",(d)=>{return Math.sqrt(area(d.population)/Math.PI);});

	circles.enter().append("circle")
		.attr("cy",(d)=>{return y(d.life_exp);})
		.attr("cx",(d)=>{return x(d.income);})
		.attr("r",(d)=>{return Math.sqrt(area(d.population)/Math.PI);})
		.attr("fill",(d)=>{return color(d.continent);})
		.merge(circles)
		.transition(t)
			.attr("cy",(d)=>{return y(d.life_exp);})
			.attr("cx",(d)=>{return x(d.income);})
			.attr("r",(d)=>{return Math.sqrt(area(d.population)/Math.PI);});
}