$(window).resize(function () {
	location.reload();
})

//Europe, Asia, America, Africa, Oceania
var dataset = [ [], [], [], [], [] ]
//data filter
var selectedData = [ [], [], [], [], [] ]
var selectedTags = [ "c#", "android", "mysql"]
var allTags = ["c#", "android", "mysql", "javascript", "html"]
var regions = [ "Africa", "America", "Asia", "Europe", "Oceania"]
var selectedRegions = [ "Africa", "America", "Asia", "Europe", "Oceania"]
var colors = [];
var colorFunction = d3.scale.category10();
for (var i = 0; i < 10; i++){
		colors[i] = colorFunction(i);
}

//css definitions
var width = Math.min(630, window.innerWidth/2)-5,
	height = Math.min(630, window.innerHeight/2)-40;
var margin = {top: height/6, right: width/8, bottom: height/6, left: width/8};

var parseDate = d3.time.format("%m/%Y").parse;

var g;

var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 120000,
  levels: 10,
  roundStrokes: true,
  color: (colorVector([0,1,2,3,4]).slice())
};

function colorVector(positions){
	var colorVector = [];
	for (var i = 0; i < positions.length; i++){
		colorVector.push(colors[positions[i]]);
	}
	return colorVector;
}

function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function type(d) {
  d.date = parseDate(d.date);
  selectedTags.forEach(function(c) { d[c] = +d[c]; });
  return d;
}

function setUpRadarData(){
	d3.csv("data/tag_count_by_region.csv", function(data) {
		data.map(function(d) { 
			if(d["Region"] == "Africa")
				dataset[0].splice(dataset[0].lenght-1, 0, {axis:d["TagName"],value:+d["Num"]});

			if(d["Region"] == "America")
				dataset[1].splice(dataset[1].lenght-1, 0, {axis:d["TagName"],value:+d["Num"]});

			if(d["Region"] == "Asia")
				dataset[2].splice(dataset[2].lenght-1, 0, {axis:d["TagName"],value:+d["Num"]});

			if(d["Region"] == "Europe")
				dataset[3].splice(dataset[3].lenght-1, 0, {axis:d["TagName"],value:+d["Num"]});
			
			if(d["Region"] == "Oceania")
				dataset[4].splice(dataset[4].lenght-1, 0, {axis:d["TagName"],value:+d["Num"]});
		});

		for(var i = 0; i < dataset.length; i++){
			for(var j = 0; j < dataset[i].length; j++){
				if(contains(selectedTags, dataset[i][j].axis)){
					selectedData[i].splice(selectedData[i].length, 0, {axis:dataset[i][j].axis,value:dataset[i][j].value});
				}
			}
		}

		//Call function to draw the Radar chart
		RadarChart(".radarChart", selectedData, radarChartOptions);
		ScatterPlot(selectedRegions);
	});
}

function updateTag(tagName){
	if(tagName == 'all'){
		if(selectedTags.length == allTags.length)
			removeAllTags();
		else addAllTags();
	}
	else
	if(contains(selectedTags, tagName)){
		removeTag(tagName);
	}
	else{
		addTag(tagName);
	} 
}

function addTag(tagName){
	var maxChartValue = 100;
	console.log("Adding " + tagName);
	selectedTags.splice(selectedTags.length, 0, tagName);


	for(var i = 0; i < selectedRegions.length; i++){
		var reg = regions.indexOf(selectedRegions[i]);
		for(var j = 0; j < dataset[reg].length; j++){
			if(tagName == dataset[reg][j].axis){
			selectedData[i].splice(selectedData[i].length, 0, {axis:dataset[reg][j].axis,value:dataset[reg][j].value});
			}
		}
	}

	console.log(selectedData)


	//Call function to draw the Radar chart
	RadarChart(".radarChart", selectedData, radarChartOptions);
	//barchart
	redrawBarChartData();

	if(selectedTags.length == allTags.length){
		$("#selectAllTags").html("Clear All Tags");
	}
}

function addAllTags(){
	selectedTags = allTags.slice();
	selectedData = [ [], [], [], [], [] ];
	updateRadarChartData(allTags);

	//Call function to draw the Radar chart
	RadarChart(".radarChart", selectedData, radarChartOptions);
	//barchart
	redrawBarChartData();


	$(".tagCheckbox input").prop('checked', true);
	$("#selectAllTags").html("Clear All Tags");
}

function removeAllTags(){

	selectedTags = [];
	selectedData = [ [], [], [], [], [] ];

	//Call function to draw the Radar chart
	RadarChart(".radarChart", selectedData, radarChartOptions);
	//barchart
	redrawBarChartData();

	$(".tagCheckbox input").prop('checked', false);
	$("#selectAllTags").html("Select All Tags");
}

