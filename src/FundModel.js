/*
 * the fund model : deal with the fund data, fetch data from sina, generate the data for render a chart
 */
import fetch from 'isomorphic-fetch';
import * as Utils from './utils/Utils.js';


const ITEMS_PER_PAGE = 20;

export class FundModel {
	constructor(){
	}

	/*
	 * to fetch data from website , and return a promise
	 */
	fetchFundData(fundNumber,limit = 10){
		if(!fundNumber) throw new Error('need fundNumber:',fundNumber);
		console.debug('fetch fund:',fundNumber);
		return this.getTotalNum(fundNumber).then(totalNum => {
			if(totalNum > limit){
				console.debug(`totalNum too big ${totalNum}, limit to ${limit}`);
				totalNum = limit;
			}
			console.debug(`ready to fetch, totalNum:${totalNum},limit :${limit}`);
			let pages = [...Array(Math.floor(+totalNum / ITEMS_PER_PAGE) + (+totalNum % ITEMS_PER_PAGE ? 1:0) ).keys()].map(v => v+1);
			console.debug('to load pages:',pages.length);
			let result = {
				totalNum:0,
				dataList:[]
			};
			return pages.reduce(
				(finishedRequests,pageNum) => finishedRequests
						.then(r => {
							//console.debug('the result:',r);
							return this.fetchOnePageFundData(fundNumber,pageNum)
								.then(r1 => 
										({
											totalNum:r1.totalNum,
											dataList:r1.dataList ? r.dataList.concat(r1.dataList): r.dataList,
										}));
						})
				,Promise.resolve(result));
		});
	}


	getTotalNum(fundNumber){
		return new Promise((resolve,reject) => {
			let url = `http://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?symbol=${fundNumber}&datefrom=&dateto=&page=1`;
			console.debug('to fetch url:',url);
			fetch(
				url,
				{
					method : 'GET',
				}
			).then(function(res){
				console.debug('http response ok:',res.ok); 
				return res.json();
			}).then(json => {
				//deal the result
				let totalNum = json.result.data.total_num;
				console.debug(`fetched data, totalNum:${totalNum}`),
				resolve(totalNum);
			}).catch(function(res){
				console.warn('fetch fund data error',res);
			});
		});
	}

	fetchOnePageFundData(fundNumber,pageNum){
		return new Promise((resolve,reject) => {
			let url = `http://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?symbol=${fundNumber}&datefrom=&dateto=&page=${pageNum}`;
			console.debug('to fetch url:',url);
			fetch(
				url,
				{
					method : 'GET',
				}
			).then(function(res){
				console.debug('http response ok:',res.ok); 
				return res.json();
			}).then(json => {
				//deal the result
				let totalNum = json.result.data.total_num;
				let dataList = json.result.data.data;
				console.debug(`fetched data, totalNum:${totalNum},datalist:${dataList && dataList.length}`);
				resolve({
					totalNum,
					dataList});
			}).catch(function(res){
				console.warn('fetch fund data error',res);
			});
		});
	}

	/*
	 * calcuate the earing , between two date,
	 * dataList: 
	 *   [{
	 *   	date:20170101,
	 *   	jjjz:1.0622,
	 *   },... ]
	 * */
	calculateEarning(dataList,beginDate,endDate){
		let begin = this.getNearest(dataList,beginDate);
		let end = this.getNearest(dataList,endDate);
		if(!begin || !end){
			throw new Error('no date find:',begin,end);
		}
		const r =  this.earning(begin.jjjz,end.jjjz);
		console.debug(`calcurate earning,begin:${begin},end:${end},result:${r}`);
		return r;
	}

	earning(price1,price2){
		//console.debug(`price1:${price1},price2:${price2}`);
		return (price2-price1)/price1;
	}

	getNearest(dataList,date){
		if(dataList && dataList.length > 0){
			for(let d in dataList){
				//console.debug(`the list date:${dataList[d].date},the date:${date}`);
				if(dataList[d].date >= date){
					return dataList[d];
				}
			}
			//if not found , get the lastest one
			return dataList[dataList.length -1];
		}else{
			throw new Error('null data list:',dataList);
		}
		return null;
	}

	calculatePeriodEarning(dataList,beginDate,periodDays){
		let endDate = Utils.getDateAfter(beginDate,periodDays);
		return this.calculateEarning(dataList,beginDate,endDate);
	}


}



/*
 * the structure for fund data
 * */
export class FundData {
}
