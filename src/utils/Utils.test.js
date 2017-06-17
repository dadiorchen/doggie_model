import * as Utils from './Utils.js'

describe('utils test',() => {


	it('test: test date period',() => {
		expect(Utils.getDateAfter(20170101,2)).toBe(20170103);
		expect(Utils.getDateAfter(20170131,2)).toBe(20170202);
	});
});
