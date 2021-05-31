<template>
  <a-card>
    <a-form-model
      ref="testcaseFormRuleFormRef"
      :model="testcaseForm"
      :rules="testcaseFormRules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-card title="基本信息">
        <a-form-model-item label="用例名称" prop="testcase_name">
          <a-input v-model="testcaseForm.testcase_name" />
        </a-form-model-item>
        <a-form-model-item label="用例描述" prop="testcase_desc">
          <a-input type="textarea" v-model="testcaseForm.testcase_desc" />
        </a-form-model-item>
        <a-form-model-item label="所属套件" prop="testsuite">
          <a-select
            show-search
            :filter-option="filterOption"
            placeholder="在此输入套件名称以进行搜索"
            @search="searchWithTestSuiteName"
            v-model="testcaseForm.testsuite"
          >
            <a-select-option v-for="item1 in testsuiteDataList" :key="item1.id">
              套件名称（{{ item1.testsuite_name }}）|&nbsp;套件ID（{{ item1.id }}）
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-card>
      <a-card title="测试步骤" :style="{ marginTop: '32px' }">
        <a-button slot="extra" type="primary" @click="add">新增测试步骤</a-button>
        <a-tabs hide-add v-model="activeKey" type="editable-card" @edit="onEdit">
          <a-tab-pane
            v-for="(teststep, index1) in testcaseForm.teststeps"
            :key="index1 + 1"
            :tab="'测试步骤' + (index1 + 1)"
            :closable="testcaseForm.teststeps.length !== 1"
          >
            <a-form-model-item
              label="测试步骤名称"
              :rules="[
                { required: true, message: '测试步骤名称为必填项', trigger: 'blur' },
                { min: 1, max: 128, message: '测试步骤名称不能小于1个字符或超过128个字符', trigger: 'change' }
              ]"
              :prop="'teststeps.' + index1 + '.teststep_name'"
            >
              <a-input v-model="teststep.teststep_name" />
            </a-form-model-item>
            <a-form-model-item
              label="测试步骤描述"
              :rules="{ min: 1, max: 512, message: '测试步骤描述不能小于1个字符或超过512个字符', trigger: 'change' }"
              :prop="'teststeps.' + index1 + '.desc'"
            >
              <a-input type="textarea" v-model="teststep.desc" />
            </a-form-model-item>
            <a-form-model-item
              :rules="{ required: true, message: '请求方法为必填项', trigger: 'blur' }"
              :prop="'teststeps.' + index1 + '.method'"
              label="请求方法"
            >
              <a-select placeholder="请求方法" v-model="teststep.method">
                <a-select-option v-for="item2 in methodOptions" :key="item2">{{ item2 }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              :rules="{ required: true, message: '请求URL地址为必填项', trigger: 'blur' }"
              :prop="'teststeps.' + index1 + '.url_path'"
              label="请求URL地址"
            >
              <a-input v-model="teststep.url_path" />
            </a-form-model-item>
            <a-form-model-item label="JSON参数">
              <div :id="'editor' + (index1 + 1)" style="width: 100%; height: 600px"></div>
            </a-form-model-item>
            <a-form-model-item label="Params">
              <a-row :gutter="24" v-for="(item3, index2) in teststep.params" :key="index2" type="flex">
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.params.' + index2 + '.key'">
                    <a-input type="textarea" v-model="item3.key" placeholder="params参数名" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.params.' + index2 + '.value'">
                    <a-input type="textarea" v-model="item3.value" placeholder="params参数值" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="2">
                  <a-icon
                    v-if="teststep.params.length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="teststep.params.length === 1"
                    @click="removeVariable('params', index1, index2)"
                  />
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-button type="dashed" @click="addVariable('params', index1)">
                  <a-icon type="plus" />新增一组查询字符串参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item label="x-www-form-urlencoded">
              <a-row :gutter="24" v-for="(item4, index3) in teststep.data" :key="index3" type="flex">
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.data.' + index3 + '.key'">
                    <a-input type="textarea" v-model="item4.key" placeholder="x-www-form-urlencoded参数名" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.data.' + index3 + '.value'">
                    <a-input type="textarea" v-model="item4.value" placeholder="x-www-form-urlencoded参数值" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="2">
                  <a-icon
                    v-if="teststep.data.length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="teststep.data.length === 1"
                    @click="removeVariable('data', index1, index3)"
                  />
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-button type="dashed" @click="addVariable('data', index1)">
                  <a-icon type="plus" />新增一组x-www-form-urlencoded参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item label="headers">
              <a-row :gutter="24" v-for="(item5, index4) in teststep.headers" :key="index4" type="flex">
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.headers.' + index4 + '.key'">
                    <a-input type="textarea" v-model="item5.key" placeholder="headers参数名" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.headers.' + index4 + '.value'">
                    <a-input type="textarea" v-model="item5.value" placeholder="headers参数值" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="2">
                  <a-icon
                    v-if="teststep.headers.length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="teststep.headers.length === 1"
                    @click="removeVariable('headers', index1, index4)"
                  />
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-button type="dashed" @click="addVariable('headers', index1)">
                  <a-icon type="plus" />新增一组headers参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
      </a-card>
      <a-form-model-item style="margin-top: 16px">
        <a-button type="primary" html-type="submit" @click="submitForm('testcaseFormRuleFormRef')">保存</a-button>
        <a-button style="margin-left: 10px" @click="closeForm('testcaseFormRuleFormRef')">取消</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import * as monaco from 'monaco-editor'
import { createTestcase } from '@/services/testcases'
import { getTestSuitesDataList } from '@/services/testsuites'
import EventBus from '@/utils/event-bus'

export default {
  name: 'CreateTestcases',
  created() {
    // 获取套件列表数据
    getTestSuitesDataList().then((res) => {
      this.testsuiteDataList = res.data.results
    })
  },
  mounted() {
    // 挂载editor
    this.initEditor(1)
  },
  destroyed() {
    // 销毁editor
    this.editors['editor1'].dispose()
  },
  data() {
    return {
      methodOptions: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      testsuiteDataList: undefined,
      editors: { editor1: undefined }, // 文本编辑器
      codeOptions: {
        language: 'json', // 语言
        // readOnly: true, // 只读
        tabSize: 2, // tab 缩进长度
        fontSize: 18, // 字体大小
        theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
        minimap: {
          enabled: false // 不显示代码缩略图
        }
      },
      testcaseForm: {
        teststeps: [
          {
            step_validators: [
              {
                validator_type: 'equal_integer',
                jmespath_expression: '',
                expected_value: '',
                desc: ''
              }
            ],
            teststep_name: '',
            method: 'GET',
            url_path: '',
            desc: '',
            json: '',
            params: [{ key: '', value: '' }],
            data: [{ key: '', value: '' }],
            headers: [{ key: '', value: '' }],
            cookies: [{ key: '', value: '' }],
            export: [{ key: '', value: '' }],
            extract: [{ key: '', value: '' }],
            quote_testcase_id: 0
          }
        ],
        testcase_name: '',
        testcase_desc: '',
        testsuite: undefined
      },
      activeKey: 1,
      testcaseFormRules: {
        testcase_name: [
          { required: true, message: '用例名称是必填项', trigger: 'blur' },
          { min: 1, max: 128, message: '用例名称不能小于1个字符或超过128个字符', trigger: 'change' }
        ],
        testsuite: [{ required: true, message: '所属套件为必填项', trigger: 'blur' }],
        testcase_desc: [{ min: 1, max: 128, message: '用例描述不能小于1个字符或超过128个字符', trigger: 'change' }]
      }
    }
  },
  methods: {
    onEdit(targetKey, action) {
      /**
       * 新增和删除页签的回调方法，在 type="editable-card" 时有效
       */
      console.log(`action: ${action}, targetKey: ${targetKey}`)
      this[action](targetKey)
    },
    add() {
      /**
       * 新增一条测试步骤
       */
      this.testcaseForm.teststeps.push({
        step_validators: [
          {
            validator_type: 'equal_integer',
            jmespath_expression: '',
            expected_value: '',
            desc: ''
          }
        ],
        teststep_name: '',
        method: 'GET',
        url_path: '',
        desc: '',
        json: '',
        params: [{ key: '', value: '' }],
        data: [{ key: '', value: '' }],
        headers: [{ key: '', value: '' }],
        cookies: [{ key: '', value: '' }],
        export: [{ key: '', value: '' }],
        extract: [{ key: '', value: '' }],
        quote_testcase_id: 0
      })
      this.activeKey = this.testcaseForm.teststeps.length
      this.editors['editor' + this.testcaseForm.teststeps.length] = undefined
      this.$nextTick(() => {
        // 等待dom更新完毕后，再渲染json编辑器
        this.initEditor(this.testcaseForm.teststeps.length)
        // console.log(this.editors)
      })
      // console.log(this.testcaseForm.teststeps)
    },
    remove(targetKey) {
      /**
       * 删除一条测试步骤
       * @type {number}
       * @targetKey {number} 当前要删除的标签页绑定的v-for中的(key值 + 1)
       */
      let delIndex = targetKey - 1
      // console.log(`targetKey: ${targetKey}, delIndex: ${delIndex}`)
      this.testcaseForm.teststeps.splice(delIndex, 1)
      this.activeKey = this.testcaseForm.teststeps.length
      // 销毁json编辑器
      // this.editors['editor' + targetKey].dispose()
      // delete this.editors['editor' + targetKey]
      // console.log(this.testcaseForm.teststeps)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newGlobalVariable = {}
          for (let item of this.testcaseForm.global_variable) {
            newGlobalVariable[item['key']] = item['value']
          }
          this.testcaseForm.global_variable = newGlobalVariable
          // 删除无效数据
          for (let key of Object.keys(this.testcaseForm)) {
            if (this.testcaseForm[key] === undefined || this.testcaseForm[key] === '') {
              delete this.testcaseForm[key]
            }
          }
          // console.log(this.testcaseForm)
          createTestcase(this.testcaseForm).then((res) => {
            this.$message.success(res.message)
            // 关闭当前标签页
            EventBus.$emit('closeCurrentPage')
            // resetFields有BUG,这里手动重置表单
            this.testcaseForm = {
              testcase_name: '',
              testcase_desc: '',
              testsuite: '',
              global_variable: [{ key: '', value: '' }]
            }
            // 通知用例列表组件刷新用例列表数据
            EventBus.$emit('refreshConfigsDataList')
            this.$router.push('/testcases/list')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeForm() {
      // 关闭当前标签页
      EventBus.$emit('closeCurrentPage')
      // resetFields有BUG,这里手动重置表单
      this.testcaseForm = {
        testcase_name: '',
        testcase_desc: '',
        testsuite: '',
        global_variable: [{ key: '', value: '' }]
      }
      this.$router.push('/testcases/list')
    },
    addVariable(varType, teststepIndex) {
      /**
       * 添加一组请求参数
       */
      if (varType === 'params') {
        this.testcaseForm.teststeps[teststepIndex].params.push({ key: '', value: '' })
      } else if (varType === 'data') {
        this.testcaseForm.teststeps[teststepIndex].data.push({ key: '', value: '' })
      } else if (varType === 'headers') {
        this.testcaseForm.teststeps[teststepIndex].headers.push({ key: '', value: '' })
      }
    },
    removeVariable(varType, teststepIndex, paramsIndex) {
      /**
       * 删除一组请求参数
       */
      if (varType === 'params') {
        this.testcaseForm.teststeps[teststepIndex].params.splice(paramsIndex, 1)
      } else if (varType === 'data') {
        this.testcaseForm.teststeps[teststepIndex].data.splice(paramsIndex, 1)
      } else if (varType === 'headers') {
        this.testcaseForm.teststeps[teststepIndex].headers.splice(paramsIndex, 1)
      }
    },
    initEditor(teststepNum) {
      /**
       * 初始化JSON编辑器，确保dom已经渲染
       */
      this.editors['editor' + teststepNum] = monaco.editor.create(
        document.getElementById('editor' + teststepNum),
        this.codeOptions
      )
    },
    getValue(teststepNum) {
      /**
       * 获取某个测试步骤的json数据
       */
      this.testcaseForm.teststeps[teststepNum].json = this.editors['editor' + teststepNum].getValue() // 获取编辑器中的文本
    },
    searchWithTestSuiteName(testsuiteName) {
      if (testsuiteName !== '') {
        getTestSuitesDataList({ testsuite_name: testsuiteName }).then((res) => {
          if (res.data.count !== 0) {
            this.testsuiteDataList.push(...res.data.results)
            let data = {}
            let newTestSuiteDataList = []
            for (let item of this.testsuiteDataList) {
              if (!data[item.id]) {
                newTestSuiteDataList.push(item)
                data[item.id] = true
              }
            }
            // console.log(newTestSuiteDataList)
            // console.log(this.testsuiteDataList)
            // console.log('----------------------------------')
            this.testsuiteDataList = newTestSuiteDataList
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