function updateRadarChartData(tagArray){
	tagArray.forEach(function(tagName){
		for(var i = 0; i < selectedRegions.length; i++){
			var reg = regions.indexOf(selectedRegions[i]);
			for(var j = 0; j < dataset[reg].length; j++){
				if(tagName == dataset[reg][j].axis){
					selectedData[i].splice(selectedData[i].length, 0, {axis:dataset[reg][j].axis,value:dataset[reg][j].value});
				}
			}
		}
	})
}

function removeTag(tagName){
	
	for(var i = 0; i < selectedData.length; i++){
		for(var j = 0; j < selectedData[i].length; j++){
			if(tagName == selectedData[i][j].axis){
				selectedData[i].splice(j, 1);
			}
		}
	}

	for(var i = 0; i < selectedTags.length; i++){
		if(selectedTags[i] == tagName)
			selectedTags.splice(i, 1);
	}


	console.log(selectedTags)

	//Call function to draw the Radar chart
	RadarChart(".radarChart", selectedData, radarChartOptions);
	//barchart
	redrawBarChartData();

	$("#selectAllTags").html("Select All Tags");
}

function updateRegion(regionName){
	if(contains(selectedRegions, regionName)){
		console.log("Removing: " + selectedRegions.indexOf(regionName))
		selectedData.splice(selectedRegions.indexOf(regionName), 1);
		selectedRegions.splice(selectedRegions.indexOf(regionName), 1);
		$(".scatterBtns #checkbox" + (regions.indexOf(regionName)+5) + " input").prop('checked', false);
		$("#checkbox" + (regions.indexOf(regionName)+5) + " input").prop('checked', false);
		if(selectedRegions.length == 0)
			selectedData = [[]]
	} else {
		$(".scatterBtns #checkbox" + (regions.indexOf(regionName)+5) + " input").prop('checked', true);
		$("#checkbox" + (regions.indexOf(regionName)+5) + " input").prop('checked', true);
		selectedRegions.push(regionName);
		selectedRegions.sort();
		selectedData = []
		for(var i = 0; i < selectedRegions.length; i++){
			selectedData.push([]);
			console.log("pushed 1")
		}

		for(var i = 0, h=0; i < dataset.length; i++){
			if(contains(selectedRegions, regions[i]) ){
				for(var j = 0; j < dataset[i].length; j++){
					if(contains(selectedTags, dataset[i][j].axis)){
						console.log("i value: " + i)
						selectedData[h].splice(selectedData[h].length, 0, {axis:dataset[i][j].axis,value:dataset[i][j].value});
					}
				}
				h++;		
			}
		}

	}
	var positions = [];
	for(var i = 0; i < selectedRegions.length; i++){
		positions[i] = regions.indexOf(selectedRegions[i])
	}

	radarChartOptions.color = colorVector(positions);

	//Call function to draw the Radar chart
	RadarChart(".radarChart", selectedData, radarChartOptions);

	if($('#questions').hasClass('selected'))
		ScatterPlot(selectedRegions, 'questions');
	if($('#answers').hasClass('selected'))
		ScatterPlot(selectedRegions, 'answers');
	if($('#QA').hasClass('selected'))
		ScatterPlot(selectedRegions, 'QA');
	if($('#top').hasClass('selected'))
		ScatterPlot(selectedRegions, 'top');

	console.log(selectedData)
}

