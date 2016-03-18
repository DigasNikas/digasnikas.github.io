function ScatterPlot(selectedRegions, mode){
  var margin = {top: 20, right: 20, bottom: 30, left: 70},
    width = 750 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

$('.scatterPlot').html('');
if(selectedRegions == undefined)
  selectedRegions = [""];

if(mode == '' || mode == undefined)
  mode = 'questions';

// setup x 
var xValue = function(d) { return d.users;}, // data -> value
    xScale = d3.scale.log().range([0, width]), // value -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.questions;}, // data -> value
    yScale = d3.scale.log().range([height, 0]), // value -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
    color = d3.scale.category10();
    color('Africa');
    color('America');
    color('Asia');
    color('Europe');
    color('Oceania');

// add the graph canvas to the body of the webpage
var svg = d3.select(".scatterPlot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

$('.scatterPlot').append("<p>Hover for more info.</p>");

// add the tooltip area to the webpage
var tooltip = d3.select(".scatterPlot").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// load data
d3.csv("data/Dataset_scatterPlot.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.questions = +d.questions;
    d.answers = +d.answers;
    d.QA = +d.QA;
    d.users = +d.users;
    d.top = +d.top;
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  xAxis.tickValues([5,10,20,40,80,160,320,640,1200,2500,5100,10200,20400,40900,81900,165000]).tickFormat(d3.format("s"));
  
  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Users");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Questions");

  // draw dots
 var dot = svg.selectAll(".dot")
      .data(data)
    .enter()
	.append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
	  .datum( function(d) {
        return {x: d.users, y: d.questions, m: d.region,c: d.country,a: d.answers,q: d.QA, t: d.top} // change data, to feed to the fisheye plugin
    })
      .attr("cx", function(d) { return xScale(d.x);})
      .attr("cy", function(d) { return yScale(d.y);})
      .style("fill", function(d) { return color(d.m);}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.c + "<br/> " + d.x + " Users<br/>" + d.y + " Questions")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px")
               .style("background-color", color(d.m));
          d3.select(this).transition()
          	.duration(2000)
          	.attr("r", 30)
          		.attr("z-index", 100);
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
          d3.select(this).transition()
          	.duration(500)
          	.attr("r", 3.5)
          		.attr("z-index", 10);
      });

  // // draw legend
  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  // // draw legend colored rectangles
  // legend.append("rect")
  //     .attr("x", width-20)
  //     .attr("y", 300)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // // draw legend text
  // legend.append("text")
  //     .attr("x", width-25)
  //     .attr("y", 305)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d;});

	
	d3.selectAll("#answers")
    .on("click", function(){
        $(".scatterBtns span").removeClass("selected");
        $(this).toggleClass("selected");
        $(".y text.label").text("Answers");
        $('#scatterTitle').html('Number of Answers per Country');
        buildGeoMap('answers', selectedRegions);

        //update axis
        var yScaleA = d3.scale.log().clamp(true).domain([1, 3500000]).range([height, 0]);
        var yAxisA = d3.svg.axis().scale(yScaleA).orient("left");
        yAxisA.tickValues([5, 10, 20, 40, 80, 160, 320, 640,1200,2500,5100,10200,20400,40900,81900,163800,327600,655200, 1310400, 3500000]).tickFormat(d3.format("s"));
        
        svg.select(".y.axis")
          .transition()
          .duration(1000)
          .call(yAxisA);

        var xScaleA = d3.scale.log().range([0, width]).domain([2, 167000]) // value -> display
        var xAxisA = d3.svg.axis().scale(xScaleA).orient("bottom");
        xAxisA.tickValues([5, 10, 20, 40,80,160,320,640,1200,2500,5100,10200,20400,40900,81900,167000]).tickFormat(d3.format("s"));

        svg.select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxisA);

        var dots = svg.selectAll(".dot");
        dots
          .transition()
          .duration(1000)
          .attr("cx", function(d) { return xScaleA(d.x);})
          .attr("cy", function(d) { 
            if(contains(selectedRegions, d.m))
              return yScaleA(d.a);
            else
              return 10000;
          });

      dots
        .on("mouseover", function(d) {
              dots.style("fill", function(value) {
                if(value != d)
                  return color("#696969");
                else 
                  return color(value.m);
              });
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d.c + "<br/> " + d.x + " Users<br/>" + d.a + " Answers")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px")
               	   .style("background-color", color(d.m));
              d3.select(this).transition()
          		.duration(300)
          		.attr("r", 20)
          		.attr("z-index", 100);
          })
          .on("mouseout", function(d) {
            dots.style("fill", function(value) { return color(value.m); });
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
              d3.select(this).transition()
          		.duration(500)
          		.attr("r", 3.5)
          		.attr("z-index", 10);
          });
       });
	
	d3.selectAll("#questions")
  	.on("click", function(){
        $(".scatterBtns span").removeClass("selected");
        $(this).toggleClass("selected");
        $(".y text.label").text("Questions");
        $('#scatterTitle').html('Number of Questions per Country');
        buildGeoMap('questions', selectedRegions);

        //update axis
        var yScaleQ = d3.scale.log().domain([1, 1000000]).range([height, 0]);
        var yAxisQ = d3.svg.axis().scale(yScaleQ).orient("left");
        yAxisQ.tickValues([5,10,20,40,80,160,320,640,1200,2500,5100,10200,20400,40900,81900,163800,327600,655200, 1000000]).tickFormat(d3.format("s"));

        svg.select(".y.axis")
          .transition()
          .duration(1000)
          .call(yAxisQ);

        var xScaleQ = d3.scale.log().range([0, width]).domain([2, 167000]) // value -> display
        var xAxisQ = d3.svg.axis().scale(xScaleQ).orient("bottom");
        xAxisQ.tickValues([5, 10, 20, 40,80,160,320,640,1200,2500,5100,10200,20400,40900,81900,167000]).tickFormat(d3.format("s"));

        svg.select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxisQ);

        var dots = svg.selectAll(".dot");
        dots
          .transition()
          .duration(1000)
          .attr("cx", function(d) { return xScaleQ(d.x);})
          .attr("cy", function(d) { 
            if(contains(selectedRegions, d.m))
              return yScaleQ(d.y);
            else
              return 10000;
          });

      dots
        .on("mouseover", function(d) {
              dots.style("fill", function(value) {
                if(value != d)
                  return color("#696969");
                else 
                  return color(value.m);
              });
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d.c + "<br/> " + d.x + " Users<br/>" + d.y + " Questions")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px")
               		.style("background-color", color(d.m));
              d3.select(this).transition()
                .duration(300)
                .attr("r", 20)
                .attr("z-index", 100);
          })
          .on("mouseout", function(d) {
            dots.style("fill", function(value) { return color(value.m); });
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
              d3.select(this).transition()
          		.duration(500)
          		.attr("r", 3.5)
          		.attr("z-index", 10);
          });
  	   });
	
	d3.selectAll("#QA")
  	.on("click", function(){
      $(".scatterBtns span").removeClass("selected");
      $(this).toggleClass("selected");
      $(".y text.label").text("Q/A ratio");
      $('#scatterTitle').html('Q/A Ratio per Country <h5>Higher ratio means more answers than questions.</h5>');
      buildGeoMap('QA', selectedRegions);

      //update axis
      var yScaleQA = d3.scale.linear().domain([-100, 100]).range([height, 0]);
      var yAxisQA = d3.svg.axis().scale(yScaleQA).orient("left");
      yAxisQA.tickValues([-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100]).tickFormat(d3.format("s"));

      svg.select(".y.axis")
        .transition()
        .duration(2000)
        .call(yAxisQA);

      var xScaleQA = d3.scale.log().range([0, width]).domain([2, 167000]) // value -> display
      var xAxisQA = d3.svg.axis().scale(xScaleQA).orient("bottom");
      xAxisQA.tickValues([5, 10, 20, 40,80,160,320,640,1200,2500,5100,10200,20400,40900,81900,167000]).tickFormat(d3.format("s"));

      svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxisQA);

      var dots = svg.selectAll(".dot");
  		dots
        .transition()
  		  .duration(2000)
        .attr("cx", function(d) { return xScaleQA(d.x);})
  		  .attr("cy", function(d) { 
            if(contains(selectedRegions, d.m))
              return yScaleQA(d.q);
            else
              return 10000;
          });

      dots
        .on("mouseover", function(d) {
              dots.style("fill", function(value) {
                if(value != d)
                  return color("#696969");
                else 
                  return color(value.m);
              });
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d.c + "<br/> " + d.x + " Users<br/>" + d.q + " Q/A ratio")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px")
               	   .style("background-color", color(d.m));
              d3.select(this).transition()
            		.duration(300)
            		.attr("r", 20)
            		.attr("z-index", 100);
          })
          .on("mouseout", function(d) {
            dots.style("fill", function(value) { return color(value.m); });
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
              d3.select(this).transition()
          	       	.duration(500)
          			.attr("r", 3.5)
          			.attr("z-index", 10);
          });
  	  });

    d3.selectAll("#top")
    .on("click", function(){
      $(".scatterBtns span").removeClass("selected");
      $(this).toggleClass("selected");
      $(".y text.label").text("Top Users");
      $('#scatterTitle').html('Number of Top250 Users per Country <h5>In StackOverflow users get points for certain actions</h5>');
      buildGeoMap('top', selectedRegions);
      //update axis
      var yScaleTop = d3.scale.log().domain([0.4, 200]).range([height, 0]);
      var yAxisTop = d3.svg.axis().scale(yScaleTop).orient("left");
      yAxisTop.tickValues([1, 2, 5, 10, 20, 40, 80, 130, 200]).tickFormat(d3.format("s"));

      svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxisTop);

        var xScaleTop = d3.scale.log().range([0, width]).domain([40, 167000]) // value -> display
        var xAxisTop = d3.svg.axis().scale(xScaleTop).orient("bottom");
        xAxisTop.tickValues([40,80,160,320,640,1200,2500,5100,10200,20400,40900,81900,167000]).tickFormat(d3.format("s"));

      svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxisTop);

      var dots = svg.selectAll(".dot");
      dots
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScaleTop(d.x);})
        .attr("cy", function(d) { 
          if(d.t > 0 && contains(selectedRegions, d.m))
            return yScaleTop(d.t)
          else
            return 1000;
        });

      dots
        .on("mouseover", function(d) {
              dots.style("fill", function(value) {
                if(value != d)
                  return color("#696969");
                else 
                  return color(value.m);
              });
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d.c + "<br/> " + d.x + " Users<br/>" + d.t + " Top Users")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px")
               .style("background-color", color(d.m));
              d3.select(this).transition()
                .duration(300)
                .attr("r", 20)
                .attr("z-index", 100);
          })
          .on("mouseout", function(d) {
            dots.style("fill", function(value) { return color(value.m); });
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
              d3.select(this).transition()
          			.duration(500)
          			.attr("r", 3.5)
          			.attr("z-index", 10);
          });
    });
  if(mode == 'questions')
    $("#questions").click();
  if(mode == 'answers')
    $("#answers").click();
  if(mode == 'QA')
    $("#QA").click();
  if(mode == 'top')
    $("#top").click();
});
}

