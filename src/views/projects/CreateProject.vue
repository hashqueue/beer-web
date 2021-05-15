<template>
  <a-modal
    :visible="visible"
    title="新建项目"
    okText="保存"
    @cancel="
      () => {
        $emit('cancel')
      }
    "
    @ok="
      () => {
        $emit('create')
      }
    "
  >
    <a-form :form="form">
      <a-form-item label="项目名称">
        <a-input
          v-decorator="[
            'project_name',
            {
              rules: [
                { required: true, message: '项目名称是必填项!' },
                { min: 1, max: 150, message: '项目名称不能小于1个字符或超过150个字符', trigger: 'change' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="项目描述">
        <a-input
          type="textarea"
          v-decorator="[
            'project_desc',
            { rules: [{ min: 1, max: 256, message: '项目描述不能小于1个字符或超过150个字符', trigger: 'change' }] }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'CreateProject',
  props: ['visible'],
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'create_project' })
  }
}
</script>

<style scoped></style>
