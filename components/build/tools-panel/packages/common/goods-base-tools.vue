<template>
  <div>
    <el-form label-width="80px" v-if="showGoods">
      <el-form-item class="mb0">
        <template slot="label">
          <div>
            选择产品:
            <div v-show="showList.length">
              <el-button
                class="text-danger"
                type="text"
                icon="el-icon-delete"
                @click="delAllGoods">
                全部清除
              </el-button>
            </div>
          </div>
        </template>
        <div v-show="showSelectGoods">
          <el-button
            type="text"
            icon="el-icon-plus"
            v-if="canChoosePlatform"
            @click="selectGoodsData(false)">
            选择平台产品
          </el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            v-if="canChooseShop"
            @click="selectGoodsData(true)">
            选择店铺产品
          </el-button>
        </div>

        <draggable
          v-model="showList"
          v-bind="dragOptions"
          tag="div"
          @start="drag = true"
          @end="drag = false"
          @sort="onSort"
          :move="onMove">
          <transition-group
            view-type="goods-list"
            type="transition"
            :name="!drag ? 'flip-list' : null"
            class="goods-list"
            tag="div">
            <div
              class="goods-list__item"
              v-for="(item, i) in showList"
              :style="{
                'width': itemWidth
              }"
              :key="item.goodsId">
              <div class="goods-list__item--close" @click="delGoods(i)">
                <i class="el-icon-close"></i>
              </div>
              <el-tooltip
                effect="dark"
                :disabled="drag"
                placement="top">
                <div slot="content">
                  {{item.goodsName}}<br/>
                  {{item.keywords}}
                </div>
                <div class="goods-list__item--text">
                  {{item.goodsName}}
                </div>
              </el-tooltip>
            </div>
          </transition-group>
        </draggable>
        <div v-show="goodsMaxNum > 0" class="f12 text-info">
          最多显示{{goodsMaxNum}}个产品
        </div>
      </el-form-item>
    </el-form>
    <el-form label-width="80px" v-if="showInfo">
      <el-form-item label="列表样式:">
        <el-radio-group v-model="selfRow">
          <el-radio :label="item" v-for="(item, i) in rowOpts" :key="i">一行{{item | rowText}}个</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="列表角标:">
        <el-checkbox v-model="selfShowLeftTopMarker">产品类别</el-checkbox>
      </el-form-item>
      <el-form-item label="列表参数:">
        <el-checkbox v-model="selfShowKeyword">关键字</el-checkbox>
        <el-checkbox v-model="selfShowGoodsLable">标签</el-checkbox>
        <el-checkbox v-model="selfShowUnitPrice">单价</el-checkbox>
        <el-checkbox v-model="selfShowGoodsInfo">订单和浏览数</el-checkbox>
      </el-form-item>
    </el-form>

    <el-dialog
      title="选择产品"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="goodsSelectVisible">
      <goods-select
        @select-change="selectChange"
        :category-id="categoryId"
        ref="goodsSelect"
        :is-shop="isShop"
        multiple/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsSelectVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GoodsSelect from '@/components/admin/goods-select'
import Draggable from 'vuedraggable'
var goodsList = []

