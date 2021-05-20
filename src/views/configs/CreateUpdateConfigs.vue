<template>
  <a-modal
    :visible="visible"
    :title="title"
    :width="1000"
    :maskClosable="false"
    okText="保存"
    @cancel="
      () => {
        this.dynamicGlobalVariables = [undefined]
        $emit('cancel', title)
      }
    "
    @ok="handleOk"
  >
    <a-form :form="form">
      <a-form-item label="配置名称">
        <a-input
          v-decorator="[
            'config_name',
            {
              rules: [
                { required: true, message: '配置名称是必填项!' },
                { min: 1, max: 150, message: '配置名称不能小于1个字符或超过150个字符', trigger: 'change' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="所属项目">
        <a-select
          show-search
          :filter-option="filterOption"
          placeholder="在此输入项目名称以进行搜索"
          v-decorator="['project', { rules: [{ required: true, message: '请选择所属项目' }] }]"
          @search="searchWithProjectName"
        >
          <a-select-option v-for="item in projectDataList" :key="item.id">
            项目名称（{{ item.project_name }}）|&nbsp;项目ID（{{ item.id }}）
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="全局变量">
        <a-row :gutter="24" v-for="(item, index) in dynamicGlobalVariables" :key="index" type="flex">
          <a-col :span="10">
            <a-form-item>
              <a-input
                placeholder="全局变量名"
                v-decorator="[`key${index}`, { rules: [{ required: true, message: '请填写变量名' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item>
              <a-input
                placeholder="全局变量值"
                v-decorator="[`value${index}`, { rules: [{ required: true, message: '请填写变量值' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 50%" @click="addVariable">
            <a-icon type="plus" />新增一组全局变量</a-button
          >
        </a-form-item>
      </a-form-item>
      <a-form-item label="配置描述">
        <a-input
          type="textarea"
          v-decorator="[
            'config_desc',
            { rules: [{ min: 1, max: 256, message: '配置描述不能小于1个字符或超过256个字符', trigger: 'change' }] }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { updateConfigDetail } from '@/services/configs'
import { getProjectsDataList } from '@/services/projects'

export default {
  name: 'CreateUpdateConfigs',
  props: ['visible', 'title', 'configId', 'projectDataList'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'config_form' }),
      dynamicGlobalVariables: [undefined],
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 6 }
        }
      }
    }
  },
  methods: {
    addVariable() {
      this.dynamicGlobalVariables.push(undefined)
      console.log(this.dynamicGlobalVariables)
    },
    handleOk() {
      if (this.title === '新建配置') {
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
          // 创建配置
          // createConfig(values).then(() => {
          //   this.$message.success('新建配置成功')
          //   this.form.resetFields()
          //   this.$emit('createOrEditConfigDone')
          // })
          console.log(values)
          console.log(this.dynamicGlobalVariables)
        })
      } else if (this.title === '编辑配置') {
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
          // 更新配置信息
          updateConfigDetail(this.configId, values).then(() => {
            this.$message.success('更新成功')
            this.form.resetFields()
            this.$emit('createOrEditConfigDone')
          })
        })
      }
    },
    searchWithProjectName(projectName) {
      if (projectName !== '') {
        getProjectsDataList({ project_name: projectName }).then((res) => {
          if (res.data.count !== 0) {
            let originProjectDataList = this.projectDataList
            originProjectDataList.push(...res.data.results)
            let data = {}
            let newProjectDataList = []
            for (let item of originProjectDataList) {
              if (!data[item.id]) {
                newProjectDataList.push(item)
                data[item.id] = true
              }
            }
            // console.log(newProjectDataList)
            // console.log(this.projectDataList)
            // console.log('----------------------------------')
            this.$emit('updateProjectDataList', newProjectDataList)
          }
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