function buildGeoMap(column, selectedRegions) {
  $('.geomap').html('');

  function format(d) {
      return d3.format(',d')(d);
  }

  var questionsColor = ["#f7f7f7","#cb181d"]; //["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
  var answersColor = ["#f7f7f7","#2171b5"];

  var transitionDuration = 1000;
  var colorValues = questionsColor;
  var scale = d3.scale.log;
  var domain = [1, 1000000];

  if(column == 'answers')
  {
    colorValues = answersColor;
    scale = d3.scale.log;
    domain = [1, 1000000]
  }

  if(column == 'QA')
  {
    //colorValues = ['#b2182b','#AC1933','#A61B3C','#A01D45', '#9A1F4E', '#762A83', '#4A3BBB', '#423EC4','#3B41CE','#3444D7','#2171B5'];
    colorValues = colorbrewer.RdBu[9];

    transitionDuration = 2500;
    scale = d3.scale.quantize;
    domain = [-50,50];
  }

  if(column == 'top')
  {
    colorValues = colorbrewer.YlGn[3];
    scale = d3.scale.log;
    domain = [1,3]
  }

  var map = d3.geomap.choropleth()
      .geofile('d3-geomap/topojson/world/countries.json')
      .format(format)
      .colors(colorValues)
      .height(650)
      .domain(domain)
      .duration(transitionDuration)
      .column(column)
      .scale(180)
      .legend(false)
      //.legend({width: 100, height: 250})
      .valueScale(scale)
      .unitId('id');

  d3.csv('data/Dataset_scatterPlot.csv', function(error, data) {

      data.forEach(function(d) {
        if(!contains(selectedRegions, d.region))
          d[column] = undefined;
      });

      d3.select('.geomap')
          .datum(data)
            .call(map.draw, map);
    $('.geomap').append("<p>Click to zoom.</p>");
  });

}

