const LRU = require("lru-cache");
const logger = require("./libs/logger");

const cachedAddr = new LRU({
  max: 100, // cache at most 100 个地址
  maxAge: 20 * 60 * 1000, // cache for 20 min
});

/*
* 从缓存里获取对应页的数据
* Params:
*  addr: 以太仿地址
*  page: 页号
*  size: 每页数据的大小
* Returns: CheerioAPI || null
*  */

function getAddrTx(addr, page, size) {
  const cachedTxs = cachedAddr.get(addr);
  // logger.info("cachedTxs", cachedTxs);
  if (cachedTxs && cachedTxs.txs && cachedTxs.txs.length >= page * size) {
    // 当前请求页的数据，已经被请求过了，
    // 说明缓存是有效的, 直接从缓存里读取数据
    return {
      total: cachedTxs.total,
      txs: cachedTxs.txs.slice((page - 1) * size, page * size)
    };
  }
  return null;
}

/*
向缓存里插入一批交易记录，如果某些记录已经在缓存里了，则忽略
* params
*   addr: 地址
*   txs: 地址对应的交易记录对象，Object类型,结构如下:
{
  total:number, txs:
  [
   {
     _id:'交易hash',
     blockNumber:number,
     from:'发送方地址',
     to:'接收方地址',
     fee:'交易手续费',
     value:number
   }
  ]
* }
* Return: null;
* */
function insertAddrTx(addr, txs) {
  // logger.info(txs instanceof (Array), typeof txs);
  if (!txs || !(txs.txs instanceof (Array))) return;
  let insertedTxs = {};
  const cachedTxs = cachedAddr.get(addr);
  if (cachedTxs && cachedTxs.txs) {
    for (let tx of cachedTxs.txs) {
      insertedTxs[tx._id] = 1;
    }
  }
  let news = cachedTxs && cachedTxs.txs || [];
  for (let tx of txs.txs) {
    if (insertedTxs[tx._id]) {
      continue;
    }
    news.push(tx);
  }
  // 重新设置缓存
  cachedAddr.set(addr, {
    txs: news,
    total: txs.total,
  });
}


module.exports = {
  insertAddrTx,
  getAddrTx,
};

