<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="testcaseCombinationQueryForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="用例名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" allowClear v-decorator="['testcase_name']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="用例描述" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" allowClear v-decorator="['testcase_desc']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="创建人" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" allowClear v-decorator="['creator']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="最近修改人" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" allowClear v-decorator="['modifier']" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="combinationQuery">查询</a-button>
          <a-button style="margin-left: 8px" @click="combinationReset">重置</a-button>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="createNewTestcase" type="primary">新建用例</a-button>
      </a-space>
      <standard-table
        bordered
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
          <a style="margin-right: 8px" @click="editTestcase(record.id)"> <a-icon type="edit" />编辑 </a>
          <a style="margin-right: 8px" @click="deleteTestcase(record.id)"> <a-icon type="delete" />删除</a>
          <a style="margin-right: 8px" @click="getTestcaseDetail(record.id)"> <a-icon type="info-circle" />详情</a>
          <a @click="runTestcase(record.id)"> <a-icon type="play-circle" />运行</a>
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
import { getTestcasesDataList, deleteDetailTestcase } from '@/services/testcases'
import EventBus from '@/utils/event-bus'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '用例名称',
    dataIndex: 'testcase_name',
    ellipsis: true
  },
  {
    title: '用例描述',
    dataIndex: 'testcase_desc',
    ellipsis: true
  },
  {
    title: '所属套件',
    dataIndex: 'testsuite_name',
    ellipsis: true
  },
  {
    title: '所属套件ID',
    dataIndex: 'testsuite'
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
    dataIndex: 'create_time'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TestcasesManagement',
  components: { StandardTable },
  created() {
    // 获取用例列表数据
    getTestcasesDataList().then((res) => {
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
    // 新建用例&更新用例 后刷新用例列表数据
    EventBus.$on('refreshTestcasesDataList', this.refreshTestcasesDataList)
  },
  // 组件销毁时，注销自定义事件
  destroyed() {
    EventBus.$off('refreshTestcasesDataList')
  },
  data() {
    return {
      testcaseCombinationQueryForm: this.$form.createForm(this, { name: 'testcase_combination_query_form' }),
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      pagination: {},
      filters: {},
      loading: false
    }
  },
  methods: {
    runTestcase(testcaseId) {
      console.log(testcaseId)
    },
    combinationQuery() {
      this.testcaseCombinationQueryForm.validateFields((err, values) => {
        if (err) {
          return false
        }
        // 删除无效数据
        for (let key of Object.keys(values)) {
          if (values[key] === undefined || values[key] === '') {
            delete values[key]
          }
        }
        this.loading = true
        // 重新获取用例列表数据(传入过滤参数)并更新数据
        values.page = this.pagination.current
        values.size = this.pagination.pageSize
        getTestcasesDataList(values).then((res) => {
          this.filters = values
          this.dataSource = res.data.results
          this.pagination.total = res.data.count
          this.pagination.current = res.data.current_page_num
          this.pagination.showTotal = () => `共 ${res.data.count} 条`
          this.loading = false
        })
      })
    },
    combinationReset() {
      // 清空表单数据
      this.testcaseCombinationQueryForm.resetFields()
      // 刷新列表数据
      this.loading = true
      // 重新获取用例列表数据(传入过滤参数)并更新数据
      getTestcasesDataList({ page: this.pagination.current, size: this.pagination.pageSize }).then((res) => {
        this.dataSource = res.data.results
        this.filters = {}
        this.pagination.total = res.data.count
        this.pagination.current = res.data.current_page_num
        this.pagination.showTotal = () => `共 ${res.data.count} 条`
        this.loading = false
      })
    },
    // 创建新用例
    createNewTestcase() {
      this.$router.push('/testcases/create')
    },
    // 刷新用例列表数据
    refreshTestcasesDataList() {
      this.loading = true
      let filters = this.filters
      filters.page = this.pagination.current
      filters.size = this.pagination.pageSize
      // 重新获取用例列表数据并更新数据
      getTestcasesDataList(filters).then((res) => {
        this.dataSource = res.data.results
        this.pagination.total = res.data.count
        this.pagination.current = res.data.current_page_num
        this.pagination.showTotal = () => `共 ${res.data.count} 条`
        this.loading = false
      })
    },
    // 编辑单个用例
    editTestcase(key) {
      // 通过命名路由传递需要更新用例的用例ID
      this.$router.push({ name: '更新用例', params: { updateTestcaseId: key } })
    },
    getTestcaseDetail(detailTestcaseId) {
      this.$router.push({ name: '用例详情', params: { detailTestcaseId: detailTestcaseId } })
    },
    // 删除单个用例
    deleteTestcase(key) {
      // confirm中使用self来访问当前组件中的this
      let self = this
      // 删除用例确认对话框
      this.$confirm({
        title: '确定要删除此用例吗?',
        content: '删除此用例后，此用例信息将被彻底删除!',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteDetailTestcase(key).then(() => {
            self.$message.success('删除成功')
            self.refreshTestcasesDataList()
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
      console.log('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
      console.log('你点击了状态栏表头')
    },
    onChange(pagination, filters, sorter, { currentDataSource }) {
      this.loading = true
      // 页码变化时传入筛选条件
      filters = this.filters
      filters.page = pagination.current
      filters.size = pagination.pageSize
      getTestcasesDataList(filters).then((res) => {
        this.dataSource = res.data.results
        this.pagination = pagination
        this.loading = false
      })
      // console.log(pagination)
      // console.log(filters)
      console.log(sorter)
      console.log(currentDataSource)
      // console.log('------------------------------------------------------------------------------------------')
    },
    onSelectChange() {
      // this.$message.info('选中行改变了')
      console.log('选中行改变了')
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
