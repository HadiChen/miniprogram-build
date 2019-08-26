<template>
  <div>
    <div
      class="list-wrap"
      v-for="(item, i) in list"
      :class="{
        'active': i === 0
      }"
      :style="{
        'flex-direction': flexDirection
      }"
      :key="i">
      <div class="list-wrap__close" @click="handleClose(i, item)">
        <i class="el-icon-close"></i>
      </div>
      <slot
        name="sidebar"
        :row="{
          data: item,
          $index: i
        }"></slot>
      <slot
        :row="{
          data: item,
          $index: i
        }"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    flexDirection: {
      type: String,
      default: 'row'
    }
  },
  methods: {
    handleClose (i, item) {
      this.$emit('handle-close', i, item)
    }
  }
}
</script>

<style scoped>
.list-wrap {
  padding: 10px;
  border: 1px solid #f3f3f3;
  border-top: 0;
  position: relative;
  display: flex;
}

.list-wrap.active {
  border-top: 1px solid #f3f3f3;
}

.list-wrap__close {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  background: #d44950;
  cursor: pointer;
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 99;
}
</style>
