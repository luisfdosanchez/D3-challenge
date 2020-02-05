function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function getMin(arr, prop) {
    var min;
    for (var i=0 ; i<arr.length ; i++) {
        if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop]))
            min = arr[i];
    }
    return min;
}

var svgDim = 400;
var chartMargin = 50;
var chartDim = svgDim - 2*chartMargin;

var svg = d3
    .select(".scatter-area")
    .append("svg")
    .attr("height", svgDim)
    .attr("width", svgDim);

var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin}, ${chartMargin})`);

d3.csv("data.csv").then((d)=>{
    console.log(d);
    d.forEach(function(f) {
        f.medianAge = +f.medianAge;
        f.uninsured = +f.uninsured;
        f.hhIncome = +f.hhIncome;
        f.poverty = +f.poverty;
        f.obesity = +f.obesity;
        f.alcohol = +f.alcohol;
      });

    var yScale = d3.scaleLinear()
        .domain([Math.floor(Math.floor(getMin(d,"alcohol").alcohol)*.9), Math.ceil(Math.ceil(getMax(d,"alcohol").alcohol)*1.1)])
        .range([chartDim, 0]);
    
    var xScale = d3.scaleLinear()
        .domain([Math.floor(Math.floor(getMin(d,"poverty").poverty)*.9),Math.ceil(Math.ceil(getMax(d,"poverty").poverty)*1.1)]) 
        .range([0, chartDim]);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartDim})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    chartGroup.selectAll(".datapoint")
        .data(d)
        .enter()
        .append("circle")
        .classed("datapoint", true)
        .attr("cx", f => xScale(f.poverty))
        .attr("cy", f => yScale(f.alcohol))
        .attr("r", 10)
        .style("fill", "MediumAquaMarine")
        .style("stroke", "Grey");

        chartGroup.selectAll(".datatext")
        .data(d)
        .enter()
        .append("text")
        .classed("datatext", true)
        .attr("x", f => xScale(f.poverty))
        .attr("y", f => yScale(f.alcohol))
        .attr("text-anchor", 'middle')
        .attr("alignment-baseline", 'middle')
        .attr("stroke", "white")
        .attr("fill", "white")
        .attr("font-size", 7)
        .text(f=>f.abrev);

        chartGroup.append("text")
        .attr("transform", `translate(${chartDim / 2}, ${chartDim+35})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Poverty (% of inhabitants)");

        chartGroup.append("text")
        .attr("transform", `translate(${-30}, ${chartDim/2}) rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Alcohol consumption (% 20+ yrs)");

        chartGroup.append("text")
        .attr("transform", `translate(${chartDim / 2}, ${-20})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Poverty and alcohol consumption");

    }).catch(function(error) {
    console.log(error);
    });
