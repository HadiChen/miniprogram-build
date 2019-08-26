<template>
  <div>
    <base-tools :data="data"/>
    <el-form>
      <el-form-item label="选中菜单背景:">
        <el-color-picker v-model="activeBgcolor" show-alpha/>
      </el-form-item>
      <goods-base-tools
        :row.sync="row"
        :show-left-top-marker.sync="showLeftTopMarker"
        :show-keyword.sync="showKeyword"
        :show-goods-lable.sync="showGoodsLable"
        :show-unit-price.sync="showUnitPrice"
        :show-goods-info.sync="showGoodsInfo"
        :show-goods="false"/>
      <el-form-item label="产品分组:" class="mb0">
        <div class="f12 text-info">最多选择20个分类</div>
      </el-form-item>
      <list-wrap :list="list" @handle-close="delModule">
        <template v-slot="scope">
          <div>
            <el-form style="width: 100%" label-width="75px">
              <el-form-item label="选中分类:">
                {{scope.row.data.categoryName}}
              </el-form-item>
              <el-form-item label="菜单名称:">
                <el-input v-model.trim="scope.row.data.menuName" class="input"/>
              </el-form-item>
              <el-form-item label="排序:">
                <el-input v-model.trim="scope.row.data.sort" class="input" :min="0" type="number"/>
              </el-form-item>
              <el-form-item label="产品来源:">
                <el-radio-group
                  v-model="scope.row.data.goodsSource"
                  @change="$event => goodsSourceChange($event, scope.row.$index)">
                  <el-radio :label="1">当前分类下的产品</el-radio>
                  <el-radio :label="2">自定义</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="显示数量:">
                <el-input-number v-model="scope.row.data.goodsMaxNum" :min="0"></el-input-number>
                <div class="f12 text-info">0或为空表示不限制</div>
              </el-form-item>
            </el-form>
            <goods-base-tools
              :show-info="false"
              :can-choose-shop="false"
              :can-choose-platform="scope.row.data.goodsSource === 2"
              item-width="87px"
              :category-id="scope.row.data.categoryId"
              :goods-max-num="Number(scope.row.data.goodsMaxNum)"
              :list.sync="scope.row.data.goodsList"/>
          </div>
        </template>
      </list-wrap>
      <div class="text-center" v-show="list.length < 20">
        <el-button type="text" icon="el-icon-plus" @click="visible = true">添加分类</el-button>
      </div>
    </el-form>

    <el-dialog
      title="选择分类"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-cascader-panel
        :options="categoryList"
        :props="props"
        :show-all-levels="false"
        v-model="categoryIds">
        <template slot-scope="{ node, data }">
          <span>{{ data.menuName }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader-panel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="addClassify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import goodsMixin from './mixin/goods.js'
import BaseTools from './common/base-tools'
import GoodsBaseTools from './common/goods-base-tools'
import ListWrap from './common/list-wrap'

export default {
  mixins: [goodsMixin],
  components: {
    BaseTools,
    ListWrap,
    GoodsBaseTools
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1,
        data: {
          activeBgcolor: '',
          row: 2,
          showGoodsInfo: false,
          showLeftTopMarker: true,
          showKeyword: true,
          showGoodsLable: true,
          showUnitPrice: true,
          list: []
        }
      })
    }
  },
  data () {
    return {
      visible: false,
      categoryList: [],
      props: {
        value: 'categoryId',
        label: 'menuName',
        checkStrictly: true
      },
      categoryIds: []
    }
  },
  computed: {
    activeBgcolor: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('activeBgcolor') ? this.data.data.activeBgcolor : ''
      },
      set (val) {
        this.checkData()
        this.data.data.activeBgcolor = val
      }
    },
    list () {
      return this.data.data && Array.isArray(this.data.data.list) ? this.data.data.list : []
    }
  },
  methods: {
    // 切换来源
    goodsSourceChange (val, index) {
      let item = this.data.data.list[index]
      let len = item.goodsList.length

      const confirm = () => {
        if (len) {
          return this.$confirm('切换分类将会清除该分类所有选择商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            // 删删删, 手贱
            this.data.data.list[index].goodsList = []
          })
          .catch(e => {
            item.goodsSource = val === 1 ? 2 : 1
            return Promise.reject(e)
          })
        }
        return Promise.resolve()
      }

      this.$ddvUtil.autoRetry(() => {
        return confirm()
          .then(() => {
            // 使用分类下的商品
            if (val === 1) {
              return this.getGoodsList({
                pageNow: 1,
                pageSize: typeof item.goodsMaxNum === 'number' && item.goodsMaxNum > 0 ? item.goodsMaxNum : 50,
                categoryId: item.categoryId,
                // 暂时写死 2, 平台
                type: 2
              })
                .then(res => {
                  item.goodsList = res.lists
                })
            }
          })
          .catch(e => {
            if (typeof e !== 'string') {
              return Promise.reject(e)
            }
          })
      })
    },
    // 获取分类下的商品
    getGoodsList (sendData = {}) {
      return this.$ddvUtil.get('/v2.0/api/admin/goods/lists')
        .send(sendData)
    },
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          activeBgcolor: '',
          row: 2,
          // 新增字段
          goodsSource: 2,
          // 商品数量限制
          goodsMaxNum: 50,
          showGoodsInfo: false,
          showLeftTopMarker: true,
          showKeyword: true,
          showGoodsLable: true,
          showUnitPrice: true,
          list: []
        })
      }
    },
    delModule (i) {
      this.data.data.list.splice(i, 1)
    },
    getClassifyData () {
      this.$ddvUtil.autoRetry(() => {
        return this.$ddvUtil.get('v2.0/api/admin/category/lists')
          .send({
            projectId: this.$ddvUtil.$adminSite.projectId || 1
          })
          .then(res => {
            const clearEmptyChild = array => {
              array.forEach((item) => {
                if (item.children && item.children.length) {
                  clearEmptyChild(item.children)
                } else {
                  delete item.children
                }
              })
              return array
            }
            this.categoryList = clearEmptyChild(res.lists)
          })
      })
    },
    addClassify () {
      if (this.categoryIds.length) {
        let categoryIds = [...this.categoryIds]
        let data = {}
        let list = this.categoryList

        while (categoryIds.length > 0) {
          data = {...list.filter(item => item.categoryId === categoryIds[0])[0]}
          list = data.children
          categoryIds.splice(0, 1)
        }
        list = void 0
        let index = this.list.findIndex(({ categoryId }) => categoryId === data.categoryId)

        if (index === -1) {
          this.data.data.list.push({
            categoryName: data.menuName,
            menuName: data.menuName,
            sort: 1,
            goodsSource: 2,
            goodsMaxNum: 50,
            categoryId: data.categoryId,
            goodsList: []
          })
        } else {
          this.$message.warning('分类已存在')
          return
        }
      }
      this.visible = false
    },
    handleListKey () {
      if (this.data.data && Array.isArray(this.data.data.list)) {
        this.data.data.list.forEach(item => {
          if (!item.goodsSource) {
            // 默认2
            this.$set(item, 'goodsSource', 2)
          }
          if (!item.goodsMaxNum) {
            // 默认50
            this.$set(item, 'goodsMaxNum', 50)
          }
        })
      }
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.categoryIds = []
      }
    }
  },
  mounted () {
    this.handleListKey()
    this.getClassifyData()
  }
}
</script>

<style scoped>
.input {
  width: 280px;
}
</style>
