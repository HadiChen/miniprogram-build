<template>
  <div>
    <base-tools :data="data"/>
    <el-form>
      <el-form-item label="背景图片:">
        <image-upload v-model="bgCover"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
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
          bgCover: '',
          info: {
            shopHomeLogo: '',
            shopName: '',
            projectId: ''
          }
        }
      })
    }
  },
  components: {
    BaseTools,
    ImageUpload
  },
  computed: {
    bgCover: {
      get () {
        return this.data.data && this.data.data.bgCover ? this.data.data.bgCover : ''
      },
      set (val) {
        this.checkData()
        this.data.data.bgCover = val
      }
    },
    projectId () {
      return this.$ddvUtil.$adminSite.projectId || 1
    }
  },
  methods: {
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          bgCover: '',
          info: {
            shopHomeLogo: '',
            shopName: '',
            projectId: 0
          }
        })
      }
    },
    getShopInfo () {
      if (!this.data.data.info.shopName || !this.data.data.info.shopHomeLogo) {
        this.$ddvUtil.autoRetry(() => {
          return this.$ddvUtil.get('v2.0/api/admin/shop/show')
          .send({
            projectId: this.projectId
          })
          .then(res => {
            this.data.data.info.shopName = res.data.shopName
            this.data.data.info.shopHomeLogo = res.data.shopMobileBrandLogo
          })
        })
      }
    }
  },
  watch: {
    projectId () {
      this.data.data.info.projectId = this.projectId
      this.getShopInfo()
    }
  },
  mounted () {
    this.checkData()
    this.data.data.info.projectId = this.projectId
    this.getShopInfo()
  }
}
</script>
