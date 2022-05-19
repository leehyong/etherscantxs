const request = require('supertest');
const app = require('../index');

describe('get /api/txs', function() {
  it('test api txs 400 1', function() {
    const server = request(app);
    return server
      .get('/api/txs')
      .expect(400)
      .expect('Content-Type', /text/)
      .expect('地址不能为空');
  });
})

describe('get /api/txs', function() {
  it('test api txs 400 2', function() {
    const server = request(app);
    const errAddr = "0xZYXb5d4c32345ced77393b3530b1eed0f346429d";
    return server.get(`/api/txs?a=${errAddr}`)
      .expect(400)
      .expect('Content-Type', /text/)
      .expect('不是有效的以太坊账户地址');

  });
})

describe('get /api/txs', function() {
  it('test api txs ok', function() {
    const server = request(app);
    const addr = '0x323b5d4c32345ced77393b3530b1eed0f346429d';
    return server
      .get(`/api/txs?a=${addr}`)
      .expect(200)
      .expect('Content-Type',/json/);
  });
})
