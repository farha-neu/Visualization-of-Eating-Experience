var m = {t:50,r:50,b:50,l:0},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t -m.b
    interval = 130;

var highlightLabel = '';

var plot = d3.select('.canvas')
  .append('svg')
  .attr('width', w + m.l + m.r)
  .attr('height', h + m.t + m.b)
  .append('g')
  .attr('transform','translate('+ m.l+','+ m.t+')');

// Scale
var scaleYUser = d3.scaleOrdinal()
  .domain(['', '', '', '', '', '', '', '', ''])
  .range([0, h/8, 2*h/8, 3*h/8, 4*h/8, 5*h/8, 6*h/8, 7*h/8, h]);

var scaleYMeal = d3.scaleOrdinal()
  .domain(['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack'])
  .range([0, 0.25*h, 0.5*h, 0.75*h, h]);

var scaleYCompany= d3.scaleOrdinal()
  .domain(['Alone', 'Pets', 'Strangers', 'Family', 'Friends', 'Colleagues',
    'Friends, Family', 'Friends, Colleagues'])
  .range([0, h/7, 2*h/7, 3*h/7, 4*h/7, 5*h/7, 6*h/7, h]);

const scaleYLocation = d3.scaleOrdinal()
  .domain(['Home', 'Commuting', 'Car', 'On Street', 'Eat at work',
           'Dining Hall', 'Restaurant', 'Friend\'s home'])
  .range([0, h/7, 2*h/7, 3*h/7, 4*h/7, 5*h/7, 6*h/7, h]);

var scaleYHungerBefore = d3.scaleOrdinal()
  .domain(['Before 10', 'Before 9', 'Before 8', 'Before 7', 'Before 6',
         'Before 5', 'Before 4', 'Before 3', 'Before 2', 'Before 1'])
  .range([0, h/9, 2*h/9, 3*h/9, 4*h/9, 5*h/9, 6*h/9, 7*h/9, 8*h/9, h]);

var scaleYHungerAfter = d3.scaleOrdinal()
  .domain(['After 10', 'After 9', 'After 8', 'After 7', 'After 6',
       'After 5', 'After 4', 'After 3', 'After 2', 'After 1'])
  .range([0, h/9, 2*h/9, 3*h/9, 4*h/9, 5*h/9, 6*h/9, 7*h/9, 8*h/9, h]);

var scaleYFeel = d3.scaleOrdinal()
  .domain(['Good', 'Happy', 'Peaceful', 'Satisfied', 'Warm', 'Joyful','Energetic', 'Enthusiastic',
  'Angry', 'Tired', 'Worried', 'Disappointed', 'Bored', 'Sad', 'Sleepy', 'Disgusted', 'Annoyed', 'Stressed'])
  .range([0, h/17, 2*h/17, 3*h/17, 4*h/17, 5*h/17, 6*h/17, 7*h/17, 8*h/17, 9*h/17,
    10*h/17, 11*h/17, 12*h/17, 13*h/17, 14*h/17, 15*h/17, 16*h/17, h]);

var scaleYDistraction = d3.scaleOrdinal()
  .domain(['Nothing', 'Commuting', 'Talking', 'Watching TV', 'Cooking',
           'Working', 'Seminar', 'Phone', 'Chatting on social media'])
  .range([0, h/8, 2*h/8, 3*h/8, 4*h/8, 5*h/8, 6*h/8, 7*h/8, h]);

var scaleYWeather = d3.scaleOrdinal()
  .domain(['Sunny', 'Cloudy', 'Foggy', 'Windy', 'Rainy', 'Snowy', 'Cold'])
  .range([0, h/6, 2*h/6, 3*h/6, 4*h/6, 5*h/6, h]);

// Axis
var axisYUser = d3.axisRight()
  .scale(scaleYUser)
  .tickSize(3);

var axisYMeal = d3.axisRight()
  .scale(scaleYMeal)
  .tickSize(3);

var axisYCompany = d3.axisRight()
  .scale(scaleYCompany)
  .tickSize(3);

var axisYLocation = d3.axisRight()
  .scale(scaleYLocation)
  .tickSize(3);

var axisYHungerBefore = d3.axisRight()
  .scale(scaleYHungerBefore)
  .tickSize(3);

var axisYHungerAfter = d3.axisRight()
  .scale(scaleYHungerAfter)
  .tickSize(3);

var axisYFeel = d3.axisRight()
  .scale(scaleYFeel)
  .tickSize(3);

var axisYDistraction = d3.axisRight()
  .scale(scaleYDistraction)
  .tickSize(3);

var axisYWeather = d3.axisRight()
  .scale(scaleYWeather)
  .tickSize(3);

// Append axis text
plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(20, -30)')
  .style('text-anchor', 'middle')
  .text('USER');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(150, -30)')
  .style('text-anchor', 'middle')
  .text('MEAL');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(280, -30)')
  .style('text-anchor', 'middle')
  .text('COMPANION');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(410, -30)')
  .style('text-anchor', 'middle')
  .text('LOCATION');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(540, -40)')
  .style('text-anchor', 'middle')
  .text('BEFORE MEAL');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(540, -30)')
  .style('text-anchor', 'middle')
  .text('HUNGER SCALE');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(670, -40)')
  .style('text-anchor', 'middle')
  .text('AFTER MEAL');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(670, -30)')
  .style('text-anchor', 'middle')
  .text('HUNGER SCALE');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(800, -30)')
  .style('text-anchor', 'middle')
  .text('MOOD');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(930, -30)')
  .style('text-anchor', 'middle')
  .text('DISTRACTION');

