<template>
  <div>
    <base-tools :data="data"/>
    <el-form>
      <el-form-item label="搜索文案:">
        <el-input placeholder="默认为 请输入产品型号，支持模糊搜索" v-model="placeholder" style="width: 280px;"/>
      </el-form-item>
      <el-form-item label="背景图片:">
        <image-upload v-model="bgCover"/>
      </el-form-item>
      <el-form-item label="是否显示消息:">
        <el-switch
          v-model="showChatImage"
          active-text="显示"
          inactive-text="不显示"/>
      </el-form-item>
      <el-form-item label="消息图标:">
        <image-upload v-model="chatImage"/>
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
          showChatImage: true,
          chatImage: '',
          placeholder: '请输入产品型号，支持模糊搜索'
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
    chatImage: {
      get () {
        return this.data.data && this.data.data.chatImage ? this.data.data.chatImage : ''
      },
      set (val) {
        this.checkData()
        this.data.data.chatImage = val
      }
    },
    showChatImage: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('showChatImage') ? this.data.data.showChatImage : true
      },
      set (val) {
        this.checkData()
        this.data.data.showChatImage = val
      }
    },
    placeholder: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('placeholder') ? this.data.data.placeholder : ''
      },
      set (val) {
        this.checkData()

        if (!this.data.data.hasOwnProperty('placeholder')) {
          this.$set(this.data.data, 'placeholder', val)
        } else {
          this.data.data.placeholder = val
        }
      }
    }
  },
  methods: {
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          bgCover: '',
          showChatImage: true,
          chatImage: '',
          placeholder: '请输入产品型号，支持模糊搜索'
        })
      }
    }
  }
}
</script>
