const assert = require('assert');
const util = require("../util")


describe('ValidEthAddr', function () {
  describe('test', function () {
    it('should return false when the addr is not valid', function () {
      const okAddr = "0x323b5d4c32345ced77393b3530b1eed0f346429d";
      assert.equal(util.isValidEthAddr(okAddr), true);
      const errAddr = "0xZYXb5d4c32345ced77393b3530b1eed0f346429d";
      assert.equal(util.isValidEthAddr(errAddr), false);
    });
  });
});

describe('parseTotal', function () {
  describe('test', function () {
    it('should return null when the text is not valid', function () {
      let okV = " A total of 1,507 transactions found";
      assert.equal(util.parseTotal(okV), 1507);
      okV = " A total of 1,221,507 transactions found";
      assert.equal(util.parseTotal(okV), 1221507);
      let errV = "A total fasfa 1,221,507 eew found";
      assert.equal(util.parseTotal(errV), 0);
      errV = "A total fasfa 22 eew found";
      assert.equal(util.parseTotal(errV), 0);
    });
  });
});
