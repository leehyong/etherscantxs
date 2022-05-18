const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const util = require('../util')
const logger = require('../libs/logger');
const needle = require('needle')
const db = require('../db')
const https = require('https')
const fs = require('fs')
const path = require("path");



router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));


router.use('/txs', (req, res) => {
  let addr = req.param('a')
  if( !addr) return res.status(400).send("地址不能为空");
  if (!util.isValidEthAddr(addr)) return res.status(400).send("不是有效的以太坊账户地址");
  let page = parseInt(req.param('p'), 10) || 1;
  if (page < 1) page = 1;
  // 默认页面大小为50
  let pageSize = parseInt(req.param('size'), 10) || 50;
  if (pageSize < 1) pageSize = 50;
  // 只支持这些分页参数
  if ([10, 20, 30, 40, 50].indexOf(pageSize) === -1) pageSize = 50;
  let p = util.transferEtherScanIoPage(page, pageSize);
  // const url = `https://etherscan.io/txs?a=${addr}&p=${p}`
  const url = `/etherscantxs?a=${addr}&p=${p}`
  let fp = path.join(__dirname, "test.txt")
  let txs = db.getAddrTx(addr, page, pageSize)
  if (txs == null){
    logger.info("txs == null")
    fs.readFile(fp, 'utf-8', (err, data)=>{
      if (err){
        logger.error(err);
        res.sendStatus(400);
        return
      }
      txs = util.getAddrTxs(data);
      db.insertAddrTx(addr, txs);
      res.json({total: txs.total, txs: txs.txs.slice((page-1)*pageSize, page * pageSize)});
    })
  }else{
    logger.info("cached")
    res.json(txs);
  }

  /*needle.post(url,
    null,
    {
    rejectUnauthorized: false
  }, (error, _res, body)=>{
    if (error){
      logger.error(`请求${url}失败.错误：${error}`);
      res.sendStatus(400);
      return
    }
    if (_res.statusCode !== 200){
      logger.error(`请求${url}失败.错误码：${_res.statusCode}`);
      logger.error(_res.headers);
      logger.error(body);
      res.sendStatus(_res.statusCode);
      return
    }
    logger.info(body)
    res.json(util.getAddrTxs(body));
  });
  */
});







module.exports = router;
