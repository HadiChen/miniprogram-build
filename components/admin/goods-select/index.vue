<template>
  <div>
    <el-form inline label-width="80px">
      <el-form-item label="切换语言">
        <language-id-select-lists
          v-model="sendData.languageId"
          placeholder="切换语言"/>
      </el-form-item>
      <el-form-item label="产品状态">
        <el-select v-model="sendData.state" placeholder="请选择产品状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属分类">
        <el-cascader
          :options="categoryLists"
          :props="props"
          :show-all-levels="false"
          expand-trigger="click"
          change-on-select
          clearable
          placeholder="所属分类"
          v-model="categoryIds"
          @change="changeCategoryId"/>
      </el-form-item>
      <el-form-item label="产品型号">
        <el-input placeholder="请输入产品型号" v-model.trim="sendData.goodsNumber"/>
      </el-form-item>
      <el-form-item :label="isShop ? '选择店铺' : '来源店铺'">
        <site-id-lists v-model="projectId"/>
      </el-form-item>
    </el-form>

    <el-table
      :data="lists"
      ref="table"
      tooltip-effect="dark"
      :highlight-current-row="!multiple"
      @current-change="handleChange"
      @selection-change="handleChange"
      border>
      <el-table-column type="selection" width="55" v-if="multiple"/>
      <el-table-column width="55" v-else>
        <template slot-scope="scope">
          <el-radio :value="goodsId" :label="scope.row.goodsId">
            <span> </span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="goodsId" label="产品编号" min-width="30"></el-table-column>
      <el-table-column prop="goodsNumber" label="产品名称" min-width="30"></el-table-column>
      <el-table-column label="品牌" min-width="30" prop="brandName"></el-table-column>
      <el-table-column label="分类" min-width="30" prop="categoryName"></el-table-column>
      <el-table-column label="店铺" min-width="40" prop="shopName"></el-table-column>
      <el-table-column label="产品状态" min-width="30">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.state === -1
                ? '已下架'
                : scope.row.state === 0
                  ? '待上架'
                  : '已上架'
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pt10 pb10 clearfix">
      <el-pagination
        @current-change="$event => pageNow = $event"
        @size-change="$event => pageSize = $event"
        :current-page="pageNow"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :total="count"
        class="pull-right"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否获取店铺数据
    isShop: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: [String, Number],
      default: ''
    }
  },
  data: () => ({
    allClassifyIds: {},
    categoryLists: [],
    lists: [],
    goodsId: '',
    // 显示使用吧
    categoryIds: [],
    sendData: {
      languageId: 1,
      state: '',
      goodsNumber: '',
      categoryId: ''
    },
    props: {
      value: 'categoryId',
      label: 'categoryName'
    },
    pageNow: 1,
    pageSize: 10,
    count: 0,
    options: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 0,
        label: '待上架'
      },
      {
        value: 1,
        label: '已上架'
      },
      {
        value: -1,
        label: '已下架'
      }
    ],
    projectId: ''
  }),
  methods: {
    changeCategoryId (val) {
      if (Array.isArray(val) && val.length > 0) {
        this.sendData.categoryId = val[val.length - 1]
      } else {
        this.sendData.categoryId = ''
      }
    },
    handleData () {
      let ajaxData = {
        ...this.sendData,
        type: this.isShop ? 1 : 2,
        projectId: this.projectId || 1,
        pageNow: this.pageNow,
        pageSize: this.pageSize
      }

      if (this.categoryId) {
        ajaxData.categoryId = this.categoryId
      }
      return this.$ddvUtil.get('/v2.0/api/admin/goods/lists')
        .sendValidData(ajaxData)
        .then(res => {
          this.lists = res.lists
          this.count = res.page.count
        })
    },
    reset () {
      if (this.multiple) {
        this.$refs.table.clearSelection()
      } else {
        this.$refs.table.setCurrentRow(void 0)
      }
      this.goodsId = ''
      this.pageNow = 1
      this.pageSize = 10
      this.projectId = this.$ddvUtil.$adminSite.projectId
      this.categoryIds = []

      Object.keys(this.sendData).forEach(key => {
        // 暂时只有string和number
        this.sendData[key] = typeof this.sendData[key] === 'string' ? '' : 1
      })
    },
    getCateType () {
      this.$ddvUtil.autoRetry(() => {
        return Promise.resolve()
          .then(() => {
            if (!this.isShop) {
              return {
                languageId: this.sendData.languageId,
                projectId: this.projectId
              }
            }
            return this.$ddvUtil.get('/v1.0/api/admin/category/shop/privilege')
              .send({
                projectId: this.projectId
              })
              .then(res => ({
                languageId: this.sendData.languageId,
                projectId: this.projectId,
                categoryPermissionType: res.data.categoryPermissionType
              }))
          })
          .then(ajaxData => {
            return this.$ddvUtil.get('v1.0/api/admin/category')
              .validHeaders(this.projectId)
              .send(ajaxData)
              .then(res => {
                let allClassifyIds = {}
                const handleData = item => {
                  item.categoryName = item.hasOneCategoryDescription.categoryName
                }
                /**
                 * 递归处理分类数据
                 * 1、删除为空的 children
                 * 2、存储对应的层级id数据
                 * 2.1、例如 3: [1, 2, 3]
                 */
                const handleClassifyData = array => {
                  array.forEach((item) => {
                    handleData(item)

                    if (!allClassifyIds[item.categoryId]) {
                      // 获取对应的id数组
                      if (item.parentId && allClassifyIds[item.parentId]) {
                        allClassifyIds[item.categoryId] = allClassifyIds[item.parentId].concat(item.categoryId)
                      } else {
                        allClassifyIds[item.categoryId] = [item.categoryId]
                      }
                    }
                    if (item.children && item.children.length) {
                      item.children.forEach(itemChild => {
                        handleData(itemChild)
                      })
                      handleClassifyData(item.children)
                    } else {
                      delete item.children
                    }
                  })
                  return array
                }
                this.categoryLists = handleClassifyData(res.lists)
                this.allClassifyIds = allClassifyIds

                if (this.categoryId) {
                  this.categoryIds = [...this.allClassifyIds[this.categoryId]]
                }
              })
          })
      })
    },
    handleChange (val) {
      if (!val) {
        this.$emit('select-change', [])
      } else {
        if (!Array.isArray(val)) {
          this.goodsId = val.goodsId
        }

        this.$emit('select-change', (Array.isArray(val) ? val : [val]).map(item => ({
          ...item
        })))
      }
    }
  },
  watch: {
    isShop () {
      this.reset()
      this.getCateType()
      this.pageNow = 1
      this.$tryReplaceRouterMethod(this.sendData, 'handleData')
    },
    projectId () {
      this.pageNow = 1
      this.$tryReplaceRouterMethod(this.sendData, 'handleData')
    },
    pageNow () {
      this.$tryReplaceRouterMethod(this.sendData, 'handleData')
    },
    sendData: {
      deep: true,
      handler () {
        this.pageNow = 1
        this.$tryReplaceRouterMethod(this.sendData, 'handleData')
      }
    },
    pageSize () {
      this.pageNow = 1
      this.$tryReplaceRouterMethod(this.sendData, 'handleData')
    },
    categoryId (val) {
      this.reset()
      this.categoryIds = this.allClassifyIds[val] || []
      this.pageNow = 1
      this.$tryReplaceRouterMethod(this.sendData, 'handleData')
    }
  },
  mounted () {
    this.projectId = this.$ddvUtil.$adminSite.projectId
    this.getCateType()
    this.$ddvUtil.autoRetry(() => this.handleData())
  }
}
</script>
