<template>
  <div style="padding: 0 10px">
    <div style="margin-bottom: 10px">
      <a-row type="flex">
        <a-col :flex="'380px'">
          <a-input-search v-model="addr" placeholder="请输入地址" @search="getAddrTxs"></a-input-search>
        </a-col>
        <a-col :flex="'80px'">
          <a-button @click="getAddrTxs">查询</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      ref="table"
      :dataSource="dataSource"
      rowKey="_id"
      :columns="columns"
      :pagination="pagination"
      :showTotal="true"
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
      let url = `/api/txs?a=${this.addr}&p=${p}&size=${pageSize}`;
      axios.get(url).then((res) => {
        this.total = res.data.total;
        this.dataSource = res.data.txs;
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
