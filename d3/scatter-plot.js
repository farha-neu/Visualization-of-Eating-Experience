//parse date and time
var parseDate = d3.timeParse("%m/%d/%Y");
var parseTime = d3.timeParse("%I:%M:%S %p");
//this is for x-axis label
var formatTime = d3.timeFormat("%b %d, %Y");


//var colorScale = d3.scaleOrdinal(d3.schemeCategory10); // farha version
var colorScale = d3.scaleOrdinal()
    .domain(['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack'])
    .range(['#1b9e77','#d95f02', '#7570b3', '#e7298a', '#66a61e']);
var click = false;
var clickedPoint;


// Get the data
d3.csv("d3/eating-experience.csv")
    .row(function(d){
        var p = d["Photos of your meal"];
        var user = d["Email Address"];

        if(user==="farhajw@gmail.com"){
              user="farhajw";
        }
        else if(user==="khalidjawed380@gmail.com"){
              user= "khalidjawed";
        }
        else if(user==="xiaohuiforpad@gmail.com"){
               user = "xiaohui";
        }
        else if(user==="uranusbean@gmail.com"){
               user = "uranusbean";
        }
        else if(user==="liubinghappy@gmail.com"){
               user = "binbin";
        }
        else if(user==="mengyuesun@gmail.com"){
               user = "mengyue";
        }
        else if(user==="sunyifan112358@gmail.com"){
               user = "ysun";
        }
        else if(user==="kimani.e@husky.neu.edu"){
               user = "kimani.e";
        }
        else if(user==="nusaybah1410@gmail.com"){
               user = "nusaybah";
        }

        return {
           // username: d["Email Address"].split('@', 1)[0],
            // username: d["Email Address"].substring(0, 6),
            username: user,
            date: parseDate(d["Today's Date"]),
            time: parseTime(d["Started eating at "]),
            mealType: d["Meal type "],
            food: d["What are (or did) you eating? (food + drink)"],
            satisfaction: Number(d["How do you like the food? "]),
            hungerBefore: Number(d["How hungry were you before eating?"]),
            hungerAfter: Number(d["How hungry were you after eating?"]),
            distraction: d["While eating, I am also doing the following things"],
            weather: d["What is the weather like during the meal?"],
            location: d["Where are you eating?"],
            effort: d["How is (was) your eating effort?  "],
            company: d["Who are you eating with?"],
            photo: p ? "https://drive.google.com/uc?export=view&id="+d["Photos of your meal"].split("?id=").pop() : p,
            mooddetails: d["How do you feel today (in general)?"],
            mood: d["Mood"]
            //add others as needed
            };
       })

    .get(function(error,data){


   // code for dropdown
   var dropdown = d3.select("#username_select")
                  .on("change", onchange);

   //get unique usernames
   var users = d3.map(data, function(d){return d.username;}).keys();
   users.push("-- Choose a person --");
   users.sort();

   //dropdown onchange()
   function onchange() {
      clearLineAndBar();
      selectValue = d3.select('select').property('value');
      if(selectValue!=='default'){
          var info = data.filter(d => d.username===selectValue);
          createScatters(info);
      }
      //if default value selected, populate plots with whole dataset
      else{
          createScatters(data);
  }};
  //populate dropdown menu
   dropdown.selectAll("option")
           .data(users)
           .enter().append("option")
           .attr("value", function (d) { if(d==="-- Choose a person --") return "default"; else return d; })
           .text(d=>d);

  //code for reset button
  $("#reset").on("click", function () {
    $('#username_select option').prop('selected', function() {
      //create scatter
  	  createScatters(data);
      //clear existing line and bar graphs
  	  clearLineAndBar();
      return this.defaultSelected;
   });
 });

//create two scatterplots initially
createScatters(data);


function createScatters(data){

	  d3.selectAll(".svgBrushScatter").remove();
	  clearLinkedScatterPlot();

    var height = 190;
    var width = 600;
    var margin = {left:80,right:20,top:20,bottom:50};

    var minDate = d3.min(data,function(d){ return d.date; });
    var maxDate = d3.max(data,function(d){ return d.date; });

    var minTime = d3.min(data,function(d){ return d.time; });
    var maxTime = d3.max(data,function(d){ return d.time; });

    // setup fill color on meal type
    var colorValue = d => d.mealType;


    var svg = d3.select("#smallScatter")
              .append("svg")
              .attr("width",width)
              .attr("height",height)
              .attr("class","svgBrushScatter");

    //create a border
    var borderPath = svg.append("rect")
					  .attr("x", margin.left)
					  .attr("y", margin.top)
					  .attr("height", height-margin.bottom-margin.top)
					  .attr("width", width-margin.right-margin.left)
					  // .style("stroke","grey")
					  // .style("fill", "lightgrey")
            .style("fill", "#e0e0e0")
					  .style("stroke-width", 1);


   var xScale = d3.scaleTime()
          .domain([d3.timeDay.offset(minDate, -1),d3.timeDay.offset(maxDate, 1)])
          .rangeRound([margin.left, width - margin.right]);

   var yScale = d3.scaleTime()
              .domain([d3.timeHour.offset(minTime, -1),d3.timeHour.offset(maxTime, 1)])
              .rangeRound([height-margin.bottom, margin.top]);

   var xAxis = svg.append("g")
                  .attr("class", "axisScatter")
                  .attr("transform","translate(0,"+(height-margin.bottom)+")")
                  .call(d3.axisBottom().tickFormat(d3.timeFormat("%b %d"))
                  .scale(xScale).ticks(3).tickPadding(5));

   var yAxis = svg.append("g")
                 .attr("class", "axisScatter axisScatter-y")
                 .attr("transform","translate("+margin.left+",0)")
                 .call(d3.axisLeft().tickFormat(d3.timeFormat("%I %p"))
                 .scale(yScale).tickPadding(5).ticks(1));

   var circles = svg.selectAll("circle")
                     .data(data)
                     .enter()
                     .append("circle")
                         .attr("cx", function(d){ return xScale(d.date); })
                         .attr("cy", function(d){ return yScale(d.time); })
                         .attr("r",4)
                         .style('fill', function(d){ d.color = colorScale(colorValue(d)); return d.color; })
                         .style("opacity", 0.6)
                         .attr("class", "non_brushed")

  createLinkedScatter(data);


  // brushing
   function highlightBrushedCircles(){
      if (d3.event.selection != null) {
          // revert circles to initial style
          circles.style("fill", function(d) { return colorScale(colorValue(d)); })
                  .style("opacity", 0.6)
                  .attr("class", "non_brushed");

          var brush_coords = d3.brushSelection(this);

          // style brushed circles
          circles.filter(function (){
                 var cx = d3.select(this).attr("cx"),
                     cy = d3.select(this).attr("cy");
                 return isBrushed(brush_coords, cx, cy);
             })
             .style("fill","grey")
             .attr("class", "brushed");
      }
   }

  function linkedView() {
        if (!d3.event.selection){
            circles.style("fill", function(d) { return colorScale(colorValue(d)); });
            createLinkedScatter(data);
        }
        else{
            var d_brushed =  d3.selectAll(".brushed").data();

            if (d_brushed.length > 0) {
                createLinkedScatter(d_brushed);
            } else {
                clearLinkedScatterPlot();
                clearLineAndBar();
            }
     }
  }

   var brush = d3.brush()
                .on("brush", highlightBrushedCircles)
                .on("end", linkedView);

   svg.append("g")
     .call(brush);

}}); //end of createScatters


