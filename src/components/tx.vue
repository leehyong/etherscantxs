<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <a-input-search style="flex: 80px" v-model="addr" placeholder="请输入地址"></a-input-search>
      <a-button style="flex: 80px" @click="getAddrTxs">查询</a-button>
      <div style="flex: 1"></div>
    </div>
    <a-table
      ref="table"
      :dataSource="dataSource"
      rowKey="_id"
      :columns="columns"
      :pagination="pagination"
      @change="tableChange" />
  </div>
</template>

<script>
import axios from '../libs/api';
const logger = console;

export default {
  name: 'account-tx',
  data() {
    return {
      addr: '0xeb2a81e229b68c1c22b6683275c00945f9872d90',
      total: 0,
      p: 1,
      pageSize: 50,
      dataSource: [{ _id: 1, blockNumber: 2 }],
    };
  },
  methods: {
    tableChange(pageNation) {
      this.p = pageNation.current;
      this.pageSize = pageNation.pageSize;
      this.getAddrTxs();
    },
    getAddrTxs() {
      if (!this.addr) {
        logger.error('请先输入地址再查询');
        return;
      }
      let p = this.p;
      let pageSize = this.pageSize;
      logger.info(this.$data);
      let url = `/api/txs?a=${this.addr}&p=${p}&size=${pageSize}`;
      axios.get(url).then((res) => {
        console.log(res);
        this.dataSource = res.data;
      });
    },
  },
  computed: {
    pagination() {
      return {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 50,
        total: this.total,
      };
    },
    columns() {
      return [
        {
          title: '交易Hash',
          dataIndex: '_id',
          key: '_id',
        },
        {
          title: '区块',
          dataIndex: 'blockNumber',
          key: 'blockNumber',
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: 'From',
          dataIndex: 'from',
          key: 'from',
        },
        {
          title: 'To',
          dataIndex: 'to',
          key: 'to',
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
        },
        {
          title: 'TxFee',
          dataIndex: 'fee',
          key: 'fee',
        },
      ];
    },
  },
};
</script>
