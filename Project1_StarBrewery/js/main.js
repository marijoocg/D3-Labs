/*
*    main.js
*/

var margin={left:100,right:10,top:10,bottom:100};
width=600;
height=400;
var g=d3.select("#chart-area").append("svg")
    .attr("width",width+margin.right+margin.left)
    .attr("height",height+margin.bottom+margin.top)
    .append("g")
    .attr("transform","translate("+margin.left+", "+margin.top+")");

d3.json("data/revenues.json").then((data)=>{
    console.log(data);
    data.forEach(d => {
        d.revenue = +d.revenue;
    });

    var months=data.map((d)=>{return d.month;});

    var x= d3.scaleBand()
        .domain(months)
        .range([0,width])
        .paddingInner(0.3)
        .paddingOuter(0.2);

    var y=d3.scaleLinear()
        .domain([d3.max(data,(d)=>{
            return d.revenue;
        }),0])
        .range([0,height]);

    var revenues=g.selectAll("rect")    
        .data(data);

    revenues.enter()
        .append("rect")
        .attr("x", (d, i) =>{return x(d.month)})
        .attr("y", (d)=>{return y(d.revenue)})
        .attr("width", x.bandwidth())
        .attr("height", (d)=>{return height-y(d.revenue);})
        .attr("stroke","black")
        .attr("fill","#cacb30");

    var bottomAxis=d3.axisBottom(x);

    g.append("g")
        .attr("class","bottom axis")
        .attr("transform", "translate(0, "+height+")")                
        .call(bottomAxis)
        .attr("fill","#b9b9b0")
        .selectAll("text")
            .attr("y","10")
            .attr("x","-5")
            .attr("text-anchor","middle")
            .attr("fill","#b9b9b0");

    var leftAxis=d3.axisLeft(y)
        .ticks(11)
        .tickFormat((d)=>{return "$"+d/1000+"K";});
    
    g.append("g")
        .attr("class", "left axis")
        .call(leftAxis)
        .attr("fill","#b9b9b0")
        .selectAll("text")
        .attr("fill","#b9b9b0");
        
    g.append("text")
        .attr("class","x axis-label")
        .attr("x",width/2)
        .attr("y",height+140)
        .attr("font-size","30px")
        .attr("text-anchor","middle")
        .attr("fill","#fdfdfb")
        .attr("transform","translate(0,-90)")
        .text("Month");

    g.append("text")
        .attr("class","y axis-label")
        .attr("x",-(height/2))
        .attr("y",-60)
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .attr("fill","#fdfdfb")
        .text("Revenue (dlls.)");
}).catch((error)=>{
    console.log(error);
});