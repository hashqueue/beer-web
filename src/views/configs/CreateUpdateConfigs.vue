<template>
  <a-card>
    <a-form-model ref="configFormRuleFormRef" :model="configForm" :rules="configFormRules">
      <a-form-model-item label="配置名称">
        <a-input v-model="configForm.createForm.config_name" />
      </a-form-model-item>
      <a-form-model-item label="所属项目">
        <a-select
          show-search
          :filter-option="filterOption"
          placeholder="在此输入项目名称以进行搜索"
          @search="searchWithProjectName"
          v-model="configForm.createForm.project"
        >
          <a-select-option v-for="item in projectDataList" :key="item.id">
            项目名称（{{ item.project_name }}）|&nbsp;项目ID（{{ item.id }}）
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="全局变量">
        <a-row :gutter="24" v-for="(item, index) in configForm.createForm.global_variable" :key="index" type="flex">
          <a-col :span="11">
            <a-form-model-item>
              <a-input v-model="item.key" placeholder="全局变量名" />
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item>
              <a-input v-model="item.value" placeholder="全局变量值" />
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-icon
              v-if="configForm.createForm.global_variable.length > 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="configForm.createForm.global_variable.length === 1"
              @click="removeVariable(item)"
            />
          </a-col>
        </a-row>
        <a-form-model-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 50%" @click="addVariable">
            <a-icon type="plus" />新增一组全局变量</a-button
          >
        </a-form-model-item>
      </a-form-model-item>
      <a-form-model-item label="配置描述">
        <a-input type="textarea" v-model="configForm.createForm.config_desc" />
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { updateConfigDetail } from '@/services/configs'
import { getProjectsDataList } from '@/services/projects'

export default {
  name: 'CreateUpdateConfigs',
  props: ['visible', 'title', 'configId', 'projectDataList'],
  data() {
    return {
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 6 }
        }
      },
      configForm: {
        createForm: {
          config_name: '',
          config_desc: '',
          project: '',
          global_variable: []
        },
        updateForm: {
          config_name: '',
          config_desc: '',
          project: '',
          global_variable: []
        }
      },
      configFormRules: {
        config_name: [
          { required: true, message: '配置名称是必填项!' },
          { min: 1, max: 150, message: '配置名称不能小于1个字符或超过150个字符', trigger: 'change' }
        ],
        project: [{ required: true, message: '请选择所属项目' }],
        config_desc: [{ min: 1, max: 256, message: '配置描述不能小于1个字符或超过256个字符', trigger: 'change' }]
      }
    }
  },
  methods: {
    addVariable() {
      this.configForm.createForm.global_variable.push({ key: '', value: '' })
    },
    removeVariable(itemValue) {
      let index = this.configForm.createForm.global_variable.indexOf(itemValue)
      if (index !== -1) {
        this.configForm.createForm.global_variable.splice(index, 1)
      }
    },
    handleOk(formName) {
      if (this.title === '新建配置') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 删除无效数据
            for (let key of Object.keys(this.configForm.createForm)) {
              if (this.configForm.createForm[key] === undefined || this.configForm.createForm[key] === '') {
                delete this.configForm.createForm[key]
              }
            }
            // 创建配置
            // createConfig(values).then(() => {
            //   this.$message.success('新建配置成功')
            //   this.form.resetFields()
            //   this.$emit('createOrEditConfigDone')
            // })
            console.log(this.configForm.createForm)
          } else {
            console.log('error submit!!')
            return false
          }
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

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
