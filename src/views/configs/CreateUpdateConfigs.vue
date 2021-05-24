<template>
  <a-card>
    <a-form-model ref="configFormRuleFormRef" :model="configForm" :rules="configFormRules">
      <a-form-model-item label="配置名称" prop="config_name">
        <a-input v-model="configForm.config_name" />
      </a-form-model-item>
      <a-form-model-item label="所属项目" prop="project">
        <a-select
          show-search
          :filter-option="filterOption"
          placeholder="在此输入项目名称以进行搜索"
          @search="searchWithProjectName"
          v-model="configForm.project"
        >
          <a-select-option v-for="item in projectDataList" :key="item.id">
            项目名称（{{ item.project_name }}）|&nbsp;项目ID（{{ item.id }}）
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="全局变量" prop="global_variable">
        <a-row :gutter="24" v-for="(item, index) in configForm.global_variable" :key="index" type="flex">
          <a-col :span="11">
            <a-input v-model="item.key" placeholder="全局变量名" />
          </a-col>
          <a-col :span="11">
            <a-input v-model="item.value" placeholder="全局变量值" />
          </a-col>
          <a-col :span="2">
            <a-icon
              v-if="configForm.global_variable.length > 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="configForm.global_variable.length === 1"
              @click="removeVariable(item)"
            />
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 50%" @click="addVariable">
          <a-icon type="plus" />新增一组全局变量</a-button
        >
      </a-form-model-item>
      <a-form-model-item label="配置描述" prop="config_desc">
        <a-input type="textarea" v-model="configForm.config_desc" />
      </a-form-model-item>
      <a-form-model-item :labelCol="{ span: 10, offset: 2 }">
        <a-button type="primary" html-type="submit" @click="submitForm('configFormRuleFormRef')">保存</a-button>
        <a-button style="margin-left: 10px" @click="closeForm('configFormRuleFormRef')">取消</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { updateConfigDetail, createConfig } from '@/services/configs'
import { getProjectsDataList } from '@/services/projects'

export default {
  name: 'CreateUpdateConfigs',
  props: ['visible', 'title', 'configId'],
  created() {
    // 获取项目列表数据
    getProjectsDataList().then((res) => {
      this.projectDataList = res.data.results
    })
  },
  data() {
    let validateGlobalVariables = (rule, value, callback) => {
      for (let item of value) {
        if (item.key === '' || item.value === '') {
          callback(new Error('全局变量为必填项'))
        } else {
          callback()
        }
      }
    }
    return {
      projectDataList: null,
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 6 }
        }
      },
      configForm: {
        config_name: '',
        config_desc: '',
        project: '',
        global_variable: [{ key: '', value: '' }]
      },
      configFormRules: {
        config_name: [
          { required: true, message: '配置名称是必填项', trigger: 'blur' },
          { min: 1, max: 150, message: '配置名称不能小于1个字符或超过150个字符', trigger: 'change' }
        ],
        project: [{ required: true, message: '所属项目为必填项', trigger: 'blur' }],
        global_variable: [
          { required: true, message: '全局变量为必填项', trigger: 'blur' },
          { validator: validateGlobalVariables, trigger: 'change' }
        ],
        config_desc: [{ min: 1, max: 256, message: '配置描述不能小于1个字符或超过256个字符', trigger: 'change' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newGlobalVariable = {}
          for (let item of this.configForm.global_variable) {
            newGlobalVariable[item['key']] = item['value']
          }
          this.configForm.global_variable = newGlobalVariable
          // console.log(this.configForm)
          createConfig(this.configForm).then((res) => {
            this.$message.success(res.message)
            this.$refs[formName].resetFields()
            this.$router.push('/configs/list')
            // TODO：通知配置列表刷新页面
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeForm(formName) {
      this.$refs[formName].resetFields()
      this.$router.push('/configs/list')
    },
    addVariable() {
      this.configForm.global_variable.push({ key: '', value: '' })
    },
    removeVariable(itemValue) {
      let index = this.configForm.global_variable.indexOf(itemValue)
      if (index !== -1) {
        this.configForm.global_variable.splice(index, 1)
      }
    },
    handleOk(formName) {
      if (this.title === '新建配置') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 删除无效数据
            for (let key of Object.keys(this.configForm)) {
              if (this.configForm[key] === undefined || this.configForm[key] === '') {
                delete this.configForm[key]
              }
            }
            // 创建配置
            // createConfig(values).then(() => {
            //   this.$message.success('新建配置成功')
            //   this.form.resetFields()
            //   this.$emit('createOrEditConfigDone')
            // })
            console.log(this.configForm)
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
            this.projectDataList.push(...res.data.results)
            let data = {}
            let newProjectDataList = []
            for (let item of this.projectDataList) {
              if (!data[item.id]) {
                newProjectDataList.push(item)
                data[item.id] = true
              }
            }
            // console.log(newProjectDataList)
            // console.log(this.projectDataList)
            // console.log('----------------------------------')
            this.projectDataList = newProjectDataList
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
  color: red;
  transition: all 0.3s;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
