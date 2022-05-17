const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const util = require('../util')

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));


router.use('/txs', (req, res) => {
  let addr = req.param['a']
  if( !addr) return res.status(400).send("地址不能为空");
  if (!util.isValidEthAddr(addr)) return res.status(400).send("不是有效的以太坊账户地址");
  let page = parseInt(req.param['p'], 10) || 1;
  // 默认页面大小为50
  let pageSize = parseInt(req.param['pageSize'], 10) || 50;
  // 只支持这些分页参数
  if ([10, 20, 30, 40, 50].indexOf(pageSize) == -1) pageSize = 50;


  return res.json(req.user || {});
});






module.exports = router;
