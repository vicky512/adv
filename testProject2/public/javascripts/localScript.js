barData = [];

for(var i=0; i<100; i++)
	barData.push(Math.round(Math.random() * 50) + 10);

var height = 400, width=600;

var yScale = d3.scale.linear()
							.domain([0,d3.max(barData)])
							.range([0, height]);

var xScale = d3.scale.ordinal()
							.domain(d3.range(0, barData.length))
							.rangeBands([0, width]);

var colorScale = d3.scale.linear()
									.domain([0, d3.max(barData)])
									.range(['#000000', '#ffffff'])

var vGuideScale = d3.scale.linear()
									.domain([0, d3.max(barData)])
									.range([height, 0]);

var vAxis = d3.svg.axis()
						.scale(vGuideScale)
						.orient('left')
						.ticks(10);

var mySVG = d3.select('#testSVG').attr('height', 400)
	.attr('width',600)
	.style('background', '#234f35')
	.append('g')
	.selectAll('rect')
	.data(barData).enter().append('rect')
	.attr('height', height)
	.attr('width',0)
	.style('fill', colorScale)
	.attr('x', function(d,i){return i*xScale.rangeBand();})
	.attr('y', function(d){return height - yScale(d);})

mySVG.transition()
	.attr('height', function(d){return yScale(d);})
	.attr('width',xScale.rangeBand())
			.duration(1000);

var vGuide = d3.select('svg').append('g');
vAxis(vGuide);
vGuide.attr('transform', 'translate(35,0)');
