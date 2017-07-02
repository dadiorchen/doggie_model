// @flow
/*
 * test fund model
 */
import {FundModel} from './FundModel.js'
import type {FundData} from './FundModel.js'

let DEBUG = true;
// $FlowFixMe: for jest 
console.debug = (...args) => {
	if(DEBUG){
		console.log(...args);
	}
}

describe('fund model test',() => {

	it('test: fetch data',() => {
		let model = new FundModel();
		let fundNumber = '096001';
		//DEBUG = false;
		return model.fetchFundData(fundNumber,2).then((data) => {
			let {totalNum,dataList} = data;
			console.log(`the result of data:totalNum:${totalNum},dataList:${dataList.length}`);
			expect(+totalNum).toBeGreaterThan(0);
			expect(dataList && +dataList.length).toBeGreaterThan(0);
		});
	});


	it('test: format data , and save data to file',() => {
		
	});



	const dataList = [
	{
		date : 20170101,
		jjjz : 1.00,
	},
	{
		date : 20170102,
		jjjz : 1.10,
	},
	{
		date : 20170103,
		jjjz : 1.20,
	},
	{
		date : 20170104,
		jjjz : 1.30,
	},
	{
		date : 20170105,
		jjjz : 1.40,
	},
	{
		date : 20170106,
		jjjz : 1.50,
	}
	]
		
	it('test: calculate earing:',() => {
		let model = new FundModel();
		let earning = model.calculateEarning(dataList,20170101,20170105);
		expect(earning).toBeCloseTo(0.4,5);

	});


	/*
	 * from : 201701->201706, period : 2days(not include the beginning day)
	 * every day : 01-03: 20%  ; 02-04: 18%  ; 05-06: 7%
	 * */
	it('test: calculate period earning',() => {
		let model = new FundModel();
		expect(model.calculatePeriodEarning(dataList,20170101,2)).toBeCloseTo(0.20,2);//2 = 2days
		expect(model.calculatePeriodEarning(dataList,20170102,2)).toBeCloseTo(0.18,2);//2 = 2days
		expect(model.calculatePeriodEarning(dataList,20170105,2)).toBeCloseTo(0.07,2);//2 = 2days
	});
});
