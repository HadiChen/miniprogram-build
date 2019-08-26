<template>
  <div :style="style" v-if="viewType">
    <view-nav
      v-if="viewType === 1"
      :view-data="viewData"/>
    <banner-swiper
      v-if="viewType === 2"
      :view-data="viewData"/>
    <icon-nav
      v-if="viewType === 3"
      :view-data="viewData"/>
    <shop-card
      v-if="viewType === 4"
      :view-data="viewData"/>
    <goods-list
      v-if="viewType === 5"
      :view-data="viewData"/>
    <classify-goods
      v-if="viewType === 6"
      :view-data="viewData"/>
    <shop-heard
      v-if="viewType === 7"
      :view-data="viewData"/>
    <filter-goods
      v-if="viewType === 8"
      :view-data="viewData"/>
    <search-bar
      v-if="viewType === 9"
      :view-data="viewData"/>
    <slot></slot>
  </div>
</template>

<script>
/**
 * layouts基础布局
 * 只做显示使用
 */
import ViewNav from './nav/index'
import BannerSwiper from './banner-swiper/index'
import IconNav from './icon-nav/index'
import ShopCard from './shop-card/index'
import GoodsList from './goods-list/index'
import ClassifyGoods from './classify-goods/index'
import ShopHeard from './shop-heard/index'
import FilterGoods from './filter-goods/index'
import SearchBar from './search-bar/index'

export default {
  props: {
    viewData: {
      type: Object,
      default: () => ({})
    },
    marginBottom: {
      type: Number,
      default: 0
    },
    contentBgColor: {
      type: String,
      default: ''
    },
    viewType: {
      type: Number,
      required: true
    }
  },
  components: {
    ViewNav,
    IconNav,
    BannerSwiper,
    GoodsList,
    ClassifyGoods,
    ShopHeard,
    SearchBar,
    FilterGoods,
    ShopCard
  },
  data: () => ({
    style: ''
  }),
  methods: {
    handleStyle () {
      let style = []

      if (this.marginBottom) {
        style.push(
          `margin-bottom: ${this.marginBottom}px`
        )
      }

      if (this.contentBgColor) {
        style.push(
          `background: ${this.contentBgColor}`
        )
      }
      this.style = style.join(';')
    }
  },
  watch: {
    marginBottom () {
      this.handleStyle()
    },
    contentBgColor () {
      this.handleStyle()
    }
  },
  mounted () {
    this.handleStyle()
  }
}
</script>
