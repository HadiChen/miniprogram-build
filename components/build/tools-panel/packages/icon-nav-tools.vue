<template>
  <div>
    <base-tools :data="data"/>
    <list-wrap :list="list" flex-direction="column" @handle-close="delModule">
      <template v-slot:sidebar="scope">
        <image-upload v-model="scope.row.data.cover"/>
      </template>
      <template v-slot="scope">
        <el-form style="width: 100%;" class="mt15">
          <el-form-item label="标题:">
            <el-input v-model.trim="scope.row.data.title" class="input"/>
          </el-form-item>
          <el-form-item label="链接:">
            <el-input v-model.trim="scope.row.data.link" class="input"/>
          </el-form-item>
          <el-form-item label="排序:" class="mb0">
            <el-input v-model.trim="scope.row.data.sort" type="number" :min="0" class="input"/>
          </el-form-item>
        </el-form>
      </template>
    </list-wrap>
    <div class="text-center">
      <el-button type="text" icon="el-icon-plus" @click="plus" v-show="list.length < 6">添加导航</el-button>
    </div>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
import ListWrap from './common/list-wrap'
import ImageUpload from '@/components/image-upload/index'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1,
        data: {
          list: []
        }
      })
    }
  },
  computed: {
    list () {
      return this.data.data && Array.isArray(this.data.data.list) ? this.data.data.list : []
    }
  },
  components: {
    BaseTools,
    ImageUpload,
    ListWrap
  },
  methods: {
    delModule (i) {
      this.data.data.list.splice(i, 1)
    },
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          list: []
        })
      }
    },
    plus () {
      this.checkData()
      this.data.data.list.push({
        title: '',
        link: '',
        cover: '',
        sort: 1
      })
    }
  }
}
</script>

<style scoped>
.input {
  width: 280px;
}
</style>
