<template>

</template>

<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'MonacoEditor',
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
      editors: undefined // 文本编辑器
    }
  }
}
</script>

<style scoped>

</style>
