<template>
  <div>
    <div class="brand-tab">
      <!-- 综合 -->
      <div class="brand-tab__item justify-content" bindtap="compisiteSelect">
        <div
          class="brand-tab__span"
          :class="{
            'is-select': compisite
          }"
          :style="fontSize">
          <span :style="activeTextColor" v-if="compisite">推荐</span>
          <span :style="textColor" v-else>推荐</span>
        </div>
      </div>
      <div class="brand-tab__item justify-content" bindtap="newSelect">
        <div
          class="brand-tab__span"
          :class="{
            'is-select': isNew
          }"
          :style="fontSize">
          <span :style="activeTextColor" v-if="isNew">最新</span>
          <span :style="textColor" v-else>最新</span>
        </div>
      </div>
      <div class="brand-tab__item justify-content" bindtap="salesSelect">
        <div
          class="brand-tab__span"
          :class="{
            'is-select': sales !== ''
          }"
          :style="fontSize">
          <span :style="activeTextColor" v-if="sales !== ''">销量</span>
          <span :style="textColor" v-else>销量</span>
        </div>
        <div class="brand-tab__itemSpan flex-column">
          <div class="brand-tab__icon">
            <div
              class="el-icon-caret-top"
              :class="{
                'is-select': sales === 0
              }"
              :style="sales === 0 ? activeTextColor : textColor"></div>
          </div>
          <div class="brand-tab__icon">
            <div
              class="el-icon-caret-bottom"
              :class="{
                'is-select': sales === 1
              }"
              :style="sales === 1 ? activeTextColor : textColor"></div>
          </div>
        </div>
      </div>
      <div class="brand-tab__item justify-content" style="position: relative;" bindtap="priceSelect">
        <div class="br-line"></div>
        <div
          class="brand-tab__span"
          :class="{
            'is-select': price !== ''
          }"
          :style="fontSize">
          <span :style="activeTextColor" v-if="price !== ''">价格</span>
          <span :style="textColor" v-else>价格</span>
        </div>
        <div class="brand-tab__itemSpan flex-column">
          <div class="brand-tab__icon">
            <div
              class="el-icon-caret-top"
              :class="{
                'is-select': price === 0
              }"
              :style="price === 0 ? activeTextColor : textColor"></div>
          </div>
          <div class="brand-tab__icon">
            <div
              class="el-icon-caret-bottom"
              :class="{
                'is-select': price === 1
              }"
              :style="price === 1 ? activeTextColor : textColor"></div>
          </div>
        </div>
      </div>
      <div class="brand-tab__item justify-content" bindtap="layoutSelect">
        <div class="brand-tab__span">
          <div
            class="el-icon-menu"
            :class="{
              'is-select': goodsData.row == 2
            }"
            :style="goodsData.row == 2 ? activeTextColor : textColor"></div>
        </div>
      </div>
    </div>

    <goods-list :view-data="goodsData"/>
  </div>
</template>

