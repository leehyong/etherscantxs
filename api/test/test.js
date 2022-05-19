const assert = require('assert');
const util = require("../util")
const db = require("../db")


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


describe('parseAddrTxs', function () {
  describe('test', function () {
    it('should return null when the text is not valid', function () {
      const history = `
      <tbody>
      <tr>
    <td><a role='button' tabindex='0' type='button'
            class='js-txnAdditional-1 btn btn-xs btn-icon btn-soft-secondary myFnExpandBox'><i
                class='far fa-eye btn-icon__inner'></i></a></td>
    <td><span class='hash-tag text-truncate'><a
                href='/tx/0xbf2b128cff5682386ff6124e8423208c5c48525f413902ead75c0f556e881763'
                class='myFnExpandBox_searchVal'>0xbf2b128cff5682386ff6124e8423208c5c48525f413902ead75c0f556e881763</a></span>
    </td>
    <td><span style="min-width:68px;"
            class="u-label u-label--xs u-label--info rounded text-dark text-center"
            data-toggle="tooltip" data-boundary="viewport" data-html="true"
            title="Multicall">Multicall</span></td>
    <td class="d-none d-sm-table-cell"><a href='/block/14777116'>14777116</a></td>
    <td class='showDate ' style='display:none !important; '><span rel='tooltip'
            data-toggle='tooltip' data-placement='bottom'
            title='2 days 11 hrs ago'>2022-05-15 1:33:13</span></td>
    <td style='' class='showAge '><span rel='tooltip' data-toggle='tooltip'
            data-placement='bottom' title='2022-05-15 1:33:13'>2 days 11 hrs
            ago</span></td>
    <td><span class='hash-tag text-truncate' data-toggle='tooltip'
            data-boundary='viewport' data-html='true'
            title='0xeb2a81e229b68c1c22b6683275c00945f9872d90'>0xeb2a81e229b68c1c22b6683275c00945f9872d90</span>
    </td>
    <td class='text-center'><span
            class="u-label u-label--xs u-label--warning color-strong text-uppercase text-center w-100 rounded text-nowrap">OUT</span>
    </td>
    <td><span style='white-space: nowrap;'><i class="far fa-file-alt text-secondary"
                data-toggle='tooltip' data-boundary='viewport' data-html='true'
                title='Contract'></i> <a class='hash-tag text-truncate'
                href='/address/0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
                data-toggle='tooltip' data-boundary='viewport' data-html='true'
                title='Uniswap V3: Router 2&#10;(0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45)'>Uniswap
                V3: Router 2</a></td>
    <td>0<b>.</b><span class='text-secondary'>75</span> Ether</td>
    <td style='' class='showTxnFee'><span
            class='small text-secondary'>0<b>.</b>00685354</span>
        <font color='green'><i class='fad fa-lightbulb-dollar'
                title='Type 2 - EIP 1559'></i></font>
    </td>
    <td style='display:none !important; ' class='showGasPrice'><span
            class='small text-secondary'>23<b>.</b>007677003</span></td>
</tr>
</tbody>
      `;
      let data = util.parseAddrTxs(history)
      assert.equal(data.txs.length, 1);
      assert.equal(data.total, 0);
      let tx = data.txs[0];
      assert.equal(tx._id, "0xbf2b128cff5682386ff6124e8423208c5c48525f413902ead75c0f556e881763");
      assert.equal(tx.blockNumber, "14777116");
      assert.equal(tx.time, "2022-05-15 1:33:13");
      assert.equal(tx.from, "0xeb2a81e229b68c1c22b6683275c00945f9872d90");
      assert.equal(tx.to, "Uniswap V3: Router 2\n(0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45)");
      assert.equal(tx.value, "0.75");
      assert.equal(tx.fee, "0.00685354");
    });
  });
});



describe('transferEtherScanIoPage', function () {
  describe('test', function () {
    it('should return null when the text is not valid', function () {
      assert.equal(util.transferEtherScanIoPage(1, 20), 1);
      assert.equal(util.transferEtherScanIoPage(1, 50), 1);
      assert.equal(util.transferEtherScanIoPage(2, 40), 2);
      assert.equal(util.transferEtherScanIoPage(3, 40), 3);
      assert.equal(util.transferEtherScanIoPage(4, 30), 3);
      assert.equal(util.transferEtherScanIoPage(6, 20), 3);
    });
  });
});

describe('db insertAddrTxs & parseAddrTxs', function () {
  describe('test', function () {
    it('should return null when the text is not valid', function () {
      let addr = "lee";
      let to = "sen";
      let total = 100;
      let txs = [
        {_id: "123fasfa1", from: addr, to: to, value: 23, fee: 1, blockNumber: 12},
        {_id: "weqweq", from: addr, to: to, value: 13, fee: 2, blockNumber: 18},
        {_id: "vfqweq", from: to, to: addr, value: 43, fee: 5, blockNumber: 16},
      ];
      let data = {
        total,
        txs
      }
      db.insertAddrTxs(addr, data)
      // 此时返回全部数据
      let cache = db.getAddrTxs(addr, 1, 3);
      assert.equal(cache.total, total);
      assert.equal(cache.txs.length, txs.length);
      assert.equal(cache.txs[0]._id, "123fasfa1");
      assert.equal(cache.txs[1].from, addr);
      assert.equal(cache.txs[2].blockNumber, 16);

      // 此时只返回2条数据
      cache = db.getAddrTxs(addr, 1, 2);
      assert.equal(cache.total, total);
      assert.equal(cache.txs.length, 2);
      assert.equal(cache.txs[0]._id, "123fasfa1");
      assert.equal(cache.txs[1].from, addr);

      // 此时只返回一条数据
      cache = db.getAddrTxs(addr, 2, 1); // 请求第二页的数据
      assert.equal(cache.total, total);
      assert.equal(cache.txs.length, 1);
      assert.equal(cache.txs[0]._id, "weqweq");

      // 此时只返回null,
      cache = db.getAddrTxs(addr, 1, 30); // 请求第二页的数据
      assert.equal(cache, null);
      // 此时只返回null,
      cache = db.getAddrTxs(addr, 2, 2); // 请求第二页的数据
      assert.equal(cache, null);
      // 此时只返回null,
      cache = db.getAddrTxs(addr, 2, 8); // 请求第二页的数据
      assert.equal(cache, null);

    });
  });
});
