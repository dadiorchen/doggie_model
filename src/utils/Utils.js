/*
 *
 * date: 20170101
 * periodDays: 2
 * return : 20170103
 * */
export const getDateAfter = function (date,periodDays){
	if(! /\d{8}/.test(date + ""))
		throw new Error(`its not valid date:${date}`);
	let dateObj = new Date(date.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)/,'$1-$2-$3'))
	let b = new Date(dateObj.getTime() + periodDays * 86400000)
	return +(`${b.getFullYear()}${b.getMonth() + 1 < 10?'0':''}${b.getMonth() + 1}${b.getDate() < 10?'0':''}${b.getDate()}`);
}
