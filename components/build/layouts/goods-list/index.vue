<template>
  <div>
    <no-data :title="viewData.viewName" v-show="list.length === 0 && !(showCover && opts.bgCover)"/>

    <img
      v-if="showCover && opts.bgCover"
      :src="opts.bgCover"
      class="goods-cover"/>

    <div
      class="goods-row"
      :class="{
        'space-between': opts.row < 3 
      }"
      :style="marginTop"
      v-show="list.length > 0">
      <div
        class="goods-row__item"
        :class="'goods-row__item--' + opts.row"
        v-for="(item) in list"
        :key="item.goodsId">
        <div class="goods-item__label" v-if="opts.showLeftTopMarker">
          <div
            class="goods-item__label--item"
            v-for="(item, i) in item.label"
            :key="i"
            v-if="item">
            {{item}}
          </div>
        </div>

        <el-image
          class="goods-item__cover"
          :src="item.img"/>
        <div class="goods-item__sibar">
          <div>
            <div class="text-hidden goods-item__title">
              {{item.brandName}} {{item.goodsNumber}}
            </div>

            <div class="text-hidden goods-item__keywords" v-if="opts.showKeyword">
              {{item.keywords}}
            </div>
            <div class="text-hidden goods-item__goodslabel" v-if="opts.showGoodsLable && item.goodsLabel">
              {{item.goodsLabel[0] || ''}}
            </div>
          </div>

          <div>
            <div class="text-hidden goods-item__price" v-if="opts.showUnitPrice">
              <span v-if="item.unitPrice != 0 && item.unitPrice != '0.00'">
                ￥<span class="goods-item__price--b">{{item.unitPrice}}</span>/{{item.unit || 'kg'}}
              </span>
              <span class="goods-item__price--b" v-else>询价</span>
            </div>

            <div class="goods-item__info" v-if="opts.showGoodsInfo">
              <span class="goods-item__info--left">{{item.salesCount || 0}}份订单</span>{{item.viewGoodCount || 0}}人浏览
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoData from '../common/no-data'

export default {
  components: {
    NoData
  },
  props: {
    viewData: {
      type: Object,
      default: () => ({
        row: 2,
        showLeftTopMarker: true,
        showKeyword: true,
        showGoodsLable: true,
        showUnitPrice: true,
        showBgCover: false,
        showGoodsInfo: false,
        bgCover: '',
        bgCoverLink: '',
        topSpace: 74,
        list: []
      })
    }
  },
  computed: {
    list () {
      return Array.isArray(this.viewData.list) ? this.viewData.list : []
    },
    opts () {
      return {
        row: 2,
        showLeftTopMarker: true,
        showKeyword: true,
        showGoodsLable: true,
        showUnitPrice: true,
        showBgCover: false,
        showGoodsInfo: false,
        bgCover: '',
        bgCoverLink: '',
        topSpace: 74,
        ...this.viewData
      }
    },
    marginTop () {
      return this.opts.showBgCover && this.opts.topSpace ? `margin-top: -${this.opts.topSpace / 2}px;` : ''
    },
    showCover () {
      return !!(this.viewData.showBgCover && this.viewData.bgCover)
    }
  }
}
</script>

<style scoped>
.goods-cover {
  display: block;
  width: 100%;
}

.goods-row {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 15px;
  transition: all 0.3s;
}

.space-between {
  justify-content: space-between;
}

.goods-row__item {
  margin-bottom: 8px;
  box-shadow: 0 2px 13px 0 rgba(217, 217, 217, 0.3);
  background: #ffffff;
  border-radius: 6px;
  padding: 15px;
  position: relative;
  width: 100%;
  transition: all 0.3s;
}

.goods-row__item.goods-row__item--1 {
  border-radius: 0px;
  margin-bottom: 0px;
  display: flex;
  box-shadow: none;
  padding: 10px 0;
  border-bottom: 1px solid #F1F1F1;
  justify-content: space-between;
}

.goods-row__item.goods-row__item--1:last-child {
  border-bottom: 0;
}

.goods-row__item.goods-row__item--1 .goods-item__cover {
  width: 120px;
  height: 120px;
}

.goods-row__item.goods-row__item--1 .goods-item__title, .goods-row__item.goods-row__item--1 .goods-item__price {
  margin-top: 0;
}

.goods-row__item.goods-row__item--1 .goods-item__sibar {
  width: 217.5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-row__item.goods-row__item--2 {
  width: 168px;
}

.goods-row__item.goods-row__item--3 {
  width: 109px;
  margin: 0 2px;
}

.goods-row__item.goods-row__item--3 .goods-item__title, .goods-row__item.goods-row__item--3 .goods-item__keywords {
  font-size: 12px;
}

.goods-row__item.goods-row__item--3 .goods-item__goodslabel {
  font-size: 10px;
}

.goods-item__label {
  position: absolute;
  left: 0;
  top: 13px;
  z-index: 9;
}

.goods-item__info {
  font-size: 11px;
  color: #A2A2A6;
  line-height: 27px;
}

.goods-item__info--left {
  margin-right: 12.5px;
}

.goods-item__label--item {
  height: 22px;
  line-height: 22px;
  color: #ffffff;
  font-size: 10px;
  padding: 0 6px;
  background: #FFA366;
  border-radius: 0 12px 12px 0;
}
.goods-item__cover {
  object-fit: cover;
  width: 100%;
  display: block;
}
.goods-row__item--2 .goods-item__cover {
  height: 138px;
}

.goods-row__item--3 .goods-item__cover {
  height: 81px;
}

.text-hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.goods-item__title {
  font-size: 16px;
  color: #22303D;
  margin-top: 17px;
}

.goods-item__keywords {
  font-size: 14px;
  color: #22303D;
  margin-top: 4px;
}

.goods-item__goodslabel {
  font-size: 12px;
  color: #757575;
  margin-top: 8px;
}

.goods-item__price {
  font-size: 14px;
  color: #FF6600;
  margin-top: 8px;
}

.goods-item__price--b {
  font-size: 18px;
}

.hidden {
  overflow: hidden;
}
</style>
