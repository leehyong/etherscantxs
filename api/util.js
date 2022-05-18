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
*  html: 字符串
*  Returns: CheerioAPI
* */
function parseHtml(html) {
  if (!html) return null;
  if (typeof html != 'string') return null;
  return cheerio.load(html, null, false);
}

/*
* 把text对应的字符串的转换为以太坊地址对应的交易历史
*
* Params:
*  text: 字符串
*  Returns: Array
* */
const valueIntReg = /^(\d+)<b>/

function getAddrTxs(text) {
  if (!text) return null;
  const $ = parseHtml(text);
  if (!$) return null;
  let results = [];
  $('tbody>tr').each(function(_, elem) {
    logger.log(elem);
    let txHash = $('a.myFnExpandBox_searchVal[href^="/tx/"]', $(this)).text();
    if (!txHash) {
      logger.error('txHash不存在，忽略');
      return;
    }
    let tx = {
      _id: txHash,
    };
    $('.hash-tag', $(this)).each(function(i, elem2) {
        if ($(this).tagname === "a"){
          tx.to = $(this).attr("title");
        }else{
          tx.from = $(this).text();
        }
    });
    if (!tx.to || !tx.from){
      logger.error(`忽略交易${txHash},因为` + (!tx.to ? "to为空": "") + (!tx.from ? " from为空": ""))
      return;
    }
    let dt = $(".showDate span", $(this)).text();
    if (!dt){
      logger.error("交易时间为空,忽略");
      return;
    }
    tx.time = dt;
    let blockNumber = $("a[href^='/block/']", $(this)).text();
    if (!blockNumber){
      logger.error("区块号为空,忽略");
      return;
    }
    //倒数第三个是Value
    let tdLast3 = $("td:nth-last-child(3)", $(this))
    let valueInt = getValueIntPart(tdLast3.text())
    let valueDecimal = $("span.text-secondary", tdLast3).text()
    if (valueInt == null || !valueDecimal){
      logger.error("Value 不存在，忽略");
      return;
    }
    // 不做浮点数转换， 就用字符串保存就好
    tx.value = valueInt + valueDecimal
    let fee = $("td.showTxnFee > span", $(this)).text()?.replace("<b>", "").replace("</b>").strip()
    if (fee.length === 0){
      logger.error("交易费不存在，忽略");
      return;
    }
    tx.fee = fee;
    results.push(tx);
  });
  return results;
}

/*
* 获取交易值的整数部分
*
* Params:
*  text: 字符串
*  Returns: 字符串 或者 null
* */
function getValueIntPart(text){
  let v = valueIntReg.exec(text)
  if (v && v.length === 2){
    return v[1];
  }
  return null;
}

const etherScanIoPageSize = 50;

function transferEtherScanIoPage(pageNo, pageSize){
  return Math.floor((pageNo  * pageSize) / etherScanIoPageSize) + 1
}

module.exports = {
  isValidEthAddr,
  getValueIntPart,
  getAddrTxs,
  transferEtherScanIoPage
};
