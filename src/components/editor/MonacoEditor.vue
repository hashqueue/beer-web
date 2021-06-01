<template>
  <div :id="editorDivId" @input="change" :style="{ width: divWidth, height: divHeight }"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'MonacoEditor',
  // 组件引用时添加v-model指令，所以value属性就存在，他的值为v-model等于号后面的变量，通过props将他传递过来
  props: ['value', 'language', 'tabSize', 'fontSize', 'theme', 'readOnly', 'divWidth', 'divHeight', 'editorDivId'],
  mounted() {
    // 挂载editor
    this.initEditor()
  },
  destroyed() {
    // 销毁editor
    this.editor.dispose()
  },
  data() {
    return {
      editor: undefined, // 文本编辑器
      codeOptions: {
        language: this.language, // 语言
        readOnly: this.readOnly, // 只读
        tabSize: this.tabSize, // tab 缩进长度
        fontSize: this.fontSize, // 字体大小
        theme: this.theme, // 官方自带三种主题vs, hc-black, or vs-dark
        minimap: {
          enabled: false // 不显示代码缩略图
        }
      }
    }
  },
  watch: {
    // 监听父组件中的value值的变化，用于与编辑器的内容进行双向绑定
    value() {
      this.editor.setValue(this.value)
    }
  },
  methods: {
    initEditor() {
      /**
       * 初始化JSON编辑器，确保dom已经渲染
       */
      // 创建一个editor实例，并将它挂载到上面的div上
      this.editor = monaco.editor.create(document.getElementById(this.editorDivId), this.codeOptions)
    },
    change() {
      // 鼠标移出编辑器时触发，将编辑器中的内容赋值给父组件中测试用例表单中的测试步骤中的json字段
      this.editor.onMouseLeave(() => {
        this.$emit('input', this.editor.getValue())
      })
    }
  }
}
</script>

<style scoped></style>
