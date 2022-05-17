<template>
  <div>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" />
  </div>
</template>

<script>
import axios from '../libs/api';

export default {
  name: 'account-tx',
  data() {
    return {
      user: '',
      total: 0,
      dataSource: [{ txHash: 1, blockNumber: 2 }],
    };
  },
  created() {
    axios.get('/api/user').then((res) => {
      console.log(res);
      this.user = res;
    });
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
          dataIndex: 'txHash',
          key: 'txHash',
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
          dataIndex: 'txFee',
          key: 'txFee',
        },
      ];
    },
  },
};
</script>
