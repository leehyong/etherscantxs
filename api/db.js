const LRU = require("lru-cache");
const logger = require("./libs/logger");

const cachedAddr = new LRU({
  max: 100, // cache at most 100 个地址
  maxAge: 20 * 60 * 1000, // cache for 20 min
});

// 从数据库里获取对应页的数据
function getAddrTx(addr, page, size) {
  const cachedTxs = cachedAddr.get(addr);
  // logger.info("cachedTxs", cachedTxs);
  if (cachedTxs && cachedTxs.txs && cachedTxs.txs.length >= page * size) {
    // 说明缓存是有效的, 直接从数据库读取数据
    return {
      total: cachedTxs.total,
      txs: cachedTxs.txs.slice((page - 1) * page, page * size)
    };
  }
  return null;
}

// 向缓存里插入一批交易记录，如果某些记录已经在缓存里了，则忽略
/*
* addr: 地址
* txs: 地址对应的交易记录
* */
function insertAddrTx(addr, txs) {
  // logger.info(txs instanceof (Array), typeof txs);
  if (!txs || !(txs.txs instanceof (Array))) return;
  let insertedTxs = {};
  const cachedTxs = cachedAddr.get(addr);
  if (cachedTxs && cachedTxs.txs) {
    for (let doc of cachedTxs.txs) {
      insertedTxs[doc._id] = 1;
    }
  }
  let news = cachedTxs && cachedTxs.txs || [];
  for (let tx of txs.txs) {
    if (insertedTxs[tx._id]) {
      continue;
    }
    news.push(tx);
  }
  cachedAddr.set(addr, {
    txs: news,
    total: txs.total,
  });
}


module.exports = {
  insertAddrTx,
  getAddrTx,
};

