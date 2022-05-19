const request = require('supertest');
const app = require('../index');

describe('get /api/txs', function() {
  it('test api txs', function() {
    const server = request(app);
    server
      .get('/api/txs')
      .expect(400)
      .expect('Content-Type', /text/)
      .expect('地址不能为空');
    const errAddr = "0xZYXb5d4c32345ced77393b3530b1eed0f346429d";
    server.get(`/api/txs?a=${errAddr}`)
      .expect(400)
      .expect('Content-Type', /text/)
      .expect('不是有效的以太坊账户地址');
    const addr = '0x323b5d4c32345ced77393b3530b1eed0f346429d';
    server
      .get(`/api/txs?a=${addr}`)
      .expect('Content-Type',/json/);
  });
})