function setUpBarChartData(){

	$("#chart").html('');

	var width = Math.min(960, window.innerWidth/2)-80,
		height = Math.min(500, window.innerHeight*1.1/2)-5;

	var margin = {top: height/5, right: width/19, bottom: height/17, left: width/19};
	   

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width]);

	var y = d3.scale.linear()
	    .rangeRound([height, 0]);

	var z = d3.scale.category20();
	var color = [];

	for (var i = 0; i < 10; i++)
		color[i] = z(i);
	color.splice(6, 1);
	color.splice(2, 1);
	color.splice(0, 1);
	color.splice(2, 1);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .tickFormat(d3.time.format("%b"));

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(4)
	    .tickFormat(d3.format("s"));

	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	$('#chart').append('<p>Tags per Month - From January 2014 To September 2015</p>');
	d3.csv("data/tag_count_by_month.csv", type, function(error, dataC) {
	  if (error) throw error;
	  dataC.reverse();

	  var layers = d3.layout.stack()(selectedTags.map(function(c) {
	    return dataC.map(function(d) {
	      return {x: d.date, y: d[c], tag:c, date: d.date};
	    });
	  }));

	  x.domain(layers[0].map(function(d) { return d.x; }));
	  y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

	  var layer = svg.selectAll(".layer")
	      .data(layers)
	    .enter().append("g")
	      .attr("class", "layer")
	      .style("fill", function(d, i) { return color[allTags.indexOf(selectedTags[i])]; });

	  var tooltip = d3.select("#radar").append("div")
	      .attr("class", "tooltip")
	      .attr("id", "tooltipBarChart")
	      .style("opacity", 0);

  	  layer.selectAll("rect")
      .data(function(d,i) { d.forEach(function(c){ c.layer=i; }); return d; })
	    .enter().append("rect")
	      .attr("x", function(d) { return x(d.x); })
	      .attr("y", function(d) { return y(d.y + d.y0); })
	      .attr("height", 0)
	      .attr("width", x.rangeBand() - 1)
	      .on("mouseover", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html("Tag: " + d.tag + "<br/> Date: " + (d.date.getMonth()+1) + "/" + 
	            d.date.getFullYear() + "<br/> Tag Count: " + d.y)
	               	.style('left', d3.event.pageX+"px")
				    .style('top', d3.event.pageY+"px")
	                .style("text-align", "center")
	                .style("font-size", "large")
	                .style("background-color", function() { return color[allTags.indexOf(selectedTags[d.layer])]; });
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      })
	      .transition()
	        .delay(function(d) { return d.layer*500; })
	        .duration(800)
	      	.attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })

	  svg.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "axis axis--y")
	      //.attr("transform", "translate(" + width + ",0)")
	      .call(yAxis);
	});
}

function redrawBarChartData(){

	$("#chart").html('');

	var width = Math.min(960, window.innerWidth/2)-80,
		height = Math.min(500, window.innerHeight*1.1/2)-5;

	var margin = {top: height/5, right: width/19, bottom: height/17, left: width/19};

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width]);

	var y = d3.scale.linear()
	    .rangeRound([height, 0]);

	var z = d3.scale.category20();
	var color = [];
	for (var i = 0; i < 10; i++)
		color[i] = z(i);
	color.splice(6, 1);
	color.splice(2, 1);
	color.splice(0, 1);
	color.splice(2, 1);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .tickFormat(d3.time.format("%b"));

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(4)
	    .tickFormat(d3.format("s"));

	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	 $('#chart').append('<p>Tags per Month - From January 2014 To September 2015</p>');
	 d3.csv("data/tag_count_by_month.csv", type, function(error, dataC) {
	  if (error) throw error;
	  dataC.reverse();
	  monthDataset = dataC.slice();

	  var layers = d3.layout.stack()(selectedTags.map(function(c) {
	    return dataC.map(function(d) {
	      return {x: d.date, y: d[c], tag:c, date: d.date};
	    });
	  }));

	  if(selectedTags.length != 0)
	  	x.domain(layers[0].map(function(d) { return d.x; }));
	  else x.domain([0,20]);
	  if(selectedTags.length != 0)
	  	 y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();
	  else y.domain([0,100000]);

	  var layer = svg.selectAll(".layer")
	      .data(layers)
	    .enter().append("g")
	      .attr("class", "layer")
	      .style("fill", function(d, i) { return color[allTags.indexOf(selectedTags[i])]; });

	  var tooltip = d3.select("#radar").append("div")
	      .attr("class", "tooltip")
	      .attr("id", "tooltipBarChart")
	      .style("opacity", 0);

	  layer.selectAll("rect")
	      .data(function(d,i) { d.forEach(function(c){ c.layer=i; }); return d; })
	    .enter().append("rect")
	      .attr("x", function(d) { return x(d.x); })
	      .attr("y", function(d) { return y(d.y + d.y0); })
	      .attr("height", 0)
	      .attr("width", x.rangeBand() - 1)
	      .on("mouseover", function(d) {
	         tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html("Tag: " + d.tag + "<br/> Date: " + (d.date.getMonth()+1) + "/" + 
	            d.date.getFullYear() + "<br/> Tag Count: " + d.y)
	               	.style('left', d3.event.pageX+"px")
				    .style('top', d3.event.pageY+"px")
	                .style("text-align", "center")
	                .style("font-size", "large")
	                .style("background-color", function() { return color[allTags.indexOf(selectedTags[d.layer])]; });
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      })
	      .transition()
	        .delay(function(d, i) { return d.layer*500; })
	        .duration(800)
	      	.attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })


	  svg.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "axis axis--y")
	      //.attr("transform", "translate(" + width + ",0)")
	      .call(yAxis);
	});
}

$(document).ready(function () {
        setUpRadarData();
        setUpBarChartData();
	});