//returns brushed co-ordinates
function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}


function createLinkedScatter(d_brushed) {

      clearLinkedScatterPlot();
      clearLineAndBar();

      click=false;

      var data = d_brushed;

    	//set width, height, margin
    	var height = 530;
    	var width = 600;
    	var margin = {left:80,right:20,top:40,bottom:20};

      // tooltip hidden initially with opacity 0
      var tooltip = d3.select("#largeScatter").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

       // need to adjust
       var minDate = d3.min(data,function(d){ return d.date; });
       var maxDate = d3.max(data,function(d){ return d.date; });

       var minTime = d3.min(data,function(d){ return d.time; });
       var maxTime = d3.max(data,function(d){ return d.time; });


       svg = d3.select("#largeScatter")
                  .append("svg")
                  .attr("width",width)
                  .attr("height",height)
                  .attr("class","svgLinkedScatter");


       borderPath = svg.append("rect")
							  .attr("x", margin.left)
							  .attr("y", margin.top)
							  .attr("height", height-margin.bottom-margin.top)
							  .attr("width", width-margin.right-margin.left)
							  // .style("stroke","grey")
                .style("stroke", "#f1f1f1")
							  .style("fill", "#f9f9f9")
							  .style("stroke-width", 1.5);

      var xScale = d3.scaleTime()
                     .domain([d3.timeDay.offset(minDate, -1),d3.timeDay.offset(maxDate, 1)])
                     .rangeRound([margin.left, width - margin.right]);


      var yScale = d3.scaleTime()
                     .domain([d3.timeHour.offset(minTime, -1),d3.timeHour.offset(maxTime, 1)])
                     .range([height-margin.bottom, margin.top]);


      var xAxis = svg.append("g")
                      .attr("class", "axisScatter")
                      .attr("transform","translate(0,"+(height-margin.bottom)+")")
                      .call(d3.axisBottom().tickFormat(d3.timeFormat("%b-%d")).tickPadding(5)
                      .scale(xScale).ticks(6).tickPadding(5));


      var yAxis = svg.append("g")
                     .attr("class", "axisScatter")
                     .attr("transform","translate("+margin.left+",0)")
                     .call(d3.axisLeft().tickFormat(d3.timeFormat("%I:%M %p")).scale(yScale).tickPadding(5)
                     .scale(yScale).ticks(8).tickPadding(8));


      var circles = svg.selectAll("circle")
                         .data(data)
                         .enter()
                         .append("circle")
                             .attr("cx", function(d){ return xScale(d.date); })
                             .attr("cy", function(d){ return yScale(d.time); })
                             .attr("r",6)
                             .style('fill', d => d.color)
                             .style("opacity", 0.8)
                             .style("stroke-width",0.5)
                            //  .style("stroke","black")
                             .attr("class", "brushed_data")
                             .on("mouseover", function(d){
                                d3.select(this)
                                  .style("opacity",0.8)
                                  .style("fill","grey");
                                   var html  = "<b>Username: </b>"+d.username+"<br><b>Date: </b>"+formatTime(d.date)+"<br>";
                                   if(d.photo){
                                     html = html+"<img src="+d.photo+" class='tooltipImg'/>";
                                   }
                                   html = html+"<b>Food: </b>"+d.food+"<br><b>Weather: </b>"+d.weather+"<br>"+
                                   "<b>Distraction: </b>"+d.distraction+"<br>"+
                                   "<b>Company: </b>"+d.company;

                                tooltip.html(html)
                                   // needs absolute positioning....to be corrected
                                    .style("top", (d3.event.pageY - 10) + "px")
                                    .style("left", (d3.event.pageX + 15) + "px")
                                  .transition()
                                    .duration(200) // ms
                                    .style("opacity", 1) // started as 0!

                              })
                             .on("mouseout", function(d){
                             	if(click ===false){
	                                d3.select(this)
	                                 .style('fill', d => d.color)
	                                 .style("opacity", 0.8);
	                             }
	                             else{
	                             	d3.select(this)
	                               	.style('fill', d => d.color)
	                             	  .style("opacity",function(d){ return (this ===clickedPoint)? 1:0.2});
	                             }

                                 tooltip.transition()
                                 .duration(200) // ms
                                 .style("opacity", 0);
                            })
                              .on("click", function(d){
                              	clickedPoint = this;
                              	d3.selectAll(".brushed_data")
                                  .attr("r",6)
                              	  .attr("fill",d=>d.color)
                                  .style("opacity",function(d){ return (this ===clickedPoint)? 1:0.2});

                                d3.select(this)
                                 .attr("r",10);

                                  click=true;
                                  createLineGraph(d);
                                  createBarPlot(d);
                            });



    // text label for the y axis
    svg.append("text")
        .attr("class","label")
        .attr("transform", "translate(0,"+ (height/2)+") rotate(-90)")
        .attr("dy", ".8em")
        .style("text-anchor", "middle")
        .text("Time");

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate("+(-400+i*95) + ",0)"; });

    // draw legend colored circles
    legend.append("circle")
        .attr('class', 'legendCircle')
        .attr("cx", 505)
        .attr("cy", 10)
        .attr("r", 8)
        .style("fill", colorScale)
        .style("opacity", 0.8);

    // draw legend text
    legend.append("text")
        .attr("x", width-80)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d=>d);



