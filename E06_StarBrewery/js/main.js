
var margin={left:100,right:10,top:10,bottom:100};
width=600;
height=400; 
var flag=true;
var g=d3.select("#chart-area").append("svg")
    .attr("width",width+margin.right+margin.left)
    .attr("height",height+margin.bottom+margin.top)
    .append("g")
    .attr("transform","translate("+margin.left+", "+margin.top+")");

var x= d3.scaleBand()    
    .range([0,width])
    .padding(0.2);    
 
var y=d3.scaleLinear().range([0,height]);    

var xAxisGroup=g.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0, "+height+")");

var yAxisGroup = g.append("g")
    .attr("class", "y-axis");   

g.append("text")
    .attr("class","x axis-label")
    .attr("x",width/2)
    .attr("y",height+140)
    .attr("font-size","30px")
    .attr("text-anchor","middle")
    .attr("fill","#fdfdfb")
    .attr("transform","translate(0,-90)")
    .text("Month");    
    
var yLabel=g.append("text")
    .attr("class","y axis-label")
    .attr("x",-(height/2))
    .attr("y",-60)
    .attr("font-size","20px")
    .attr("text-anchor","middle")
    .attr("transform","rotate(-90)")
    .attr("fill","#fdfdfb");    

d3.json("data/revenues.json").then((data)=>{
    console.log(data);
    data.forEach(d => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    d3.interval(()=>{
        console.log("Hello world");
        update(data);
        flag=!flag;
    },1000);
    update(data);

}).catch((error)=>{
    console.log(error);
});

function update(data){
    var value = flag ? "revenue" : "profit";

    x.domain(data.map((d)=>{return d.month;}));
    y.domain([d3.max(data,(d)=>{return d[value];}),0]);

    var bars=g.selectAll("rect")    
        .data(data);
    
    bars.exit().remove();

    bars.attr("x",(d)=>{return x(d.month);})
        .attr("y",(d)=>{return y(d[value]);})
        .attr("width",x.bandwidth)
        .attr("height",(d)=>{return height-y(d[value]);});

    bars.enter()
        .append("rect")
        .attr("x", (d) =>{return x(d.month)})
        .attr("y", (d)=>{return y(d[value])})
        .attr("width", x.bandwidth)
        .attr("height", (d)=>{return height-y(d[value]);})
        .attr("stroke","black")
        .attr("fill","#cacb30");
       
    var bottomAxis=d3.axisBottom(x);

    xAxisGroup.call(bottomAxis)
        .attr("fill","#b9b9b0")
        .selectAll("text")
            .attr("y","10")
            .attr("x","-5")
            .attr("text-anchor","middle")
            .attr("fill","#b9b9b0");

    var leftAxis=d3.axisLeft(y)
        .ticks(11)
        .tickFormat((d)=>{return "$"+d/1000+"K";});
    
    yAxisGroup.call(leftAxis)
        .attr("fill","#b9b9b0")
        .selectAll("text")
        .attr("fill","#b9b9b0");

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label+" (dlls.)");
}