<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input-number style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-date-picker style="width: 100%" placeholder="请输入更新日期" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="描述" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? '收起' : '展开' }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button> 更多操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </a-space>
      <standard-table
        :bordered="true"
        :columns="columns"
        :loading="loading"
        :dataSource="dataSource"
        :row-key="(record) => record.id"
        :selectedRows.sync="selectedRows"
        :pagination="pagination"
        @clear="onClear"
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <div slot="description" slot-scope="{ text }">
          {{ text }}
        </div>
        <div slot="action" slot-scope="{ text, record }">
          <a style="margin-right: 8px"> <a-icon type="edit" />编辑 </a>
          <a style="margin-right: 8px" @click="deleteRecord(record.id)"> <a-icon type="delete" />删除</a>
          <router-link style="margin-right: 8px" :to="`/list/query/detail/${record.key}`"
            ><a-icon type="link" />详情</router-link
          >
          <a @click="deleteRecord(record.id)"> <a-icon type="play-circle" />运行</a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import { getProjectsDataList } from '@/services/projects'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '项目名称',
    dataIndex: 'project_name'
  },
  {
    title: '项目描述',
    dataIndex: 'project_desc'
  },
  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '最近修改人',
    dataIndex: 'modifier'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ProjectManagement',
  components: { StandardTable },
  created() {
    // 获取项目列表数据
    getProjectsDataList().then((res) => {
      this.dataSource = res.data.results
      this.pagination = {
        total: res.data.count,
        current: res.data.current_page_num,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showSizeChanger: true,
        showTotal: () => `共 ${res.data.count} 条`
      }
    })
  },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      pagination: {},
      loading: false
    }
  },
  methods: {
    deleteRecord(key) {
      console.log(key)
      // this.dataSource = this.dataSource.filter((item) => item.key !== key)
      // this.selectedRows = this.selectedRows.filter((item) => item.key !== key)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        (item) => this.selectedRows.findIndex((row) => row.key === item.key) === -1
      )
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(pagination, filters, sorter, { currentDataSource }) {
      this.loading = true
      getProjectsDataList({ page: pagination.current, size: pagination.pageSize }).then((res) => {
        this.dataSource = res.data.results
        this.pagination = pagination
        this.loading = false
      })
      console.log(pagination)
      console.log(filters)
      console.log(sorter)
      console.log(currentDataSource)
      console.log('------------------------------------------------------------------------------------------')
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    addNew() {
      this.dataSource.unshift({
        key: this.dataSource.length,
        no: 'NO ' + this.dataSource.length,
        description: '这是一段描述',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updatedAt: '2018-07-26'
      })
    },
    handleMenuClick(e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
