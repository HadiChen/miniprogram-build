<template>
  <div class="page-main">
    <draggable
      v-model="list"
      v-bind="dragOptions"
      tag="div"
      @start="drag = true"
      @end="drag = false"
      @sort="onSort"
      :disabled="mode !== 'edit'"
      :move="onMove">
      <transition-group view-type="page-view" type="transition" :name="!drag ? 'flip-list' : null">
        <layouts
          v-for="(item, i) in list"
          :key="item.id"
          class="relative"
          :margin-bottom="item.marginBottom"
          :content-bg-color="item.contentBgColor"
          :view-type="item.viewType"
          :view-data="{...item.data, viewName: item.viewName}">
          <div class="page-wrap" v-show="mode === 'edit'">
            <div
              class="page-item"
              :class="{
                'active': activeId && activeId === item.id
              }"
              :ref="item.id"
              @click="handleSelect(item)">
              <div class="page-item__tools page-item__close" @click.stop="delModule(i, item)">
                <i class="el-icon-close"></i>
              </div>
              <div class="page-item__tools page-item__plus page-item__plus--top" @click.stop="addModule(i - 1)">
                <i class="el-icon-plus"></i>
              </div>
              <div class="page-item__tools page-item__plus page-item__plus--bottom" @click.stop="addModule(i + 1)">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </div>
        </layouts>
      </transition-group>
    </draggable>
    <div class="page-add" v-show="mode === 'edit'">
      <el-button type="text" icon="el-icon-plus" @click="addModule(void 0)">添加模块</el-button>
    </div>
  </div>
</template>

<script>
/**
 * layouts显示主体
 */
import Layouts from '@/components/build/layouts/index'
import Draggable from 'vuedraggable'

export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    mode: {
      type: String,
      default: 'edit'
    }
  },
  data () {
    return {
      activeId: '',
      drag: false
    }
  },
  computed: {
    list: {
      get () {
        return this.data
      },
      set () {}
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  components: {
    Layouts,
    Draggable
  },
  methods: {
    onMove (evt) {
      return evt.to.getAttribute('view-type') === 'page-view'
    },
    delModule (i, data) {
      this.$emit('handle-del', i, data)

      if (this.activeId === data.id) {
        this.activeId = ''
      }
      this.handleMove(100)
    },
    onSort ({ newIndex, oldIndex }) {
      if (newIndex !== oldIndex) {
        let item = this.data.splice(oldIndex, 1)[0]
        this.data.splice(newIndex, 0, item)
        this.data.forEach((item, i) => {
          item.sort = i + 1
        })
        this.handleMove()
      }
    },
    // 处理移动逻辑
    handleMove (duration = 500) {
      if (this.activeId) {
        this.$nextTick(() => {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            let node = this.getNode(this.$refs[this.activeId])

            if (node) {
              this.$emit('move', node.getBoundingClientRect())
            }
            node = void 0
          }, duration)
        })
      }
    },
    /**
     * 获取节点
     */
    getNode (node) {
      return Array.isArray(node) ? node[0] : node
    },
    addModule (index) {
      this.$emit('add-module', typeof index === 'number' ? index : this.data.length)
    },
    handleSelect (item) {
      this.activeId = item.id
      this.$nextTick(() => {
        let node = this.getNode(this.$refs[item.id])

        if (node) {
          // 直接把对象传出去
          // 有引用
          this.$emit('select', node.getBoundingClientRect(), item)
        }
        node = void 0
      })
    }
  }
}
</script>

<style scoped>
.page-main {
  width: 375px;
  min-height: 667px;
  border: 1px solid #f5f5f5;
  background: #fff;
}

.page-main__item {
  display: flex;
  justify-content: space-between;
}
.page-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
}
.page-item {
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px dashed transparent;
}
.page-item.active {
  border: 1px dashed #d44950;
}
.page-item:hover {
  border: 1px dashed #f56c6c;
}
.page-item__tools {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  position: absolute;
  cursor: pointer;
  display: none;
  z-index: 99;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .3);
}

.page-item__close {
  background: #d44950;
  top: -10px;
  right: -10px;
}
.page-item__plus {
  background: #48B13D;
  left: 50%;
  margin-left: -10px;
}
.page-item__plus--top {
  top: -10px;
}
.page-item__plus--bottom {
  bottom: -10px;
}
.page-item:hover .page-item__tools {
  display: block;
}

.page-item.active .page-item__tools {
  display: block;
}
.page-add {
  border-top: 1px solid #f5f5f5;
  margin-top: 15px;
  text-align: center;
  cursor: pointer;
}
.relative {
  position: relative;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