plot.append('text')
  .attr('class', 'axisLabel')
  .attr('transform', 'translate(1060, -30)')
  .style('text-anchor', 'middle')
  .text('WEATHER');

// Data input
d3.queue()
  .defer(d3.csv, 'd3/data.csv',parse)
	.await(dataLoaded);

function dataLoaded(err, data){
  let arr = preprocessData(data);
  draw(arr);
  drawAxis(arr);
}

function preprocessData(data){
  let arr = [];
  for (var i = 0; i < data.length; i++) {
    let mealEntry = data[i];
    let mealLine = [];

    let label = mealEntry.user;
    let y = scaleYUser(mealEntry.user);
    let x = 0;
    mealLine.push({x,y,label});

    label = mealEntry.mealType;
    y = scaleYMeal(mealEntry.mealType);
    x = interval;
    mealLine.push({x,y,label});

    label = mealEntry.company;
    y = scaleYCompany(mealEntry.company);
    x = interval*2;
    mealLine.push({x,y,label});

    label = mealEntry.location;
    y = scaleYLocation(mealEntry.location);
    x = interval*3;
    mealLine.push({x,y,label});

    label = mealEntry.hungerBefore;
    y = scaleYHungerBefore(mealEntry.hungerBefore);
    x = interval*4;
    mealLine.push({x,y,label});

    label = mealEntry.hungerAfter;
    y = scaleYHungerAfter(mealEntry.hungerAfter);
    x = interval*5;
    mealLine.push({x,y,label});

    label = mealEntry.feel;
    y = scaleYFeel(mealEntry.feel);
    x = interval*6;
    mealLine.push({x,y,label});

    label = mealEntry.distraction;
    y = scaleYDistraction(mealEntry.distraction);
    x = interval*7;
    mealLine.push({x,y,label});

    label = mealEntry.weather;
    y = scaleYWeather(mealEntry.weather);
    x = interval*8;
    mealLine.push({x,y,label});

    arr.push(mealLine);
  }
  return arr;
}

function drawAxis(arr){
  plot.append('g').attr('class', 'axis axis-y').call(axisYUser)
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
    // .on('mouseout', function(){
    //   highlightLabel = '';
    //   draw(arr);
    // });
  plot.append('g').attr('class', 'axis axis-y').call(axisYMeal)
    .attr('transform','translate('+interval+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYCompany)
    .attr('transform','translate('+interval*2+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYLocation)
    .attr('transform','translate('+interval*3+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYHungerBefore)
    .attr('transform','translate('+interval*4+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYHungerAfter)
    .attr('transform','translate('+interval*5+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYFeel)
    .attr('transform','translate('+interval*6+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYDistraction)
    .attr('transform','translate('+interval*7+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
  plot.append('g').attr('class', 'axis axis-y').call(axisYWeather)
    .attr('transform','translate('+interval*8+',0)')
    .selectAll('text')
    .on('click', function(d){
      highlightLabel = d;
      draw(arr);
    });
}

function draw(arr){
  let line = d3.line()
    .x(function(d) {return d.x})
    .y(function(d) {return d.y});
  let pathplot = plot.selectAll('.line').data(arr);

  let pathplotEnter = pathplot.enter()
    .append('path')
    .attr('class', 'line')
    .attr('d', line)
    .attr('stroke', 'grey')
    // .attr('stroke-width',)
    .attr('stroke-opacity', 0.5)
    .attr('fill', 'none')
    .on('mouseover', function(){
      d3.select(this)
        .attr('stroke', 'orange')
        .attr('stroke-opacity', '1')
        .attr('stroke-width', '3');
    })
    .on('mouseout', function(){
      d3.select(this).attr('stroke','grey')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', '1');
    });
    // console.log(highlightLabel);

    pathplotEnter.merge(pathplot)
      .transition()
      .duration(500)
      // .attr('stroke', 'orange')
      .attr('stroke-opacity', function(d){
        // console.log(d);
        for (var i = 0; i < d.length; i++) {
          // console.log(d[i].label);
          if (d[i].label == highlightLabel) {
            return 0.2
          }
        }
        return 0;
      });

    //EXIT
    pathplot.exit()
      .transition()
      .duration(500)
      // .attr('stroke-opacity', 0)
      .remove();
}

// Parse
function parse(d){
  return {
    user: d.Email,
    mealType: d.MealType, // yes
    distraction: d.Distraction, // yes
    weather: d.Weather, // yes
    feel: d.Feel, // yes
    food: d.Food,
    company: d.Company, // yes
    location: d.Location,
    hungerBefore: 'Before '+d.HungerBefore, // yes
    hungerAfter: 'After '+d.HungerAfter, // yes
    likeFood: +d.LikeFood,
    note: d.Notes
  }
}
