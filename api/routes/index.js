const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const util = require('../util')
const logger = require('../libs/logger');
// const needle = require('needle')
// const https = require('https')
const db = require('../db')
const fs = require('fs')
const path = require("path");



router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

// 查询账户的交易历史记录
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

  let txs = db.getAddrTxs(addr, page, pageSize)
  if (txs == null){
    logger.info("txs == null")
    getTxsFromFile(res, addr, page, pageSize);
    // getTxsFromUrl(res, addr, page, pageSize);
  }else{
    logger.info("cached")
    res.json(txs);
  }
});

/*
* 从文件里获取账户的交易历史记录
*
* Params:
*  res: express Response对象
*  addr: 以太坊账户地址, string
*  page: 页号, number
*  pageSize: 页大小, number
* Returns: null
* */
function getTxsFromFile(res, addr, page, pageSize){
  let fp = path.join(__dirname, "test.txt")
  fs.readFile(fp, 'utf-8', (err, data)=>{
    if (err){
      logger.error(err);
      res.sendStatus(400);
      return
    }
    saveAndReturnTxs(res, addr, page, pageSize, data);
  });
}

/*
* 从给定的html文档字符串中解析出账户的交易历史记录,
* 并把这些历史记录存在缓存里,
* 然后写入http连接的Response对象里发送出去
*
* Params:
*  res: express Response对象
*  addr: 以太坊账户地址, string
*  page: 页号, number
*  pageSize: 页大小, number
*  htmlData: html文档字符串, string
* Returns: null
* */
function saveAndReturnTxs(res, addr, page, pageSize, htmlData){
  let txs = util.parseAddrTxs(htmlData);
  db.insertAddrTxs(addr, txs);
  res.json({total: txs.total, txs: txs.txs.slice((page - 1) * pageSize, page * pageSize)});
}

/*
* 从给定的url里获取账户的交易历史记录
*
* Params:
*  res: express Response对象
*  addr: 以太坊账户地址, string
*  page: 页号, number
*  pageSize: 页大小, number
* Returns: null
* */
function getTxsFromUrl(res, addr, page, pageSize){
  let p = util.transferEtherScanIoPage(page, pageSize);
  const url = `/etherscantxs?a=${addr}&p=${p}`
  needle.post(
    url,
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
        logger.error(body);
        res.sendStatus(_res.statusCode);
        return
      }
      saveAndReturnTxs(res, addr, page, pageSize, body);
    });
}

module.exports = router;
