<template>
  <el-form label-width="80px">
    <el-form-item label="背景颜色: ">
      <el-color-picker v-model="data.contentBgColor" show-alpha/>
    </el-form-item>
    <el-form-item label="底边距: ">
      <el-input-number v-model="data.marginBottom"/>
    </el-form-item>
    <!-- <el-form-item label="排序: ">
      <el-input-number v-model="data.sort" :min="0"/>
    </el-form-item> -->
  </el-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1
      })
    }
  }
}
</script>
