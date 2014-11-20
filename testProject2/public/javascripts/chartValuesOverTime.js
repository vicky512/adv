$(document).ready(function(){
	var margin= {top:10, right:40, bottom:500, left:150},
			width = 1280 - margin.left - margin.right,
			height = 1500 - margin.top - margin.bottom,
			contextHeight = 150,
			contextWidth = width;

		var svg = d3.select("#valuesOverTimeChart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);

		//d3.csv("verticalValueCounts1.csv",createChart);
		d3.csv("mockDomainCounts1.csv",createChart);
		// d3.csv("InquiryDummySet3.csv",createChart);

		function createChart(data){
			var fieldNames=[];
			var charts =[];
			var maxDataPoint = 0;

			for(var property in data[0]){
				if(data[0].hasOwnProperty(property)) {
					if(property != 'Year') {
						fieldNames.push(property);
					}
				}
			};

			var fieldNamesCount = fieldNames.length;
			var startMonth = data[0].Year;
			var endMonth = data[data.length-1].Year;
			var chartHeight = height * (1/fieldNamesCount);

			data.forEach(function(d){
				for(var prop in d) {
					if(d.hasOwnProperty(prop) && prop!= 'Year'){
						d[prop] = parseFloat(d[prop]);

						if(d[prop] > maxDataPoint)
							maxDataPoint = d[prop];

					}
				}
				
				d.Year = new Date(d.Year,0,1);
			});

			console.log(maxDataPoint);

			for(var i=0; i<fieldNamesCount;i++){
				charts.push(new Chart({
					data: data.slice(),
					id: i,
					name:fieldNames[i],
					width:width,
					height:height * (1/fieldNamesCount),
					maxDataPoint: maxDataPoint,
					svg: svg,
					margin: margin,
					showBottomAxis: (i==fieldNamesCount-1)
				}));
			}
/* Let's create the context brush that will 
					let us zoom and pan the chart */
			var contextXScale = d3.time.scale()
														.range([0, contextWidth])
														.domain(charts[0].xScale.domain());	
			
			var contextAxis = d3.svg.axis()
															.scale(contextXScale)
															.tickSize(contextHeight)
															.tickPadding(-10)
															.orient("bottom");
			
			var contextArea = d3.svg.area()
															.interpolate("basis")
															.x(function(d) { return contextXScale(d.date); })
															.y0(contextHeight)
															.y1(0);

			var brush = d3.svg.brush()
												.x(contextXScale)
												.on("brush", onBrush);

			var context = svg.append("g")
												.attr("class","context")
												.attr("transform", "translate(" + (margin.left + width * .25) + "," + (height + margin.top + chartHeight) + ")");
			
			context.append("g")
												.attr("class", "x axis top")
												.attr("transform", "translate(0,0)")
												.call(contextAxis)
												
			context.append("g")
												.attr("class", "x brush")
												.call(brush)
												.selectAll("rect")
													.attr("y", 0)
													.attr("height", contextHeight);
			
			context.append("text")
								.attr("class","instructions")
								.attr("transform", "translate(0," + (contextHeight + 20) + ")")
								.text('Click and drag above to zoom / pan the data');
								
			function onBrush(){
				/* this will return a date range to pass into the chart object */
				var b = brush.empty() ? contextXScale.domain() : brush.extent();
				for(var i = 0; i < fieldNamesCount; i++){
					charts[i].showOnly(b);
				}
			}
		}

		function Chart(options){
			this.chartData = options.data;
			this.width = options.width;
			this.height = options.height;
			this.maxDataPoint = options.maxDataPoint;
			this.svg = options.svg;
			this.id = options.id;
			this.name = options.name;
			this.margin = options.margin;
			this.showBottomAxis = options.showBottomAxis;
			
			var localName = this.name;
			
			/* XScale is time based */
			this.xScale = d3.time.scale()
							.domain(d3.extent(this.chartData.map(function(d) { return d.Year; })))
							.range([0, this.width]);
			
			/* YScale is linear based on the maxData Point we found earlier */
			this.yScale = d3.scale.linear()
							.domain([0,this.maxDataPoint])
							.range([this.height,0]);
							
			var xS = this.xScale;
			var yS = this.yScale;
			
			/* 
				This is what creates the chart.
				There are a number of interpolation options. 
				'basis' smooths it the most, however, when working with a lot of data, this will slow it down 
			*/
			this.area = d3.svg.area()
							.interpolate("step")
							.x(function(d) { return xS(d.Year); })
							.y0(this.height)
							.y1(function(d) { return yS(d[localName]); });
			/*
				This isn't required - it simply creates a mask. If this wasn't here,
				when we zoom/panned, we'd see the chart go off to the left under the y-axis 
			*/
			this.svg.append("defs").append("clipPath")
								.attr("id", "clip-" + this.id)
								.append("rect")
									.attr("width", this.width)
									.attr("height", this.height);
			/*
				Assign it a class so we can assign a fill color
				And position it on the page
			*/
			this.chartContainer = svg.append("g")
									.attr('class',this.name.toLowerCase())
									.attr("transform", "translate(" + this.margin.left + "," + (this.margin.top + (this.height * this.id) + (10 * this.id)) + ")");

			/* We've created everything, let's actually add it to the page */
			this.chartContainer.append("path")
													.data([this.chartData])
													.attr("class", "chart")
													.attr("clip-path", "url(#clip-" + this.id + ")")
													.attr("d", this.area);
											
			this.xAxisTop = d3.svg.axis().scale(this.xScale).orient("bottom");
			this.xAxisBottom = d3.svg.axis().scale(this.xScale).orient("top");
			/* We only want a top axis if it's the first country */
			if(this.id == 0){
				this.chartContainer.append("g")
							.attr("class", "x axis top")
							.attr("transform", "translate(0,0)")
							.call(this.xAxisTop);
			}
			
			/* Only want a bottom axis on the last country */
			if(this.showBottomAxis){
					this.chartContainer.append("g")
							.attr("class", "x axis bottom")
							.attr("transform", "translate(0," + this.height + ")")
							.call(this.xAxisBottom);
				}  
				
			this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(5);
				
			this.chartContainer.append("g")
													.attr("class", "y axis")
													.attr("transform", "translate(-15,0)")
													.call(this.yAxis);
													
			this.chartContainer.append("text")
													.attr("class","country-title")
													.attr("transform", "translate(15,40)")
													.text(this.name);
			
		}
			
		Chart.prototype.showOnly = function(b){
				this.xScale.domain(b);
				this.chartContainer.select("path").data([this.chartData]).attr("d", this.area);
				this.chartContainer.select(".x.axis.top").call(this.xAxisTop);
				this.chartContainer.select(".x.axis.bottom").call(this.xAxisBottom);
		}
});