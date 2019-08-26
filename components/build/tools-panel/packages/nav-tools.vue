<template>
  <div>
    <base-tools :data="data"/>
    <el-form label-width="100px">
      <el-form-item label="文字颜色:">
        <el-color-picker v-model="textColor"/>        
      </el-form-item>
      <el-form-item label="文字高亮颜色:" class="mb0">
        <el-color-picker v-model="activeColor"/>
      </el-form-item>
    </el-form>
    <list-wrap
      :list="list"
      @handle-close="delModule">
      <template v-slot="scope">
        <el-form style="width: 100%;">
          <el-form-item label="标题:">
            <el-input class="input" v-model.trim="scope.row.data.content"/>
          </el-form-item>
          <el-form-item label="链接:">
            <el-input class="input" v-model.trim="scope.row.data.link"/>
          </el-form-item>
          <el-form-item label="排序:" class="mb0">
            <el-input class="input" v-model.trim="scope.row.data.sort" type="number" :min="0"/>
          </el-form-item>
        </el-form>
      </template>
    </list-wrap>
    <div class="text-center">
      <el-button type="text" icon="el-icon-plus" @click="plus">添加导航</el-button>
    </div>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
import ListWrap from './common/list-wrap'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1,
        data: {
          textColor: '#E3FBFF',
          activeColor: '#ffffff',
          list: []
        }
      })
    }
  },
  components: {
    BaseTools,
    ListWrap
  },
  computed: {
    list: {
      get () {
        return this.data.data && Array.isArray(this.data.data.list) ? this.data.data.list : []
      }
    },
    textColor: {
      get () {
        return this.data.data && this.data.data.textColor ? this.data.data.textColor : ''
      },
      set (val) {
        this.checkData()
        this.data.data.textColor = val
      }
    },
    activeColor: {
      get () {
        return this.data.data && this.data.data.activeColor ? this.data.data.activeColor : ''
      },
      set (val) {
        this.checkData()
        this.data.data.activeColor = val
      }
    }
  },
  methods: {
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          textColor: '',
          activeColor: '',
          list: []
        })
      }
    },
    delModule (i) {
      this.data.data.list.splice(i, 1)
    },
    plus () {
      this.checkData()
      this.data.data.list.push({
        content: '',
        link: '',
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
