<template>
  <div>
    <no-data :title="viewData.viewName" v-show="classifyList.length === 0"/>

    <transition-group class="classify-list" name="list-complete" tag="div">
      <div
        class="classify-list__item list-complete-item"
        :class="{
          'active': activeCategoryId === item.categoryId
        }"
        v-for="(item, i) in classifyList"
        :key="item.categoryId"
        :style="{
          'background': activeCategoryId === item.categoryId ? activeBgcolor : ''
        }"
        @click="handleCateId(item.categoryId, i)">
        {{item.menuName}}
      </div>
    </transition-group>

    <div class="swiper-container" ref="swiper" v-show="goodsList.length > 0">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="item in goodsList"
          :key="item.categoryId">
          <goods-list :view-data="item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsList from '../goods-list/index'
import sort from '@/assets/util/sort.js'
import NoData from '../common/no-data'

export default {
  props: {
    viewData: {
      type: Object,
      default: () => ({
        row: 2,
        // 默认蓝色
        activeBgcolor: '#01A3C1',
        // 是否显示角标
        showLeftTopMarker: true,
        showKeyword: true,
        showGoodsLable: true,
        showUnitPrice: true,
        list: []
      })
    }
  },
  components: {
    GoodsList,
    NoData
  },
  data () {
    return {
      activeCategoryId: ''
    }
  },
  computed: {
    activeBgcolor () {
      return this.viewData.activeBgcolor || '#01A3C1'
    },
    list () {
      return Array.isArray(this.viewData.list) ? this.viewData.list : []
    },
    sortList () {
      return sort(this.list, {
        sortOrder: 'desc',
        prop: 'sort'
      })
    },
    classifyList () {
      return this.sortList.map(item => ({
        categoryId: item.categoryId,
        menuName: item.menuName
      }))
    },
    goodsOpts () {
      let obj = {
        row: 2,
        showLeftTopMarker: true,
        showKeyword: true,
        showGoodsLable: true,
        showUnitPrice: true,
        showBgCover: false,
        ...this.viewData
      }
      return obj
    },
    goodsList () {
      let obj = Object.assign({}, this.goodsOpts)
      delete obj.activeBgcolor
      delete obj.list

      return this.sortList.map(item => ({
        ...obj,
        categoryId: item.categoryId,
        list: item.goodsList
      }))
    }
  },
  methods: {
    handleCateId (id, i) {
      if (id) {
        this.activeCategoryId = id

        if (this.swiper) {
          this.swiper.slideTo(i)
        }
      } else {
        let index = this.classifyList.findIndex(item => item.categoryId === this.activeCategoryId)

        if (index === -1) {
          this.activeCategoryId = (this.classifyList[0] && this.classifyList[0].categoryId) || ''
        }
      }
    },
    initSwiper () {
      if (!this.swiper && this.Swiper) {
        this.$nextTick(() => {
          this.swiper = new this.Swiper(this.$refs.swiper, {
            autoHeight: true,
            onSlideChangeEnd: (swiper) => {
              this.activeCategoryId = this.classifyList[swiper.activeIndex].categoryId
            }
          })
        })
      }
    }
  },
  watch: {
    classifyList (val) {
      // this.handleCateId()
      this.activeCategoryId = (this.classifyList[0] && this.classifyList[0].categoryId) || ''
    },
    goodsList () {
      if (this.swiper && typeof this.swiper.update === 'function') {
        this.$nextTick(() => {
          setTimeout(() => {
            this.swiper.update()
          }, 300)
        })
      }
    }
  },
  mounted () {
    this.handleCateId()

    import('swiper')
      .then(Swiper => {
        this.Swiper = Swiper
        this.initSwiper()
      })
  }
}
</script>

<style scoped>
.classify-list {
  background: #ffffff;
  line-height: 50px;
  white-space: nowrap;
  padding: 0 10px;
  width: 100%;
  overflow-x: auto;
}

.classify-list__item {
  display: inline-block;
  border-radius: 15px;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  padding: 0 12px;
  margin: 0 5px;
  color: #757575;
  cursor: pointer;
}

.classify-list__item.active {
  color: #ffffff;
  background: #01A3C1;
}
.swiper-container {
  margin-top: 15px;
}
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
