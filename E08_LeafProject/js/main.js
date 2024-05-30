
var margin={left:100,right:10,top:10,bottom:100};
width=600;
height=400; 

var formattedData=[];
var interval;
var years=[];
var pos=0;

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
		
	formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
		var dataExists = (country.income && country.life_exp);
		return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	years=data.map((d)=>{return d.year});
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
   		   
	update(years[pos], formattedData[pos]);
	pos++;

}).catch((error)=>{
    console.log(error);
});

function update(year,data){

	var tip = d3.tip().attr('class', 'd3-tip')
		.html((d) => { var text = "<strong>Country:</strong>";
		text += "<span style='color:red'> " + d.country + "</span><br>";
		text += "<strong>Continent:</strong> ";
		text += "<span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";
		text += "<strong>Life Expectancy:</strong>";
		text += "<span style='color:red'>" + d3.format(" .2f")(d.life_exp) + "</span><br>";
		text += "<strong>GDP Per Capita:</strong>";
		text += "<span style='color:red'>" + d3.format(" $,.0f")(d.income) + "</span><br>";
		text += "<strong>Population:</strong>";
		text += "<span style='color:red'>" + d3.format(" ,.0f")(d.population) + "</span><br>";
		return text;});

	g.call(tip);		
	
	var continent = $("#continent-select").val();
	var data = data.filter((d) => {
		if (continent == "all") { return true; }
		else {
			return d.continent == continent;
		}
	});

	var year = $("#date-slider").slider("value")
	
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
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.merge(circles)
		.transition(t)
			.attr("cy",(d)=>{return y(d.life_exp);})
			.attr("cx",(d)=>{return x(d.income);})
			.attr("r",(d)=>{return Math.sqrt(area(d.population)/Math.PI);});

	$("#date-slider").slider("value", +(pos + 1800));
	$("#year")[0].innerHTML = +(year);
}

function step(){	
	update(years[pos], formattedData[pos]);
	pos++;
}

$("#play-button").on("click", ( ) => {
	var button = $("#play-button");
	if (button.text() == "Play"){
		button.text("Pause");
		interval = setInterval(step, 1000);
	} else {
		button.text("Play");
		clearInterval(interval);
	}
});

$("reset-button").on("click",()=>{
	pos=0;
});

$("#continent-select").on("change", ( ) => {
	update(years[pos], formattedData[pos]);
	pos++;
});

$("#date-slider").slider({
	max: 2014, min: 1800, step: 1,		// Options
	slide:(event, ui) => {			// Events
		time = ui.value - 1800;
		update(years[pos], formattedData[pos]);
	}
});