<template>
  <div>
    <ul class="el-upload-list el-upload-list--picture-card" ref="imageWrap">
      <li
        class="el-upload-list__item"
        v-for="(item, i) in pictures"
        :key="i">
        <el-image
          :src="item.url"
          fit="scale-down"
          class="el-upload-list__item-thumbnail"
          v-show="item.url && !item.loading"/>
        <el-progress
          type="circle"
          :percentage="item.progress"
          :stroke-width="6"
          v-show="item.loading"/>

        <span class="el-upload-list__item-actions" v-if="item.url && !item.loading">
          <span class="el-upload-list__item-delete">
            <i
              class="el-icon-arrow-left"
              v-if="!single && i !== 0"
              @click="offset('pre', i)"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="replaceImage(i)">
            <i class="el-icon-refresh"></i>
          </span>
          <span class="el-upload-list__item-delete" v-if="isViewer" @click="preview(i)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete">
            <i class="el-icon-delete" @click="delImage(i)"></i>
          </span>
          <span class="el-upload-list__item-delete">
            <i
              class="el-icon-arrow-right"
              v-if="!single && i !== pictures.length - 1"
              @click="offset('next', i)"></i>
          </span>
        </span>
      </li>
    </ul>
    <div class="el-upload el-upload--picture-card">
      <i class="el-icon-plus"></i>
      <input
        type="file"
        class="upload__input"
        accept="image/*"
        ref="upload"
        @change="upload"
        :multiple="isMultiple && !isReplace"/>
    </div>
  </div>
</template>

<script>
import 'viewerjs/src/css/viewer.css'

export default {
  name: 'image-upload',
  props: {
    // 显示图片
    // string[] | string
    value: {
      type: [Array, String],
      default: () => ([])
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    replaceIndex: '',
    pictures: [],
    viewer: null
  }),
  computed: {
    isViewer () {
      return !!this.viewer
    },
    isReplace () {
      return typeof this.replaceIndex === 'number'
    },
    isMultiple () {
      return this.multiple && !this.single
    },
    // 是不是单张上传
    single () {
      return typeof this.value === 'string'
    },
    picturesList () {
      return this.pictures.map(item => item.url).filter(Boolean)
    },
    /**
     * 判断是否有变化
     */
    isChange () {
      if (this.single) {
        // 第一张不匹配
        // 现有长度不对等
        return (this.pictures[0] && this.value !== this.pictures[0].url) || this.pictures.length !== 1
      } else {
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i] !== this.picturesList[i]) {
            return true
          }
        }
        return this.picturesList.length !== this.value.length
      }
    }
  },
  methods: {
    /**
     * 文件上传阿里云
     * @returns {Promise<{url: string, [key: string]: any}>}
     */
    httpRequestUpload (optionts) {
      return this.$ddvUtil.upload({
        manageType: 'admin',
        authType: 'brand',
        directory: 'file/wap/img/headimg',
        getMethod: 'GET',
        getFilePartInfoUrl: '/v1.0/api/upload/filePartInfo',
        getFilePartSignUrl: '/v1.0/api/upload/filePartMd5',
        completeUploadUrl: '/v1.0/api/upload/complete',
        getPartSizeUrl: '/v1.0/api/upload/filePartSize',
        getFileIdUrl: '/v1.0/api/upload/fileId',
        file: optionts.file,
        onProgress: optionts.onProgress
      })
    },
    preview (i) {
      if (this.isViewer) {
        this.viewer.show(i)
      }
    },
    // 偏移图片
    offset (type, i) {
      let index = void 0

      switch (type) {
        case 'pre':
          index = i - 1
          break
        case 'next':
          index = i + 1
          break
      }

      if (typeof index === 'number') {
        let src = this.pictures.splice(i, 1)[0]
        this.pictures.splice(index, 0, src)
      }
    },
    /**
     * 替换图片
     */
    replaceImage (index) {
      this.replaceIndex = index
      this.$refs.upload.click()
    },
    /**
     * 删除
     */
    delImage (index) {
      this.pictures.splice(index, 1)
    },
    upload (e) {
      let files = Array.prototype.slice.call(e.target.files)
      let proms = []

      files
        // 过滤psd
        .filter(file => file.type.match(
          /^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i
        ))
        .forEach(file => {
          let i

          if (this.single) {
            if (!this.pictures.length) {
              this.pictures.push(this.dataModel())
            }
            i = 0
          } else {
            //
            if (!(this.isReplace && this.pictures[this.replaceIndex])) {
              this.pictures.push(this.dataModel())
              i = this.pictures.length - 1
            } else {
              i = this.replaceIndex
              this.replaceIndex = ''
            }
          }

          proms.push(
            this.handleUpload(file, i)
          )
        })

      Promise.all(proms)
        .then(() => {
          this.$refs.upload.value = ''
        })
    },
    handleUpload (file, index) {
      this.pictures[index].progress = 0
      this.pictures[index].loading = true

      return this.httpRequestUpload({
        file,
        onProgress: res => {
          this.pictures[index].progress = res.percent
        }
      })
        .then(res => {
          this.pictures[index].loading = false
          this.pictures[index].url = res.url
        })
        .catch(e => {
          this.pictures.splice(index, 1)
          this.$message.warning(e.message || '上传失败')
        })
    },
    dataModel () {
      return {
        // 进度
        progress: 0,
        // 图片
        url: '',
        loading: false
      }
    },
    /**
     * 初始化数据
     */
    dataSet () {
      this.pictures = []

      ;(this.single ? [this.value] : this.value)
        .filter(Boolean)
        .forEach(url => {
          this.pictures.push(
            {
              ...this.dataModel(),
              url
            }
          )
        })
    },
    initViewer () {
      this.$nextTick(() => {
        if (this.$refs.imageWrap && this.Viewer) {
          this.viewer = new this.Viewer(this.$refs.imageWrap, {
            title: false
          })
        }
      })
    }
  },
  watch: {
    value () {
      if (this.isChange) {
        this.dataSet()
      }
    },
    picturesList () {
      this.$emit('input', this.single ? this.picturesList[0] || '' : this.picturesList)

      this.$nextTick(() => {
        if (this.viewer && this.viewer.update) {
          this.viewer.update()
        } else {
          this.initViewer()
        }
      })
    }
  },
  destroy () {
    if (this.viewer && typeof this.viewer.destroy === 'function') {
      this.viewer.destroy()
      this.Viewer = this.viewer = null
    }
  },
  mounted () {
    this.dataSet()

    import('viewerjs')
      .then(Viewer => {
        this.Viewer = typeof Viewer === 'function' ? Viewer : Viewer.default

        this.initViewer()
      })
  }
}
</script>

<style scoped>
.el-upload {
  position: relative;
}
.upload__input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  overflow: hidden;
  text-indent: -999px;
  cursor: pointer;
}
</style>
