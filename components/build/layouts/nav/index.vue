<template>
  <div>
    <no-data :title="viewData.viewName" v-show="showList.length === 0"/>
    <transition-group class="scroll-view" name="list-complete" tag="div" v-show="showList.length > 0">
      <div
        class="scroll-view__item list-complete-item"
        v-for="(item, index) in showList"
        v-show="item.content"
        :key="item.content + index">
        <div
          class="scroll-view__item--text"
          :class="{
            'scroll-view__item--text--active': index === 0
          }"
          :style="{
            color: index === 0 ? viewData.activeColor : viewData.textColor
          }">
          {{item.content}}
          <div
            class="scroll-view__item--border"
            :style="{
              background: index === 0 ? viewData.activeColor : viewData.textColor
            }"></div>
        </div>
      </div>
    </transition-group>
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
        textColor: '',
        activeColor: '',
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
      }).filter(item => item.content !== '')
    }
  }
}
</script>

<style scoped>
.scroll-view {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
}
.scroll-view__item {
  display: inline-block;
  font-size: 14px;
  padding:  5px 15px;
  color: #ffffff;
}
.scroll-view__item--text {
  padding: 5px 0;
  position: relative;
}

.scroll-view__item--border {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #ffffff;
  border-radius: 1px;
  display: none;
}

.scroll-view__item--text--active .scroll-view__item--border {
  display: block;
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
