
$(document).ready(function(){

	//initializing the variables
	var ruleKeys, dataKeys, rulesData, pattern;
	var regexObj, finalResult, fileMetaData;
	var data = {'csvData':[], 'csvRules':[]};
	summaryResultObj = {};
	fileMetaData = {};
	finalResult = {'unmatchedLog': [], 'summaryResult':[]};
	rulesData={};
	fileMetaData['sourceFileName'] = 'mockSample1.csv';
	fileMetaData['rulesFileName'] = 'RSMockSample1.csv';
	fileMetaData['sourceGeneratedDate'] = '20141119';
	getData(fileMetaData.sourceFileName);

	$('#summaryResult table tbody').on('click', 'td a.linkShowDetailed', showDetailedTable);

	//function to read data from the data csv
	function getData(dataPath){
		d3.csv(dataPath, function(allData){
			data.csvData = allData;
			fileMetaData['sourceDataSize'] = allData.length;
			fileMetaData['sampleSize'] = 100;

			getRules(fileMetaData.rulesFileName);
		});
	}

	//function to read rules from the rules csv
	function getRules(rulesPath){
		//getting the rules from the rules document
		d3.csv(rulesPath, function(rulesData){
			for(var i=0; i<rulesData.length; i++){
				for(var prop in rulesData[i]){
					if(rulesData[i].hasOwnProperty(prop)){
						if(prop == 'ruleName'){
							//csvRules changes the key to the rule name instead of the heading
							data.csvRules[rulesData[i].ruleName] = rulesData[i];
							
						}
					}
				}
			}
			
			applyNegativeRules('FR');
			applyPositiveRules('NR');

			// generateSummary();

			

			checkADVReportExists();
			// console.log(data.csvData);
			// console.log(rulesData[0]);
			// console.log(ruleKeys);
		});
	}

	function applyNegativeRules(ruleType){
//applying the rules to the data
			// ruleKeys = d3.keys(rulesData[0]);
			var unmatchedLogObj = {};
			for(var i=0;i<data.csvData.length; i++){
				for(var prop in data.csvData[i]){
					// console.log(prop);
					// console.log(data.csvRules[ruleType + '_' + prop.toLowerCase()].fieldFormat);
					pattern = data.csvRules[ruleType + '_' + prop.toLowerCase()].fieldFormat;
					regexObj = new RegExp(pattern);

					//If a rule passes, the value is logged, along with the complete row
					if(!regexObj.test(data.csvData[i][prop]))
					{
						unmatchedLogObj = {};
						unmatchedLogObj['ruleName'] = ruleType + '_' + prop.toLowerCase();
						unmatchedLogObj['fieldName'] = prop;
						unmatchedLogObj['matchValue'] = data.csvData[i][prop];
						unmatchedLogObj['dataObj'] = data.csvData[i];	
						
						finalResult.unmatchedLog.push(unmatchedLogObj);
						
					}
					//console.log(csvData[i][prop]);
					//console.log(csvRules['FR_'+prop.toLowerCase()].FieldFormat);
				}
			}
		}


		

	function applyPositiveRules(ruleType){
//applying the rules to the data
			// ruleKeys = d3.keys(rulesData[0]);
			var unmatchedLogObj = {};
			for(var i=0;i<data.csvData.length; i++){
				for(var prop in data.csvData[i]){
					
					pattern = data.csvRules[ruleType + '_' + prop.toLowerCase()].fieldFormat;
					regexObj = new RegExp(pattern);

					//If a rule passes, the value is logged, along with the complete row
					if(regexObj.test(data.csvData[i][prop]))
					{
						unmatchedLogObj = {};
						unmatchedLogObj['ruleName'] = ruleType + '_' + prop.toLowerCase();
						unmatchedLogObj['fieldName'] = prop;
						unmatchedLogObj['matchValue'] = data.csvData[i][prop];
						unmatchedLogObj['dataObj'] = data.csvData[i];	
						
						finalResult.unmatchedLog.push(unmatchedLogObj);
						
					}
					//console.log(csvData[i][prop]);
					//console.log(csvRules['FR_'+prop.toLowerCase()].FieldFormat);
				}
			}
	}

	function generateSummary(){
		 

		// finalResult.summaryResult = (finalResult.unmatchedLog.map(function(unmatchedObj){
		// 	return {'ruleName': unmatchedObj.ruleName, 'fieldName': unmatchedObj.fieldName};
		// }));
		var unmatchedCount={};
		Object.keys(data.csvRules).forEach(function(element, index, array){

			unmatchedCount[element] = 0;
			$.each(finalResult.unmatchedLog, function(){
				if(this.ruleName === element)
					unmatchedCount[element]++;
			});

			finalResult.summaryResult.push({
				'ruleName':element,
				'ruleMeaning':getRuleMeaning(element.substring(0,2)),
				'lowerLimit': data.csvRules[element].lowerLimit,
				'upperLimit': data.csvRules[element].upperLimit,
				'matchScore': unmatchedCount[element],
				'conclusion': (unmatchedCount[element]>=data.csvRules[element].lowerLimit && unmatchedCount[element]<=data.csvRules[element].upperLimit)? 'PASS' : 'FAIL'

			});
		});

		// console.log(finalResult.summaryResult);
		// console.log(finalResult.unmatchedLog);
		
	}



	function checkADVReportExists(){
		
		// console.log('populateSummaryTable');
		$.getJSON('/users/unmatchedRecords/' + fileMetaData.sourceFileName.substring(0,fileMetaData.sourceFileName.length-4) + '/' + fileMetaData.sourceGeneratedDate , function(data){
			if(!data) data = [];
			if(data.length == 0){
				insertUnmatchedRecords();
			}else{
				// console.log(data);
				finalResult.unmatchedLog = data;
				generateSummary();
				populateSummaryTable(finalResult.summaryResult);
			}

		});
	}

	function insertUnmatchedRecords(){
		$.each(finalResult.unmatchedLog, function(){
			// if(this.ruleName.substring(0,2)=='FR')
			// 	failMeaning
			var unmatchedObject = {
				'sourceFileName': fileMetaData.sourceFileName.substring(0,fileMetaData.sourceFileName.length-4),
				'rulesFileName': fileMetaData.rulesFileName,
				'sourceGeneratedDate': fileMetaData.sourceGeneratedDate,
				'sourceDataSize': fileMetaData.sourceDataSize,
				'sampleSize': fileMetaData.sampleSize,
				'ruleType': this.ruleName.substring(0,2),
				'ruleName': this.ruleName,
				'fieldName': this.fieldName,
				'failedValue': this.matchValue,
				'failedDataObj': this.dataObj

			}

			$.ajax({
				type:'POST',
				data: unmatchedObject,
				url:'/users/addUnmatchedRecords',
				dataType: 'JSON'
			}).done(function(response){
				if(response.msg === ''){
					
				}
				else{
					alert('Error: ' + response.msg);
				}
			});
		});

		generateSummary();
		populateSummaryTable();
	}


	function getRuleMeaning(ruleType){
		var ruleMeaning ='';
		switch (ruleType){
				case 'FR':
					ruleMeaning = 'Not acceptable Format';
					break;
				case 'NR':
					ruleMeaning='Output is Null';
					break;
				default:
					ruleMeaning ='Unverified rule type';
					break;
			}
		return ruleMeaning;
	}

	function populateSummaryTable(){
		var tableContent ='';
		var ruleMeaning = '';
		$.getJSON('/users/unmatchedRecords/' + fileMetaData.sourceFileName.substring(0,fileMetaData.sourceFileName.length-4) + '/' + fileMetaData.sourceGeneratedDate , function(data){
			finalResult.unmatchedLog = data;
			generateSummary();

		});

		$.each(finalResult.summaryResult, function(){
			
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkShowDetailed" rel="'+ this.ruleName + '" title="Show Details">' + this.ruleName + '</a></td>';
			tableContent += '<td>' + this.ruleMeaning + '</td>';
			tableContent += '<td>' + this.lowerLimit + '</td>';
			tableContent += '<td>' + this.upperLimit + '</td>';
			tableContent += '<td>' + this.matchScore + '</td>';
			tableContent += '<td>' + this.conclusion + '</td>';
			tableContent += '</tr>';
		});
		$('#summaryResult table tbody').html(tableContent);
		
	}

	function showDetailedTable(event){
		event.preventDefault();
		var tableContent ='';
		var thisRuleName = $(this).attr('rel');

		$.getJSON('/users/unmatchedRecords/' + fileMetaData.sourceFileName.substring(0,fileMetaData.sourceFileName.length-4) + '/' + fileMetaData.sourceGeneratedDate , function(data){
			
			var detailedDataForRule = data.filter(function(element){
				return element.ruleName == thisRuleName;
			});
			$.each(detailedDataForRule, function(){
				
				tableContent += '<tr>';
				// tableContent += '<td><a href="#" class="linkShowDetailed" rel="'+ this.ruleName + '" title="Show Details">' + this.ruleName + '</a></td>';
				tableContent += '<td>' + this.ruleName + '</td>';
				tableContent += '<td>' + this.failedValue + '</td>';
				tableContent += '</tr>';
			});

			$('#detailedResult table tbody').html(tableContent);
		});

	}

	


	
	
});