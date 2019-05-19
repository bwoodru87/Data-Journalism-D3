
// declare svg dimensions
var svgWidth = 1000;
var svgHeight = 700;

// set margins
var margin = {
    top: 30,
    right: 50,
    bottom: 75,
    left: 50
  };

// set width and height within page
var width = svgWidth - margin.left - margin.right;
var height = (svgHeight - margin.top - margin.bottom);

// create svg wrapper 
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append the group that will hold our chart
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv("data.csv")
  .then(function(newsData){

    // parse data as numbers
    newsData.forEach(function(data){
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    })
    // create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([(d3.min(newsData,d=>d.poverty)-1), (d3.max(newsData, d=>d.poverty))])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(newsData, d=>d.healthcare)])
        .range([height,0]);

    // create axis
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes to the chartgroup
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    chartGroup.append("g")
        .call(yAxis);
    
    // create bubbles for plot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d=>xLinearScale(d.poverty))
        .attr("cy", d=>yLinearScale(d.healthcare))
        .attr("r", 13)
        .attr("fill", "teal")
        .attr("opacity", .7)
        .attr("stroke-width", "1");

    var chartText = chartGroup.selectAll(null)
        .data(newsData)
        .enter()
        .append("text")
        .attr("dx", d=>xLinearScale(d.poverty))
        .attr("dy", d=>yLinearScale(d.healthcare))
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(d => d.abbr);


    // initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.state}<strong><br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });

    // create tooltip in the chart
    chartGroup.call(toolTip);

    // create the mouseover event listeners
    chartText.on("mouseover", function(d){
        toolTip.show(d, this);
    })
        .on("mouseout", function(d){
            toolTip.hide(d);
    });
    
    // create axis labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height+35})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});
