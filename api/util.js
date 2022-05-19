const cheerio = require('cheerio');
const logger = require('./libs/logger');

const simpleEthAddrRep = /^0x[0-9a-fA-F]{40}$/;

/* 简单校验一个地址是否是以太坊地址
* Params:
*  addr:  – 地址
* Returns: boolean
*/
function isValidEthAddr(addr) {
  return addr && simpleEthAddrRep.test(addr);
}

/*
* 把html对应的字符串的转换为dom相关的对象
*
* Params:
*  html: 可以解析为DOM树的html字符串
* Returns: CheerioAPI
* */
function parseHtml(html) {
  if (!html) return null;
  if (typeof html != 'string') return null;
  return cheerio.load(html, null, false);
}

const totalReg = /of\s*(.+)\s*transactions/
/*
* 解析记录总数
*
* Params:
*  text: 字符串,满足 totalReg 的格式
* Returns: number
* */
function parseTotal(text){
  if (!text) return 0;
  let e = totalReg.exec(text)
  if (e && e.length > 1){
    return parseInt(e[1].trim().replace(/,/g, ""), 10) || 0
  }
  return 0
}
/*
* 把text对应的字符串的解析为以太坊地址对应的交易历史
*
* Params:
*  text: 字符串
* Returns: Array
* */
function parseAddrTxs(text) {
  if (!text) return null;
  const $ = parseHtml(text);
  if (!$) return null;
  let results = [];
  let total = parseTotal($("#ContentPlaceHolder1_topPageDiv>p>span").text().trim())
  logger.info( `total:${total}`)
  $('tbody>tr').each(function(_, elem) {
    let txHash = $('a.myFnExpandBox_searchVal[href^="/tx/"]', $(this)).text();
    if (!txHash) {
      logger.error('txHash不存在，忽略');
      return true;
    }
    let tx = {
      _id: txHash,
    };
     $('.hash-tag[data-html]', $(this)).each((i,elem)=>{
      if (i === 0){
        tx.from = $(elem).text() || $(elem).attr("title");
      }else{
        tx.to = $(elem).attr("title");
      }
    });
    if (!tx.to || !tx.from){
      logger.error(`忽略交易${txHash},因为` + (!tx.to ? "to为空": "") + (!tx.from ? " from为空": ""))
      return true;
    }
    let dt = $(".showDate span", $(this)).text();
    if (!dt){
      logger.error(`交易时间为空,忽略,hash:${txHash}`);
      return true;
    }
    tx.time = dt;
    tx.blockNumber = $("a[href^='/block/']", $(this)).text();
    if (!tx.blockNumber){
      logger.error(`区块号为空,忽略,hash:${txHash}`);
      return true;
    }
    //倒数第三个是Value
    let tdLast3 = $("td:nth-last-child(3)", $(this))
    // 不做浮点数转换， 就用字符串保存就好
    tx.value = tdLast3.text().replace("Ether", "").trim()
    if (!tx.value){
      logger.error(`Value 不存在，忽略: ${tdLast3.text()},hash:${txHash}`);
      return true;
    }
    let fee = $("td.showTxnFee > span", $(this)).text()?.replace("<b>", "").replace("</b>").trim()
    if (fee.length === 0){
      logger.error(`交易费不存在，忽略,hash:${txHash}`);
      return true;
    }
    tx.fee = fee;
    results.push(tx);
  });
  return {
    total,
    txs: results
  };
}

const etherScanIoPageSize = 50;


function transferEtherScanIoPage(pageNo, pageSize){
  let mul = pageNo  * pageSize;
  let mod = mul % etherScanIoPageSize
  let div = Math.floor((pageNo  * pageSize) / etherScanIoPageSize)
  return mod === 0 ? div : div + 1
}

module.exports = {
  isValidEthAddr,
  parseAddrTxs,
  parseTotal,
  transferEtherScanIoPage,
  etherScanIoPageSize
};

