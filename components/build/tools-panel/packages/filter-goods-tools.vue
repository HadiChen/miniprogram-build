<template>
  <div>
    <base-tools :data="data"/>
    <el-form label-width="100px">
      <el-form-item label="字体大小:">
        <el-input-number v-model="fontSize" :min="16"/>
      </el-form-item>
      <el-form-item label="字体颜色:">
        <el-color-picker v-model="textColor"/>
      </el-form-item>
      <el-form-item label="激活字体颜色:">
        <el-color-picker v-model="activeTextColor"/>
      </el-form-item>
    </el-form>
    <goods-base-tools
      :row.sync="row"
      :row-opts="[1, 2]"
      :show-left-top-marker.sync="showLeftTopMarker"
      :show-keyword.sync="showKeyword"
      :show-goods-lable.sync="showGoodsLable"
      :show-unit-price.sync="showUnitPrice"
      :show-goods-info.sync="showGoodsInfo"
      :show-goods="false"/>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
import GoodsBaseTools from './common/goods-base-tools'
import goodsMixin from './mixin/goods.js'

export default {
  mixins: [goodsMixin],
  components: {
    BaseTools,
    GoodsBaseTools
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1,
        data: {
          row: 2,
          showLeftTopMarker: false,
          showKeyword: true,
          showGoodsLable: false,
          showUnitPrice: true,
          showBgCover: false,
          showGoodsInfo: true,
          activeTextColor: '#FF6600',
          textColor: '#333333',
          fontSize: 28
        }
      })
    }
  },
  computed: {
    fontSize: {
      get () {
        return this.data.data && this.data.data.fontSize ? this.data.data.fontSize : 28
      },
      set (val) {
        this.checkData()
        this.data.data.fontSize = val
      }
    },
    activeTextColor: {
      get () {
        return this.data.data && this.data.data.activeTextColor ? this.data.data.activeTextColor : 28
      },
      set (val) {
        this.checkData()
        this.data.data.activeTextColor = val
      }
    },
    textColor: {
      get () {
        return this.data.data && this.data.data.textColor ? this.data.data.textColor : 28
      },
      set (val) {
        this.checkData()
        this.data.data.textColor = val
      }
    }
  },
  methods: {
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          row: 2,
          showLeftTopMarker: false,
          showKeyword: true,
          showGoodsLable: false,
          showUnitPrice: true,
          showBgCover: false,
          showGoodsInfo: true,
          activeTextColor: '#FF6600',
          textColor: '#333333',
          fontSize: 28
        })
      }
    }
  }
}
</script>

<style>

</style>
