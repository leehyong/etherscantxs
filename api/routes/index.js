const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
import * as util from '../util'

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));


router.use('/txs', (req, res) => {
  let addr = req.param['a']
  if( !addr) return res.status(400).send("地址不能为空");
  if (!util.isValidEthAddr(addr)) return res.status(400).send("不是有效的以太坊账户地址");
  return res.json(req.user || {});
});






module.exports = router;
