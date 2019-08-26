import NavTools from './packages/nav-tools'
import SwiperTools from './packages/swiper-tools'
import IconNavTools from './packages/icon-nav-tools'
import ShopCardTools from './packages/shop-card-tools'
import GoodsListTools from './packages/goods-list-tools'
import ClassifyGoodsTools from './packages/classify-goods-tools'
import ShopHeardTools from './packages/shop-heard-tools'
import FilterGoodsTools from './packages/filter-goods-tools'
import SearchBar from './packages/search-bar'
/**
 * 👆是现在全部的编辑工具
 * 编辑工具分发模块
 * 使用 functional
 * 该组件不做实质的渲染
 */
export default {
  functional: true,
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '#fff'
      })
    }
  },
  render (h, ctx) {
    const { data } = ctx.props
    switch (data.viewType) {
      case 1:
        return h(NavTools, {
          props: {
            data
          }
        })
      case 2:
        return h(SwiperTools, {
          props: {
            data
          }
        })
      case 3:
        return h(IconNavTools, {
          props: {
            data
          }
        })
      case 4:
        return h(ShopCardTools, {
          props: {
            data
          }
        })
      case 5:
        return h(GoodsListTools, {
          props: {
            data
          }
        })
      case 6:
        return h(ClassifyGoodsTools, {
          props: {
            data
          }
        })
      case 7:
        return h(ShopHeardTools, {
          props: {
            data
          }
        })
      case 8:
        return h(FilterGoodsTools, {
          props: {
            data
          }
        })
      case 9:
        return h(SearchBar, {
          props: {
            data
          }
        })
    }
  }
}