<script>
import GoodsList from '../goods-list/index'
export default {
  props: {
    viewData: {
      type: Object,
      default: () => (
        {
          row: 1,
          showLeftTopMarker: false,
          showKeyword: true,
          showGoodsLable: false,
          showUnitPrice: true,
          showBgCover: false,
          showGoodsInfo: true,
          activeTextColor: '#01A3C1',
          textColor: '#333333',
          fontSize: 28
        }
      )
    }
  },
  components: {
    GoodsList
  },
  data () {
    return {
      // 是否是推荐
      compisite: 1,
      // 是否是新品
      isNew: false,
      // 销量筛选
      sales: '',
      // 价格筛选
      price: ''
    }
  },
  computed: {
    goodsData () {
      return {
        row: 2,
        showLeftTopMarker: false,
        showKeyword: true,
        showGoodsLable: false,
        showUnitPrice: true,
        showBgCover: false,
        showGoodsInfo: true,
        ...(this.viewData || {}),
        list: [
          {
            'goodsId': 5,
            'goodsNumber': '2216',
            'unitPrice': '139.00',
            'keywords': '硅油包水乳化剂',
            'brandName': 'SiCare',
            'labelName': '轻盈肤感、高兼容',
            'classificationName': '标准品',
            'img': 'https://2.img.sic.wiki/upload/other/9923dd7F74ea094e7e14156C70.jpg',
            'unit': 'KG',
            'goodsLabel': ['轻盈肤感、高兼容'],
            'label': ['标准品'],
            'salesCount': 119,
            'viewGoodCount': 707
          },
          {
            'goodsId': 19,
            'goodsNumber': '9936',
            'keywords': '有机硅弹性体凝胶',
            'brandName': 'SiCare',
            'unitPrice': 109.00,
            'img': 'https://2.img.sic.wiki/upload/other/fab94f9628d33778e6FB182255.jpg',
            'unit': 'kg',
            'goodsLabel': ['丝质触感，更健康'],
            'label': ['标准品'],
            'salesCount': 291,
            'viewGoodCount': 890
          },
          {
            'goodsId': 622,
            'goodsNumber': '9918',
            'keywords': '有机硅弹性体凝胶',
            'brandName': 'SiCare',
            'unitPrice': 79.00,
            'img': 'https://2.img.sic.wiki/upload/other/3fd5f12AA6237b1a1010EAFA46.jpg',
            'unit': 'kg',
            'goodsLabel': ['柔滑细腻、遮盖细纹'],
            'label': ['颠覆品'],
            'salesCount': 138,
            'viewGoodCount': 796
          }
        ]
      }
    },
    activeTextColor () {
      return `color: ${this.viewData.activeTextColor || '#01A3C1'};`
    },
    textColor () {
      return `color: ${this.viewData.textColor || '#333333'};`
    },
    fontSize () {
      let size = (this.viewData && typeof this.viewData.fontSize === 'number') ? this.viewData.fontSize / 2 : 14
      return `font-size: ${size}px;`
    }
  },
  mounted () {

  }
}
</script>

<style scoped>
.br-line {
  position: absolute;
  right: 0;
  top: 25%;
  width: 1px;
  height: 50%;
  border: 1px solid #CCCCCC !important;
}

/* 导航栏 */
.brand-tab {
  position: relative;
  display: flex;
  background: #fff;
  border-bottom: 1px solid #E7E7EB;
  margin-bottom: 10px;
}

.brand-tab__item {
  flex: 1 1 auto;
  text-align: center;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
}

.brand-tab__itemSpan {
  display: flex;
  line-height: 12px;
  margin-left: 5px;
  flex-direction: column;
}

.brand-tab__span {
  color: #333333;
  font-size: 14px;
}

.brand-tab__item .is-select {
  color: #01A3C1;
}

.brand-tab__ico {
  color: #CCCCCC;
  font-size: 16px;
}

.brand-tab__ico1 {
  color: #CCCCCC;
  font-size: 16px;
}

.brand-tab__itemIco {
  display: block;
}

.brand-tab__ico2 {
  display: inline-block;
  color: #757575;
  font-size: 19px;
}

.brand-tab__icon2 {
  display: block;
  height: 23px;
  line-height: 23px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.brand-lists {
  padding-left: 15px;
  background: #FFF;
}

.brand-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #F1F1F1;
}

.brand-item__image {
  width: 120px;
  height: 120px;
  opacity: 0.8;
  background: #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.brand-item__image image {
  width: 100%;
  height: 100%;
}

.brand-item__right {
  display: flex;
  width: 215px;
  margin-left: 17.5px;
  flex-direction: column;
  box-sizing: border-box;
}

.brand-item__title {
  font-family: TimesNewRomanPSMT;
  font-size: 15px;
  color: #22303D;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-item__sub {
  margin-top: 1.5px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #22303D;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-item__label {
  margin-top: 2px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #A2A2A6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-overflow {
  display: inline-block;
}

.brand-item__price {
  margin-top: 50px;
  font-family: TimesNewRomanPSMT;
  font-size: 36px;
  color: #FF4200;
  display: flex;
  align-items: flex-end;
}

.brand-item__span {
  font-family: STSongti-SC-Bold;
  font-size: 10px;
  padding-bottom: 4px;
}

.brand-item__span2 {
  font-family: TimesNewRomanPSMT;
  font-size: 12px;
  padding-bottom: 2px;
}

.brand-item__bottom {
  display: flex;
  height: 17px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #A2A2A6;
}

.brand-item__botLeft {
  display: flex;
}

.brand-item__parise {
  margin: 0 12.5px;
}

.brand-item__button {
  width: 65px;
  height: 27px;
  line-height: 27px;
  text-align: center;
  border-radius: 26px;
  border: 1px solid #FF6600;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #FF6600;
}
.justify-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-tab__icon {
  height: 12px;
}
</style>
