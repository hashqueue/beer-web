<template>
  <a-modal
    :visible="visible"
    title="运行项目"
    okText="确定"
    @cancel="
      () => {
        $emit('cancel', '运行项目')
      }
    "
    @ok="handleOk"
  >
    <a-form :form="form">
      <a-form-item>
        <a-checkbox @change="onChange">是否选择某个配置项来运行此项目</a-checkbox>
      </a-form-item>
      <a-form-item v-show="showSelect" label="运行项目时所使用的配置">
        <a-select
          show-search
          placeholder="在此输入配置名称以进行搜索"
          style="width: 250px"
          :filter-option="filterOption"
          v-decorator="['config_id', { rules: [{ required: true, message: '请选择一个配置项' }] }]"
        >
          <a-select-option v-for="item in configDataList" :key="item.id"> {{ item.config_name }} </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getConfigsDataList } from '@/services/config'
import { runDetailProject } from '@/services/project'
export default {
  props: ['visible', 'projectId'],
  name: 'RunProject',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'project_run_form' }),
      showSelect: false,
      configDataList: null
    }
  },
  methods: {
    // 多选框change事件
    onChange(e) {
      if (e.target.checked) {
        getConfigsDataList().then((res) => {
          this.configDataList = res.data.results
          this.showSelect = true
        })
      } else {
        this.showSelect = false
      }
    },
    handleOk() {
      if (this.showSelect) {
        this.form.validateFields((err, values) => {
          if (err) {
            return false
          }
          // 删除无效数据
          for (let key of Object.keys(values)) {
            if (values[key] === undefined || values[key] === '') {
              delete values[key]
            }
          }
          // 运行项目时使用配置
          runDetailProject(this.projectId, values).then((res) => {
            this.$message.success(res.message)
            this.form.resetFields()
            this.$emit('cancel', '运行项目')
          })
        })
      } else {
        // 运行项目时不使用配置
        runDetailProject(this.projectId).then((res) => {
          this.$message.success(res.message)
          this.form.resetFields()
          this.$emit('cancel', '运行项目')
        })
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style scoped></style>
