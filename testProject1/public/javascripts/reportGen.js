getData('randomSample2.csv');
getRules('RSRandomSample.csv');

//initializing the variables
var ruleKeys, dataKeys, rulesData, csvData, csvRules, pattern;
var regexObj, unmatchedLogObj, unmatchedLog, summaryResult;
csvRules = {};
csvData = {};
unmatchedLogObj = {},unmatchedLog = [];
summaryResultObj = {}, summaryResult=[];
rulesData={};

//function to read data from the data csv
function getData(dataPath){
	d3.csv(dataPath, function(allData){
		csvData = allData;
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
						csvRules[rulesData[i].ruleName] = rulesData[i];
						
					}
				}
			}
		}
		applyNegativeRules('FR');
		applyPositiveRules('NR');
		// console.log(csvData);
		// console.log(rulesData[0]);
		// console.log(ruleKeys);
	});
}

function applyNegativeRules(ruleType){
	//applying the rules to the data
		ruleKeys = d3.keys(rulesData[0]);
		for(var i=0;i<csvData.length; i++){
			for(var prop in csvData[i]){
				pattern = csvRules[ruleType + '_' + prop.toLowerCase()].fieldFormat;
				regexObj = new RegExp(pattern);

				//If a rule fails, the value is logged, along with the complete row
				if(!regexObj.test(csvData[i][prop]))
				{
					unmatchedLogObj['ruleName'] = ruleType + '_' + prop.toLowerCase();
					unmatchedLogObj['fieldName'] = prop;
					unmatchedLogObj['matchValue'] = csvData[i][prop];
					unmatchedLogObj['dataObj'] = csvData[i];
					unmatchedLog.push(unmatchedLogObj);
					console.log(unmatchedLogObj['ruleName']);
				}
				//console.log(csvData[i][prop]);
				//console.log(csvRules['FR_'+prop.toLowerCase()].FieldFormat);
			}
		}
}

function applyPositiveRules(ruleType){
	//applying the rules to the data
		ruleKeys = d3.keys(rulesData[0]);
		for(var i=0;i<csvData.length; i++){
			for(var prop in csvData[i]){
				pattern = csvRules[ruleType + '_' + prop.toLowerCase()].fieldFormat;
				regexObj = new RegExp(pattern);

				//If a rule passes, the value is logged, along with the complete row
				if(regexObj.test(csvData[i][prop]))
				{
					unmatchedLogObj['ruleName'] = ruleType + '_' + prop.toLowerCase();
					unmatchedLogObj['fieldName'] = prop;
					unmatchedLogObj['matchValue'] = csvData[i][prop];
					unmatchedLogObj['dataObj'] = csvData[i];					unmatchedLog.push(unmatchedLogObj);
					unmatchedLog.push(unmatchedLogObj);
					console.log(unmatchedLogObj['ruleName']);
				}
				//console.log(csvData[i][prop]);
				//console.log(csvRules['FR_'+prop.toLowerCase()].FieldFormat);
			}
		}


}

function getSummary(){
	for(var i=0;i<unmatchedLog.length;i++){
		unmatchedLogObj = unmatchedLog[i];
		
		for(var prop in unmatchedLogObj){
			//if(summaryResult[''])
			if(summaryResult.contains())
			summaryResultObj['ruleName'] = unmatchedLogObj['ruleName'];

		}
	}
}
