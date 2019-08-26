<template>
  <div>
    <base-tools :data="data"/>
    <list-wrap
      :list="list"
      @handle-close="delModule">
      <template v-slot="scope">
        <el-form style="width: 100%;" label-width="60px">
          <el-form-item label="店铺:">
            <span class="f12 text-info">{{scope.row.data.shopName || ''}}</span>
          </el-form-item>
          <el-form-item label="标题:">
            <el-input
              class="input"
              v-model.trim="scope.row.data.title"/>
          </el-form-item>
          <el-form-item label="副标题:">
            <el-input
              class="input"
              v-model.trim="scope.row.data.subTitle"/>
          </el-form-item>
          <el-form-item label="内容:">
            <el-input
              class="input"
              type="textarea"
              placeholder="请输入内容"
              :autosize="{
                minRows: 2
              }"
              v-model.trim="scope.row.data.content"/>
          </el-form-item>
          <el-form-item label="排序:" class="mb0">
            <el-input
              class="input"
              v-model.trim="scope.row.data.sort"
              type="number"
              :min="0"/>
          </el-form-item>
        </el-form>
      </template>
    </list-wrap>

    <div class="text-center">
      <el-button type="text" icon="el-icon-plus" @click="visible = true">添加店铺</el-button>
    </div>

    <el-dialog
      title="选择店铺"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <shop-list @select-change="selectChange" ref="shopSelect" multiple/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="addShop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
import ListWrap from './common/list-wrap'
import ShopList from '@/components/build/data/shop/shop-list'
var shopLists = []

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
  data: () => ({
    visible: false
  }),
  components: {
    BaseTools,
    ShopList,
    ListWrap
  },
  computed: {
    list () {
      return this.data.data && Array.isArray(this.data.data.list) ? this.data.data.list : []
    },
    shopIds () {
      return this.list.map(item => item.shopId)
    }
  },
  methods: {
    selectChange (val) {
      shopLists = val
    },
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
    addShop () {
      this.checkData()

      if (Array.isArray(shopLists)) {
        shopLists.forEach(item => {
          if (this.shopIds.indexOf(item.shopId) === -1) {
            this.data.data.list.push({
              ...item,
              title: item.shopName,
              subTitle: '',
              content: '',
              sort: 1
            })
          }
        })
      }
      this.visible = false
    }
  },
  watch: {
    visible () {
      if (!this.visible) {
        shopLists = []
        this.$refs.shopSelect.reset()
      }
    }
  }
}
</script>

<style scoped>
.input {
  width: 280px;
}
</style>
