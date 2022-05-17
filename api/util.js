
const simpleEthAddrRep = /^0x[0-9a-fA-F]{40}$/
function isValidEthAddr(addr){
  return simpleEthAddrRep.test(addr)
}

module.exports = {
  isValidEthAddr,
};
