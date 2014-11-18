
$(document).ready(function(){

	//initializing the variables
	var ruleKeys, dataKeys, rulesData, pattern;
	var regexObj, finalResult;
	var data = {'csvData':[], 'csvRules':[]};
	summaryResultObj = {};
	finalResult = {'unmatchedLog': [], 'summaryResult':[]};
	rulesData={};

	getData('randomSample2.csv');

	//function to read data from the data csv
	function getData(dataPath){
		d3.csv(dataPath, function(allData){
			data.csvData = allData;
			getRules('RSRandomSample.csv');
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
			// applyPositiveRules('NR');

			getSummary();
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


		// unmatchedLog = csvData.map(function(eachDataRow){
		// 	dataKeys = Object.keys(eachDataRow);

		// 	var unmatchedObj = dataKeys.map(function(key){
		// 							pattern = csvRules[ruleType + '_' + key.toLowerCase()].fieldFormat;
		// 							regexObj = new RegExp(pattern);
									
		// 							//If a rule passes, the value is logged, along with the complete row
		// 							if(!regexObj.test(eachDataRow[key]))
		// 							{
		// 								unmatchedLogObj['ruleName'] = ruleType + '_' + key.toLowerCase();
		// 								unmatchedLogObj['fieldName'] = key;
		// 								unmatchedLogObj['matchValue'] = eachDataRow[key];
		// 								unmatchedLogObj['dataObj'] = eachDataRow;		

		// 								return unmatchedLogObj;
		// 							} else return null;
		// 						});
		// 	if(unmatchedObj) return unmatchedObj;
		// });

		//  console.log(unmatchedLog);
	}

	// function applyPositiveRules(ruleType){
	// 	//applying the rules to the data
	// 		ruleKeys = d3.keys(rulesData[0]);
	// 		for(var i=0;i<csvData.length; i++){
	// 			for(var prop in csvData[i]){
	// 				pattern = csvRules[ruleType + '_' + prop.toLowerCase()].fieldFormat;
	// 				regexObj = new RegExp(pattern);

	// 				//If a rule passes, the value is logged, along with the complete row
	// 				if(regexObj.test(csvData[i][prop]))
	// 				{
	// 					unmatchedLogObj['ruleName'] = ruleType + '_' + prop.toLowerCase();
	// 					unmatchedLogObj['fieldName'] = prop;
	// 					unmatchedLogObj['matchValue'] = csvData[i][prop];
	// 					unmatchedLogObj['dataObj'] = csvData[i];			
	// 					finalResult.unmatchedLog.push(unmatchedLogObj);
	// 					console.log(unmatchedLogObj['ruleName']);
	// 				}
	// 				//console.log(csvData[i][prop]);
	// 				//console.log(csvRules['FR_'+prop.toLowerCase()].FieldFormat);
	// 			}
	// 		}


	// }

	function getSummary(){
		 console.log(finalResult.unmatchedLog);

		// summaryResult.push(unmatchedLog.map(function(unmatchedObj){
		// 	return {'ruleName': unmatchedObj.ruleName, 'fieldName': unmatchedObj.fieldName};
		// }));

		// for(var i=0;i<unmatchedLog.length;i++){
		// 	unmatchedLogObj = unmatchedLog[i];
			
		// 	for(var prop in unmatchedLogObj){
		// 		//if(summaryResult[''])
		// 		if(summaryResult.indexOf(prop) != -1){
		// 			summaryResultObj['ruleName'] = unmatchedLogObj['ruleName'];
		// 			summaryResultObj['fieldName'] = unmatchedLogObj['fieldName'];

		// 			summaryResult.push(summaryResultObj);
		// 		}
		// 	}


		// }

		console.log(finalResult.summaryResult);
	}
});