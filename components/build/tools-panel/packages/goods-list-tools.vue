<template>
  <div>
    <base-tools :data="data"/>
    <el-form>
      <el-form-item label="是否显示背景图片:">
        <el-switch
          v-model="showBgCover"
          active-text="显示"
          inactive-text="不显示"/>
      </el-form-item>
      <el-form-item label="背景图片:" v-show="showBgCover">
        <image-upload v-model="bgCover"/>
      </el-form-item>
      <el-form-item label="图片链接:" v-show="showBgCover">
        <el-input v-model.trim="bgCoverLink" class="input" placeholder="请输入图片链接"/>
      </el-form-item>
      <el-form-item label="图片间距:" v-show="showBgCover" class="mb0">
        <el-input v-model.trim="topSpace" type="number" class="input" placeholder="请输入图片间距">
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
    </el-form>
    <goods-base-tools
      :row.sync="row"
      :show-left-top-marker.sync="showLeftTopMarker"
      :show-keyword.sync="showKeyword"
      :show-goods-lable.sync="showGoodsLable"
      :show-unit-price.sync="showUnitPrice"
      :show-goods-info.sync="showGoodsInfo"
      :list.sync="data.data.list"
      :goods-max-num="50"/>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
import GoodsBaseTools from './common/goods-base-tools'
import ImageUpload from '@/components/image-upload/index'
import goodsMixin from './mixin/goods.js'

export default {
  mixins: [goodsMixin],
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1,
        data: {
          row: 2,
          showGoodsInfo: false,
          showLeftTopMarker: true,
          showKeyword: true,
          showGoodsLable: true,
          showUnitPrice: true,
          showBgCover: false,
          bgCover: '',
          bgCoverLink: '',
          topSpace: 74,
          list: []
        }
      })
    }
  },
  components: {
    BaseTools,
    GoodsBaseTools,
    ImageUpload
  },
  computed: {
    showBgCover: {
      get () {
        return this.handleKey('showBgCover') || false
      },
      set (val) {
        this.checkData()
        this.data.data.showBgCover = val
      }
    },
    bgCover: {
      get () {
        return this.handleKey('bgCover') || ''
      },
      set (val) {
        this.checkData()
        this.data.data.bgCover = val
      }
    },
    bgCoverLink: {
      get () {
        return this.handleKey('bgCoverLink') || ''
      },
      set (val) {
        this.checkData()
        this.data.data.bgCoverLink = val
      }
    },
    topSpace: {
      get () {
        return this.handleKey('topSpace') || ''
      },
      set (val) {
        this.checkData()
        this.data.data.topSpace = val
      }
    }
  },
  methods: {
    handleKey (key) {
      if (this.data.data && this.data.data.hasOwnProperty(key)) {
        return this.data.data[key]
      }
      return null
    },
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          row: 2,
          showGoodsInfo: false,
          showLeftTopMarker: true,
          showKeyword: true,
          showGoodsLable: true,
          showUnitPrice: true,
          showBgCover: false,
          bgCover: '',
          bgCoverLink: '',
          topSpace: 0,
          list: []
        })
      }
    }
  },
  mounted () {
    this.checkData()
  }
}
</script>

<style scoped>
.input {
  width: 280px;
}
</style>
