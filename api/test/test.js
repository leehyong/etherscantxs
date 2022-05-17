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
