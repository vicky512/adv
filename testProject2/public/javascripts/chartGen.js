$(document).ready(function(){
	var margin= {top:10, right:40, bottom:150, left:150},
							width = 1280 - margin.left - margin.right,
							height = 500 - margin.top - margin.bottom,
							contextHeight = 50,
							contextWidth = width;

	var svg = d3.select("#chart-container").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);


	//d3.csv("verticalValueCounts1.csv",createChart);
	//d3.csv("InquiryDummySet3.csv",createChart);
	var data = {'csvData':[]};
	getData('mockSample1.csv');

	function getData(dataPath){
		d3.csv(dataPath, function(allData){
			data.csvData = allData;
			getFieldCounts('domain');
		});
	}	

	function getFieldCounts(fieldName){
		var thisFieldObj= {};

		$.each(data.csvData, function(){
			if(!thisFieldObj[this.domain]) thisFieldObj[this.domain] = 0;
			thisFieldObj[this.domain]++;
		});
		console.log(thisFieldObj);
		var pieChartDataObj = {}, pieChartDataArray = [];
		Object.keys(thisFieldObj).forEach(function(element, index, array){
			pieChartDataObj={};
			pieChartDataObj['label'] = element;
			pieChartDataObj['value'] = ((thisFieldObj[element])/(data.csvData.length)) * 100;
			pieChartDataArray.push(pieChartDataObj);
		});
		console.log(pieChartDataArray);
		generateChart(pieChartDataArray);

	}
	function generateChart(pieData){
		// pieData =  [{"label":"Category A", "value":20}, 
		//           {"label":"Category B", "value":50}, 
		//           {"label":"Category C", "value":30}];
		var w = 400;
		var h = 400;
		var r = h/2;
		var color = d3.scale.category20c();

		var vis = d3.select('#chart-container').append("svg:svg").data([pieData]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
		var pie = d3.layout.pie().value(function(d){return d.value;});
		
		// declare an arc generator function
		var arc = d3.svg.arc().outerRadius(r);

		// select paths, use arc generator to draw
		var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
		arcs.append("svg:path")
		    .attr("fill", function(d, i){
		        return color(i);
		    })
		    .attr("d", function (d) {
		        // log the result of the arc generator to show how cool it is :)
		        console.log(arc(d));
		        return arc(d);
		    });

		// add the text
		arcs.append("svg:text").attr("transform", function(d){
					d.innerRadius = 0;
					d.outerRadius = r;
		    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
		    				return pieData[i].label;}
							);
	}
});