//steamgraph
//set xscale
//set yscale


d3.csv('randomSample2.csv', function(allData){
	
	var yearArray=[], dataArray=[];

	for(var i=0;i<allData.length; i++){
		dataObj = allData[i];
		for(var prop in dataObj){
			if(prop=='Year')
				yearArray.push(dataObj.Year);
			if(prop=='Data')
			dataArray.push(dataObj.Data);
		}
	}

	d3.select('body').selectAll('div')
	.data(dataArray)
	.enter().append('div')
	.attr('class','bar')
	.style('left',function(d,i){
		return i*10 + 'px';
	})
	.style('top',0)
	.style('height', function(d){
		var barHeight = d/1000000;
		return barHeight + 'px';
	});
});
