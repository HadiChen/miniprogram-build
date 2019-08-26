<template>
  <div>
    <no-data :title="viewData.viewName" v-show="showList.length === 0"/>
    <div
      class="swiper-container"
      ref="swiper"
      v-show="viewData.template === 3"
      :style="heightStyle">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(item, i) in showList"
          :key="i">
          <view-image :images-list="[item]" height="100%"/>
        </div>
      </div>
      <div class="swiper-pagination" ref="pagination" v-show="viewData.indicatorDots"></div>
    </div>
    <view-image :images-list="showList" :height="viewData.height" v-show="viewData.template !== 3"/>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css'
import ViewImage from '../view-image/index'
import sort from '@/assets/util/sort.js'
import NoData from '../common/no-data'

export default {
  props: {
    viewData: {
      type: Object,
      default: () => ({
        indicatorDots: true,
        vertical: false,
        height: 'auto',
        template: 3,
        list: []
      })
    }
  },
  components: {
    ViewImage,
    NoData
  },
  data () {
    return {
      heightStyle: ''
    }
  },
  computed: {
    list () {
      return Array.isArray(this.viewData.list) ? this.viewData.list : []
    },
    sendHeight () {
      return this.viewData.height
    },
    showList () {
      let list = sort(this.list, {
        sortOrder: 'desc',
        prop: 'sort'
      })
      return (this.viewData.template === 1 ? list.slice(0, 1) : list).filter(item => item.cover !== '')
    }
  },
  methods: {
    handleHeightStyle () {
      if (this.viewData.height) {
        this.heightStyle = `height: ${typeof this.viewData.height === 'string' ? this.viewData.height : this.viewData.height + 'px'};`
      } else {
        this.heightStyle = ''
      }
    },
    getOpts () {
      let obj = {
        paginationClickable: true,
        direction: this.viewData.vertical ? 'vertical' : 'horizontal',
        autoplay: 5000
      }

      if (this.$refs.pagination) {
        obj.pagination = this.$refs.pagination
      }
      return obj
    },
    initSwiper () {
      if (this.viewData.template === 3) {
        this.$refs.swiper.className = 'swiper-container'
        this.$nextTick(() => {
          this.swiper = new this.Swiper(this.$refs.swiper, this.getOpts())
          this.swiper.update()
        })
      }
    }
  },
  watch: {
    sendHeight () {
      this.handleHeightStyle()
    },
    showList () {
      if (this.swiper && typeof this.swiper.update === 'function') {
        this.swiper.update()
      }
    },
    'viewData.vertical' () {
      if (this.swiper && typeof this.swiper.destroy === 'function') {
        this.swiper.destroy()
      }
      this.initSwiper()
    },
    'viewData.template' () {
      if (this.swiper && typeof this.swiper.update === 'function') {
        this.swiper.update()
      } else {
        this.initSwiper()
      }
    }
  },
  mounted () {
    this.handleHeightStyle()

    import('swiper')
      .then(Swiper => {
        this.Swiper = Swiper
        this.initSwiper()
      })
  }
}
</script>

<style scoped>
.swiper-container {
  transition: all 0.3s;
}
</style>