export default {
  props: {
    // 商品最大限制
    goodsMaxNum: {
      type: Number,
      default: 0
    },
    // 是否显示商品
    showGoods: {
      type: Boolean,
      default: true
    },
    // 是否显示其他详细信息
    showInfo: {
      type: Boolean,
      default: true
    },
    // 是否可以选择平台产品
    canChoosePlatform: {
      type: Boolean,
      default: true
    },
    // GoodsSelect 组件的搜索
    categoryId: {
      type: [String, Number],
      default: ''
    },
    rowOpts: {
      type: Array,
      default: () => ([1, 2, 3])
    },
    itemWidth: {
      type: String,
      default: '95px'
    },
    canChooseShop: {
      type: Boolean,
      default: true
    },
    row: {
      type: Number
    },
    showLeftTopMarker: {
      type: Boolean
    },
    showKeyword: {
      type: Boolean
    },
    showGoodsLable: {
      type: Boolean
    },
    showUnitPrice: {
      type: Boolean
    },
    showGoodsInfo: {
      type: Boolean
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    drag: false,
    isShop: false,
    goodsSelectVisible: false
  }),
  components: {
    GoodsSelect,
    Draggable
  },
  computed: {
    // 是否显示选择产品
    showSelectGoods () {
      return this.goodsMaxNum === 0 || this.showList.length < this.goodsMaxNum
    },
    selfRow: {
      get () {
        return this.row
      },
      set (val) {
        this.$emit('update:row', val)
      }
    },
    selfShowLeftTopMarker: {
      get () {
        return this.showLeftTopMarker
      },
      set (val) {
        this.$emit('update:showLeftTopMarker', val)
      }
    },
    selfShowKeyword: {
      get () {
        return this.showKeyword
      },
      set (val) {
        this.$emit('update:showKeyword', val)
      }
    },
    selfShowGoodsLable: {
      get () {
        return this.showGoodsLable
      },
      set (val) {
        this.$emit('update:showGoodsLable', val)
      }
    },
    selfShowUnitPrice: {
      get () {
        return this.showUnitPrice
      },
      set (val) {
        this.$emit('update:showUnitPrice', val)
      }
    },
    selfShowGoodsInfo: {
      get () {
        return this.showGoodsInfo
      },
      set (val) {
        this.$emit('update:showGoodsInfo', val)
      }
    },
    // 显示使用
    showList: {
      get () {
        return this.handleList.map(item => ({
          goodsName: `${item.brandName || ''} ${item.goodsNumber || ''}`,
          keywords: item.keywords,
          goodsId: item.goodsId
        }))
      },
      set () {}
    },
    // 中转使用
    handleList: {
      get () {
        return this.list
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
  methods: {
    onMove (evt) {
      return evt.to.getAttribute('view-type') === 'goods-list'
    },
    delAllGoods () {
      this.$confirm('该操作将会清除所有选择商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('update:list', [])
        })
        .catch(() => {})
    },
    delGoods (i) {
      this.handleList.splice(i, 1)
      this.$emit('update:list', this.handleList)
    },
    onSort ({ newIndex, oldIndex }) {
      if (newIndex !== oldIndex) {
        // 对 handleList 操作是无效的
        let item = this.handleList.splice(oldIndex, 1)[0]
        this.handleList.splice(newIndex, 0, item)
        this.$emit('update:list', this.handleList)
      }
    },
    selectGoodsData (flag) {
      this.isShop = !!flag
      this.goodsSelectVisible = true
    },
    addGoodsList () {
      if (Array.isArray(goodsList)) {
        let list = this.handleList
        let flag = false

        goodsList.forEach(item => {
          let index = list.findIndex(({ goodsId }) => goodsId === item.goodsId)
          // 不存在的产品
          if (index === -1) {
            flag = true
            list.push(item)
          }
        })
        // 有更新时才触发
        if (flag) {
          // 表示有条数限制
          if (this.goodsMaxNum > 0) {
            list = list.slice(0, this.goodsMaxNum)
          }
          this.$emit('update:list', list)
        }
      }
      this.goodsSelectVisible = false
    },
    selectChange (val) {
      goodsList = val.map(item => ({
        goodsId: item.goodsId,
        goodsNumber: item.goodsNumber,
        unitPrice: item.unitPrice,
        keywords: item.keywords,
        brandName: item.brandName,
        labelName: item.labelName,
        classificationName: item.classificationName,
        img: item.img,
        unit: item.unit,
        goodsLabel: item.goodsLabel,
        label: item.label,
        salesCount: item.salesCount,
        viewGoodCount: item.viewGoodCount
      }))
    }
  },
  filters: {
    rowText (num) {
      switch (num) {
        case 1:
          return '一'
        case 2:
          return '两'
        case 3:
          return '三'
        case 4:
          return '四'
        case 5:
          return '五'
        case 6:
          return '六'
        case 7:
          return '七'
        case 8:
          return '八'
        case 9:
          return '九'
      }
    }
  },
  watch: {
    goodsSelectVisible (val) {
      if (!val) {
        this.$refs.goodsSelect.reset()
      }
    },
    goodsMaxNum (val) {
      if (val > 0) {
        this.$emit('update:list', this.handleList.slice(0, val))
      }
    }
  }
}
</script>

<style scoped>
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
.goods-list {
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap;
}
.goods-list__item {
  border: 1px solid #EBEEF5;
  cursor: move;
  user-select: none;
  background: #ffffff;
  width: 95px;
  padding: 0 3px;
  margin: 5px 0;
  position: relative;
  margin-right: 11.5px;
}
.goods-list .goods-list__item:nth-child(3n) {
  margin-right: 0px;
}
.goods-list__item--text {
  text-align: center;
  line-height: 40px;
  height: 40px;
  width: 100%;
  overflow: hidden;
  font-size: 12px;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-list__item--close {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  background: #d44950;
  cursor: pointer;
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 99;
  font-size: 12px;
}
</style>
