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
                  <a-icon type="plus" />新增一组请求头(headers)参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item label="params">
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
                  <a-icon type="plus" />新增一组查询字符串(params)参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item label="cookies">
              <a-row :gutter="24" v-for="(item6, index5) in teststep.cookies" :key="index5" type="flex">
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.cookies.' + index5 + '.key'">
                    <a-input type="textarea" v-model="item6.key" placeholder="cookies参数名" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.cookies.' + index5 + '.value'">
                    <a-input type="textarea" v-model="item6.value" placeholder="cookies参数值" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="2">
                  <a-icon
                    v-if="teststep.cookies.length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="teststep.cookies.length === 1"
                    @click="removeVariable('cookies', index1, index5)"
                  />
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-button type="dashed" @click="addVariable('cookies', index1)">
                  <a-icon type="plus" />新增一组cookies参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item label="json参数">
              <monaco-editor
                v-model="teststep.json"
                :language="codeOptions.language"
                :tabSize="codeOptions.tabSize"
                :fontSize="codeOptions.fontSize"
                :theme="codeOptions.theme"
                :readOnly="codeOptions.readOnly"
                :divWidth="codeOptions.divWidth"
                :divHeight="codeOptions.divHeight"
                :editorDivId="codeOptions.editorDivIds[index1]"
              ></monaco-editor>
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
            <a-form-model-item label="extract">
              <a-row :gutter="24" v-for="(item8, index7) in teststep.extract" :key="index7" type="flex">
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.extract.' + index7 + '.key'">
                    <a-input type="textarea" v-model="item8.key" placeholder="extract变量名" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="11">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.extract.' + index7 + '.value'">
                    <a-input type="textarea" v-model="item8.value" placeholder="extract变量值(jmespath表达式)" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="2">
                  <a-icon
                    v-if="teststep.extract.length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="teststep.extract.length === 1"
                    @click="removeVariable('extract', index1, index7)"
                  />
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-button type="dashed" @click="addVariable('extract', index1)">
                  <a-icon type="plus" />新增一组测试步骤提取变量(用于提取响应体字段值来处理接口依赖)参数</a-button
                >
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item label="断言">
              <a-row :gutter="24" v-for="(item9, index8) in teststep.step_validators" :key="index8" type="flex">
                <a-col :span="8">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.step_validators.' + index8 + '.validator_type'">
                    <a-select placeholder="断言类型" v-model="item9.validator_type">
                      <a-select-option v-for="item10 in validatorTypes" :key="item10.key">{{
                        item10.text
                      }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :prop="'teststeps.' + index1 + '.step_validators.' + index8 + '.jmespath_expression'"
                  >
                    <a-input type="textarea" v-model="item9.jmespath_expression" placeholder="jmespath表达式" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.step_validators.' + index8 + '.expected_value'">
                    <a-input type="textarea" v-model="item9.expected_value" placeholder="预期结果" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item :prop="'teststeps.' + index1 + '.step_validators.' + index8 + '.desc'">
                    <a-input type="textarea" v-model="item9.desc" placeholder="描述" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="1">
                  <a-icon
                    v-if="teststep.step_validators.length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="teststep.step_validators.length === 1"
                    @click="removeVariable('step_validators', index1, index8)"
                  />
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-button type="dashed" @click="addVariable('step_validators', index1)">
                  <a-icon type="plus" />新增一组断言</a-button
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
// import { createTestcase } from '@/services/testcases'
import { getTestSuitesDataList } from '@/services/testsuites'
import MonacoEditor from '@/components/editor/MonacoEditor'
import EventBus from '@/utils/event-bus'

export default {
  name: 'CreateTestcases',
  created() {
    // 获取套件列表数据
    getTestSuitesDataList().then((res) => {
      this.testsuiteDataList = res.data.results
    })
  },
  components: { MonacoEditor },
  data() {
    return {
      // Monaco-editor配置项
      codeOptions: {
        language: 'json', // 语言
        readOnly: false, // 只读
        tabSize: 2, // tab 缩进长度
        fontSize: 16, // 字体大小
        theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
        divWidth: '100%',
        divHeight: '600px',
        editorDivIds: ['editor1']
      },
      editorNum: 1,
      methodOptions: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      validatorTypes: [
        { key: 'equal_integer', text: '实际结果(整数类型)等于预期结果(整数类型)' },
        { key: 'equal_float', text: '实际结果(小数类型)等于预期结果(小数类型)' },
        { key: 'equal_boolean', text: '实际结果(布尔类型)等于预期结果(布尔类型)' },
        { key: 'equal_null', text: '实际结果(null类型)等于预期结果(null类型)' },
        { key: 'equal_string', text: '实际结果(字符串类型)等于预期结果(字符串类型)' },
        { key: 'not_equal_integer', text: '实际结果(整数类型)不等于预期结果(整数类型)' },
        { key: 'not_equal_float', text: '实际结果(小数类型)不等于预期结果(小数类型)' },
        { key: 'not_equal_boolean', text: '实际结果(布尔类型)不等于预期结果(布尔类型)' },
        { key: 'not_equal_null', text: '实际结果(null类型)不等于预期结果(null类型)' },
        { key: 'not_equal_string', text: '实际结果(字符串类型)不等于预期结果(字符串类型)' },
        { key: 'contained_by', text: '预期结果(字符串类型)中包含实际结果(字符串类型)' },
        { key: 'contains', text: '实际结果(字符串类型)中包含预期结果(字符串类型)' },
        { key: 'startswith', text: '实际结果(字符串类型)以预期结果(字符串类型)开头' },
        { key: 'endswith', text: '实际结果(字符串类型)以预期结果(字符串类型)结尾' },
        { key: 'startswith_by', text: '预期结果(字符串类型)以实际结果(字符串类型)开头' },
        { key: 'endswith_by', text: '预期结果(字符串类型)以实际结果(字符串类型)结尾' },
        { key: 'greater_or_equals_integer', text: '实际结果(整数类型)大于或等于预期结果(整数类型)' },
        { key: 'greater_or_equals_float', text: '实际结果(小数类型)大于或等于预期结果(小数类型)' },
        { key: 'greater_than_integer', text: '实际结果(整数类型)大于预期结果(整数类型)' },
        { key: 'greater_than_float', text: '实际结果(小数类型)大于预期结果(小数类型)' },
        { key: 'less_or_equals_integer', text: '实际结果(整数类型)小于或等于预期结果(整数类型)' },
        { key: 'less_or_equals_float', text: '实际结果(小数类型)小于或等于预期结果(小数类型)' },
        { key: 'less_than_integer', text: '实际结果(整数类型)小于预期结果(整数类型)' },
        { key: 'less_than_float', text: '实际结果(小数类型)小于预期结果(小数类型)' },
        { key: 'length_equal', text: '实际结果长度(整数类型)等于预期结果(整数类型)' },
        { key: 'length_not_equal', text: '实际结果长度(整数类型)不等于预期结果(整数类型)' },
        { key: 'length_greater_or_equals', text: '实际结果长度(整数类型)大于或等于预期结果(整数类型)' },
        { key: 'length_greater_than', text: '实际结果长度(整数类型)大于预期结果(整数类型)' },
        { key: 'length_less_or_equals', text: '实际结果长度(整数类型)小于或等于预期结果(整数类型)' },
        { key: 'length_less_than', text: '实际结果长度(整数类型)小于预期结果(整数类型)' }
      ],
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      testsuiteDataList: undefined,
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
            export: null,
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
        export: null,
        extract: [{ key: '', value: '' }],
        quote_testcase_id: 0
      })
      this.activeKey = this.testcaseForm.teststeps.length
      // console.log(this.testcaseForm.teststeps)
      // 添加editor实例
      this.codeOptions.editorDivIds.push('editor' + ++this.editorNum)
      console.log(this.codeOptions.editorDivIds)
      console.log('----------------------------------add------------------------------')
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
      // 删除editor实例
      this.codeOptions.editorDivIds.splice(delIndex, 1)
      console.log(this.codeOptions.editorDivIds)
      console.log('----------------------------------del------------------------------')
      // console.log(this.testcaseForm.teststeps)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let newGlobalVariable = {}
          // for (let item of this.testcaseForm.global_variable) {
          //   newGlobalVariable[item['key']] = item['value']
          // }
          // this.testcaseForm.global_variable = newGlobalVariable
          // // 删除无效数据
          // for (let key of Object.keys(this.testcaseForm)) {
          //   if (this.testcaseForm[key] === undefined || this.testcaseForm[key] === '') {
          //     delete this.testcaseForm[key]
          //   }
          // }
          // // console.log(this.testcaseForm)
          // createTestcase(this.testcaseForm).then((res) => {
          //   this.$message.success(res.message)
          //   // 关闭当前标签页
          //   EventBus.$emit('closeCurrentPage')
          //   // resetFields有BUG,这里手动重置表单
          //   this.testcaseForm = {
          //     testcase_name: '',
          //     testcase_desc: '',
          //     testsuite: '',
          //     global_variable: [{ key: '', value: '' }]
          //   }
          //   // 通知用例列表组件刷新用例列表数据
          //   EventBus.$emit('refreshConfigsDataList')
          //   this.$router.push('/testcases/list')
          // })
          console.log(this.testcaseForm)
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
            export: null,
            extract: [{ key: '', value: '' }],
            quote_testcase_id: 0
          }
        ],
        testcase_name: '',
        testcase_desc: '',
        testsuite: undefined
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
      } else if (varType === 'cookies') {
        this.testcaseForm.teststeps[teststepIndex].cookies.push({ key: '', value: '' })
      } else if (varType === 'extract') {
        this.testcaseForm.teststeps[teststepIndex].extract.push({ key: '', value: '' })
      } else if (varType === 'step_validators') {
        this.testcaseForm.teststeps[teststepIndex].step_validators.push({
          validator_type: 'equal_integer',
          jmespath_expression: '',
          expected_value: '',
          desc: ''
        })
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
      } else if (varType === 'cookies') {
        this.testcaseForm.teststeps[teststepIndex].cookies.splice(paramsIndex, 1)
      } else if (varType === 'extract') {
        this.testcaseForm.teststeps[teststepIndex].extract.splice(paramsIndex, 1)
      } else if (varType === 'step_validators') {
        this.testcaseForm.teststeps[teststepIndex].step_validators.splice(paramsIndex, 1)
      }
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
