<template>
  <div>
    <no-data :title="viewData.viewName" v-show="showList.length === 0"/>
    <div class="shop-view" v-show="showList.length > 0">
      <transition-group
        class="clearfix"
        name="list-complete"
        tag="div"
        :style="{
          'width': 118 * showList.length + 'px'
        }">      
        <div
          class="shop-card list-complete-item"
          v-for="item in showList"
          :key="item.shopId">
          <div class="shop-card__item">
            <div class="shop-card__image">
              <img
                :src="item.logo + '?x-oss-process=image/resize,w_116/quality,q_90'"
                v-if="item.logo"
                mode="aspectFill"/>
            </div>
            <div class="shop-card__text shop-card__text--title">
              {{item.title}}
            </div>
            <div class="shop-card__text shop-card__text--subTitle">
              {{item.subTitle}}
            </div>
            <div class="shop-card__content">
              {{item.content}}
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import sort from '@/assets/util/sort.js'
import NoData from '../common/no-data'

export default {
  components: {
    NoData
  },
  props: {
    viewData: {
      type: Object,
      default: () => ({
        list: []
      })
    }
  },
  computed: {
    list () {
      return Array.isArray(this.viewData.list) ? this.viewData.list : []
    },
    showList () {
      return sort(this.list, {
        sortOrder: 'desc',
        prop: 'sort'
      })
    }
  }
}
</script>

<style scoped>
.shop-view {
  width: 100%;
  padding: 10px;
  overflow-x: auto
}

.shop-card {
  float: left;
  padding: 5px;
}

.shop-card__item {
  background: #ffffff;
  width: 108px;
  box-shadow: 0 4px 26px 0 rgba(217, 217, 217, 0.3);
  height: 162px;
  border-radius: 4px;
  overflow: hidden;
  padding: 0 8px;
}

.shop-card__image {
  width: 58px;
  height: 58px;
  border-radius: 29px;
  background: #F5F5F5;
  overflow: hidden;
  margin: 16px auto 8px;
}
.shop-card__image image {
  width: 100%;
  height: 100%;
  display: block;
}

.shop-card__text {
  width: 100%;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333333;
}
.shop-card__text--title {
  font-size: 16px;
  line-height: 19px;
}
.shop-card__text--subTitle {
  font-size: 10px;
  line-height: 14px;
  margin-top: 3px;
}
.shop-card__content {
  height: 35px;
  width: 100%;
  font-size: 9px;
  color: #999999;
  margin-top: 5px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
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