function createLineGraph(datum){

    clearLineAndBar();
		var height = 305;
		var width = 600;
		var margin = {left:50,right:20,top:40,bottom:50};

    // tooltip for area
    var tooltipHunger = d3.select("#linePlot").append("div")
          .attr("class", "tooltipHunger")
          .style("opacity", 0);

    //filtered data
    var dataN = data.filter(d => d.mealType===datum.mealType && d.username===datum.username && d.hungerAfter>0 && d.hungerBefore>0);

    //take color for fill
    var color = dataN[0].color;

    //for header
    var html= datum.username+" 's "+datum.mealType+"";
    var p = d3.select("#headerText").append("p").attr("class","head").style("color",color).html(html);
    d3.selectAll(".title").style("visibility","visible");


    //calculating avg hunger level for tooltip
    var total=0;
    dataN.forEach(function(d){
        	hungerlevel=Math.abs(d.hungerAfter-d.hungerBefore);
        	total+=hungerlevel;
    });

    total = Math.round(total/dataN.length);


    var minDate = d3.min(dataN,function(d){ return d.date; });
    var maxDate = d3.max(dataN,function(d){ return d.date; });

    svg = d3.select("#linePlot")
            .append("svg")
            .attr("width",width)
            .attr("height",height)
            .attr("class","svgLine");

    var xScale = d3.scaleTime()
          .domain([minDate,maxDate])
          .rangeRound([margin.left, width - margin.right]);

    var yScale = d3.scaleLinear()
                 .domain([1,10])
                 .range([height-margin.bottom, margin.top]);

   	var area = d3.area()
		    	  .x(function(d) {return xScale(d.date); })
		      	.y0(function(d) { return yScale(d.hungerBefore); })
		      	.y1(function(d) { return yScale(d.hungerAfter); });

    var area1 = d3.area()
            .x(function(d) {return xScale(d.date); })
            .y0(function(d) { return yScale(4); })
            .y1(function(d) { return yScale(7); });


   var xAxis = svg.append("g")
                .attr("class", "axisLine-x")
                .attr("transform","translate(0,"+(height-margin.bottom)+")")
                .call(d3.axisBottom().tickFormat(d3.timeFormat("%b-%d")).scale(xScale).tickPadding(5));


   var yAxis = svg.append("g")
                .attr("class", "axisLine-y")
                .attr("transform","translate("+margin.left+",0)")
                .call(d3.axisLeft().scale(yScale).ticks(10).tickPadding(5)
                .scale(yScale).tickSizeInner(-width+margin.left+margin.right).tickSizeOuter(0));

	 var hungerBeforeLine = d3.line()
		  	.x(function(d) { return xScale(d.date); })
		  	.y(function(d) { return yScale(d.hungerBefore); });

	 var hungerAfterLine = d3.line()
		  	.x(function(d) { return xScale(d.date); })
		  	.y(function(d) { return yScale(d.hungerAfter); });


   //Area in between
  	var drawarea = svg.append("path")
    	.datum(dataN)
    	.style("fill", color)
    	.style("opacity",0.3)
    	.attr("d", area);
 

  //Area in between
    var drawarea1 = svg.append("path")
      .datum(dataN)
      .style("fill", "grey")
      .style("opacity",0.3)
      .attr("d", area1);

  //Data join for paths
	var drawHungerBeforeLine = svg.append("path")
  	.datum(dataN)
  	.attr("class", "hungerBeforeLine")
  	.attr("d", hungerBeforeLine);


	//Data join for paths
	var drawHungerAfterLine = svg.append("path")
  	.datum(dataN)
  	.attr("class", "hungerAfterLine")
  	.attr("d", hungerAfterLine);


	 // Add the scatterplot
    svg.selectAll("dot")
        .data(dataN)
      .enter().append("circle")
        .attr("r",function(d){return (d===datum)? 10:6;})
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.hungerBefore); })
        .style("opacity",function(d){return (d===datum)? 1:0.3;})
        .style("fill",color)
        .on("mouseover",function(d){
              d3.select(this)
              .transition().duration(300)
              // .style("fill","grey")
              .style("opacity",1);

              var html  ="<b>Hunger Level Before Meal: </b>"+d.hungerBefore+
                         "<br><b>Hunger Level After Meal: </b>"+d.hungerAfter+
                         "<br><b>Mood: </b>"+d.mooddetails;

                        tooltipHunger.html(html)
                            .style("top", (d3.event.pageY - 10) + "px")
                            .style("left", (d3.event.pageX +15) + "px")
                          .transition()
                            .duration(200) // ms
                            .style("opacity", 1) // started as 0!

            })
            .on("mouseout",function(d){
                d3.select(this)
                   .transition()
                   .duration(200)
                  .style("fill", d=>d.color)
                  .style("opacity",function(d){return (d===datum)? 1:0.3;})

              tooltipHunger.transition()
              .duration(200) // ms
              .style("opacity", 0);

    });


   svg.selectAll("dot")
        .data(dataN)
      .enter().append("circle")
        .attr("r",function(d){return (d===datum)? 10:6;})
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.hungerAfter); })
        .style("opacity",function(d){return (d===datum)? 1:0.3;})
        .style("fill",color)
        .on("mouseover",function(d){
              d3.select(this)
              .transition().duration(300)
              // .style("fill","grey")
              .style("opacity",1);

              var html  ="<b>Hunger Level Before Meal: </b>"+d.hungerBefore+
                         "<br><b>Hunger Level After Meal: </b>"+d.hungerAfter+
                         "<br><b>Mood: </b>"+d.mooddetails;

                        tooltipHunger.html(html)
                            .style("top", (d3.event.pageY - 10) + "px")
                            .style("left", (d3.event.pageX +15) + "px")
                          .transition()
                            .duration(200) // ms
                            .style("opacity", 1) // started as 0!

            })
            .on("mouseout",function(d){
                d3.select(this)
                  .transition()
                  .duration(200)
                  .style("fill", d=>d.color)
                  .style("opacity",function(d){return (d===datum)? 1:0.3;})

              tooltipHunger.transition()
              .duration(200) // ms
              .style("opacity", 0);

    });

   // text label for the x axis
  //  svg.append("text")
  //      .attr("class","label")
  //      .attr("transform","translate(" + (width/2) + " ," + (height-5) + ")")
  //      .attr("dy", "-0.5em")
  //      .style("text-anchor", "middle")
  //      .text("Date[2018]");

  // text label for the y axis
  svg.append("text")
        .attr("class","label")
        .attr("transform", "translate(0,"+ (height/2)+") rotate(-90)")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Hunger Level Before and After Meals");

  // svg.append("text")
  //       .attr("class","label")
  //       .attr("transform", "translate("+(width-margin.right)+","+ (height/2+18)+") rotate(-90)")
  //       .attr("dy", "1.4em")
  //       .style("text-anchor", "middle")
  //       .text("Ideal Zone*");


  var legendArray = [{color:"#c51b8a",name:"Hunger Level Before Meal"},{color:"#636363",name:"Hunger Level After Meal"}];

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(legendArray)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate("+(-400+i*250) + ",-20)"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width-100)
      .attr("y",30)
      .attr("width", 40)
      .attr("height", 3)
      .style("fill", d=>d.color)
      .style("opacity", 0.8);

  // draw legend text
  legend.append("text")
      .attr("x", width-55)
      .attr("y", 30)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d.name;})
    }

