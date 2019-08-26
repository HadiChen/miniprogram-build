<template>
  <div>
    <no-data :title="viewData.viewName" v-show="showList.length === 0"/>
    <transition-group class="icon-nav" name="list-complete" tag="div" v-show="showList.length > 0">
      <div
        v-for="(item, i) in showList"
        :key="item.title + i"
        class="icon-row list-complete-item"
        :style="{
          'width': (100 / showList.length) + '%'
        }">
        <div class="icon-image">
          <el-image
            fit="cover"
            :src="item.cover + '?x-oss-process=image/resize,w_90/quality,q_90'"
            class="icon-image__image"/>
        </div>
        <div class="icon-text">
          {{item.title}}
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
      default: () => ({})
    }
  },
  computed: {
    list () {
      return Array.isArray(this.viewData.list) ? this.viewData.list.slice(0, 6) : []
    },
    showList () {
      return sort(this.list, {
        sortOrder: 'desc',
        prop: 'sort'
      }).filter(item => !(item.cover === '' && item.title === ''))
    }
  }
}
</script>

<style scoped>
.icon-nav {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
}

.icon-image {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 10px;
  margin: 0 auto;
}

.icon-image__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.icon-text {
  font-size: px;
  color: #757575;
  text-align: center;
  line-height: 20px;
  margin-top: 10px;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}

.icon-row {
  padding: 0 10px;
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
