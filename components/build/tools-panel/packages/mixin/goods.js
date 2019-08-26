/**
 * tools商品模块相关mixin
 */
export default {
  computed: {
    row: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('row') ? this.data.data.row : 2
      },
      set (val) {
        this.data.data.row = val
      }
    },
    showGoodsInfo: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('showGoodsInfo') ? this.data.data.showGoodsInfo : false
      },
      set (val) {
        this.data.data.showGoodsInfo = val
      }
    },
    showLeftTopMarker: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('showLeftTopMarker') ? this.data.data.showLeftTopMarker : true
      },
      set (val) {
        this.data.data.showLeftTopMarker = val
      }
    },
    showKeyword: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('showKeyword') ? this.data.data.showKeyword : true
      },
      set (val) {
        this.data.data.showKeyword = val
      }
    },
    showGoodsLable: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('showGoodsLable') ? this.data.data.showGoodsLable : true
      },
      set (val) {
        this.data.data.showGoodsLable = val
      }
    },
    showUnitPrice: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('showUnitPrice') ? this.data.data.showUnitPrice : true
      },
      set (val) {
        this.data.data.showUnitPrice = val
      }
    }
  }
}