function createBarPlot(datum){

    var height = 300;
    var width = 600;
    var margin = {left:50,right:20,top:50,bottom:70};

     //filtered data
    var filterdata = data.filter(d => d.mealType===datum.mealType && d.username===datum.username && d.satisfaction>0);

    var minDate = d3.min(filterdata,function(d){ return d.date; });
    var maxDate = d3.max(filterdata,function(d){ return d.date; });

    // var minSat = d3.min(filterdata,function(d){ return d.satisfaction; }); // minimum Satisfaction value
    // var maxSat = d3.max(filterdata,function(d){ return d.satisfaction; }); // maximum Satisfaction value

    svg = d3.select("#viz")
                  .append("svg")
                  .attr("width",width)
                  .attr("height",height)
                  .attr("class","svgBar");
    //show icons div
    var imageDiv = d3.select("#imageDiv")
                     .attr("class","imageDiv")
                     .style("opacity",1);

    var xScale = d3.scaleBand()
            .domain(filterdata.map(function(d) { return d.date; }))
            //.paddingOuter(0.6)
            .rangeRound([margin.left, width - margin.right]).padding(0.1);

  var yScale = d3.scaleLinear()
            .domain([1, 7])
            .range([height - margin.bottom, margin.top]);

   //create Axis
   var xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform","translate(0,"+(height-margin.bottom)+")")
        .call(d3.axisBottom().tickFormat(d3.timeFormat("%b-%d")).ticks(4).scale(xScale).tickPadding(5))
           .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-60)");

   var yAxis = svg.append("g")
            .attr("class", "axis")
            .attr("transform","translate("+margin.left+",0)")
            .call(d3.axisLeft().ticks(7).scale(yScale));

   var tooltip = d3.select("#viz").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

   //start icons
   function splitEffort(dd){
        return dd.effort.toLowerCase().trim().replace(/\s/g,'').split(',');
   }

  function initDiv(){
     d3.selectAll(".icon").style("filter","grayscale(100%)").style("opacity",0.2);
  }

  function colorIt(x){
      var commaSplit = splitEffort(x);
      if(commaSplit[0]!==""){
            commaSplit.forEach(function(entry){
                d3.select("#"+entry).transition()
                  .duration(300).style("filter","none").style("opacity",1.0);
                d3.select("#cap"+entry).transition()
                  .duration(300).style("filter","none").style("opacity",1.0);
                });
          }
     }
    function uncolorIt(x){
      var commaSplit = splitEffort(x);
      if(commaSplit[0]!==""){
         commaSplit.forEach(function(entry){
                d3.select("#"+entry).transition()
                  .duration(300).style("filter","grayscale(100%)").style("opacity",0.2);
                d3.select("#cap"+entry).transition()
                  .duration(300).style("filter","grayscale(100%)").style("opacity",0.2);
                });}
   }
    initDiv();
    colorIt(datum);
    // end icons

    svg.selectAll("bar")
            .data(filterdata)
          .enter().append("rect")
            .style("fill", d=>d.color)
            .style("opacity",function(d){return (d===datum)? 1:0.3;})
            .attr("x", function(d) { return xScale(d.date); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.satisfaction); })
            .attr("height", function(d) { return height - margin.bottom - yScale(d.satisfaction); })
            .on("mouseover", function(d){
              //console.log(d.effort);
              uncolorIt(datum);
              d3.select(this)
                 .style("opacity",1);
                //  .style("fill", "grey");
                  var html  = "<b>Mood: </b>"+d.mooddetails+"<br>"
                 	 html  = html +"<b>Company: </b>"+d.company+"<br>";

              tooltip.html(html)
                  .style("top", (d3.event.pageY - 10) + "px")
                  .style("left", (d3.event.pageX + 15) + "px")
                .transition()
                  .duration(200) // ms
                  .style("opacity", 0.9) // started as 0!

              colorIt(d);

            })
            .on("mouseout", function(d){
              d3.select(this)
                .style("fill", d=>d.color)
                .style("opacity",function(d){return (d===datum)? 1:0.3;})

              uncolorIt(d);
              colorIt(datum); //revert

                tooltip.transition()
                .duration(300) // ms
                .style("opacity", 0); })


          //x axis label
      //  svg.append("text")
      //    .attr("class","label")
      //    .attr("transform","translate(" + (width/2) + " ," + (height-5) + ")")
      //    .attr("dy", "0em")
      //    .style("text-anchor", "middle")
      //    .text("Date[2018]");

       // y axis label
       svg.append("text")
          .attr("class","label")
          .attr("transform", "translate(0,"+ (height/2)+") rotate(-90)")
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Liked Food (How Much) ");

       //Adding images
       svg.append("defs")
		   .append("pattern")
		   .attr("id", "positive")
		   .attr('patternContentUnits', 'objectBoundingBox')
		   .attr("width","100%")
		   .attr("height", "100%")
		   .attr("x", 0)
       .attr("y", 0)
		   .append("image")
		   .attr("width", 1)
		   .attr("height", 1)
		   .attr("preserveAspectRatio", "none slice")
		   .attr("xlink:href", "images/PositiveEmo.png");

		svg.append("defs")
		   .append("pattern")
		   .attr("id", "negative")
		   .attr('patternContentUnits', 'objectBoundingBox')
		   .attr("width", "100%")
		   .attr("height", "100%")
		   .attr("x", 0)
       .attr("y", 0)
		   .append("image")
		   .attr("width", 1)
		   .attr("height", 1)
		   .attr("preserveAspectRatio", "none slice")
		   .attr("xlink:href", "images/NegativeEmo.png");

		svg.append("defs")
		   .append("pattern")
		   .attr("id", "neutral")
		   .attr('patternContentUnits', 'objectBoundingBox')
		   .attr("width", "100%")
		   .attr("height", "100%")
		   .attr("x", 0)
       .attr("y", 0)
		   .append("image")
		   .attr("width", 1)
		   .attr("height", 1)
		   .attr("preserveAspectRatio", "none slice")
		   .attr("xlink:href", "images/NeutralEmo.png")
		   .attr("x", 0)
       .attr("y", 0);

        // Append circles that will display mood icons
       var circles = svg.selectAll( '.circles' )
		   .data(filterdata)
		   .enter()
		   .append('circle' )
		   //.filter(function (d) {return d.user == "nusaybah1410@gmail.com"})//filter by user
           //.filter(function (d) {return d.mealType == "Dinner"})
		   		//.attr("cursor", "pointer")
				.attr('cx', function ( d) {return xScale(d.date) + (xScale.bandwidth()/2); })
		    .attr('cy', function( d) {return yScale(d.satisfaction);})
		   	.attr('fill', function(d){if(d.mood=="Positive"){
	            return "url(#positive)";}
	            else if(d.mood=="Negative"){
	                return "url(#negative)";}
	            else if(d.mood=="Neutral"){
	                return "url(#neutral)";}
	            })
			   	//.style("fill", "url(#imgSmile)")
          // yle("stroke", "black")
         // 	.style("stroke-width", 0.25)
			   	.attr("r", 15)
			   	//.transition()
			   	//.duration( 1500 )
			   	.attr( 'cy', function( d) {return yScale(d.satisfaction +0.75);
			   });
}}


function clearLinkedScatterPlot() {
  d3.selectAll(".svgLinkedScatter").remove();
  d3.selectAll(".head").remove();
}

function clearLineAndBar(){
    d3.selectAll(".head").remove();
	  d3.selectAll(".svgLine").remove();
    d3.selectAll(".svgBar").remove();
    d3.select("#imageDiv").attr("class","imageDiv").style("opacity",0);
    d3.selectAll(".title").style("visibility","hidden");

    /**********************
    Note: remove barplot svg
    *********************/
}
