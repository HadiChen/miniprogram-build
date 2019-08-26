
<template>
  <el-row class="panel panel-flat">
    <el-row class="panel-body clearfix">
      <!-- start: 装修 -->
      <div class="clearfix pt15">
        <div class="build-panel">
          <el-card>
            <el-form>
              <el-form-item label="语言选择:">
                <language-id-select-lists
                  v-model="languageId"
                  placeholder="切换语言"/>
              </el-form-item>
            </el-form>

            <div class="build-panel__title">编辑设置</div>
            <el-form label-width="100px">
              <el-form-item label="是否自动保存:">
                <el-switch
                  v-model="autoSave"
                  active-text="是"
                  inactive-text="否"/>
              </el-form-item>
              <el-form-item label="保存时间间隔:" v-show="autoSave">
                <el-input-number
                  v-model="duration"
                  :disabled="!autoSave"
                  :min="1"
                  :max="10"></el-input-number> 秒
                <div class="f12 text-info">
                  每次编辑后每隔{{duration}}秒自动保存
                </div>
              </el-form-item>
            </el-form>
            <div v-show="mode === 'edit'">
              <div class="build-panel__title">模块组件</div>
              <div class="clearfix">
                <div
                  class="build-module__item"
                  v-for="item in moduleOpts"
                  :key="item.viewType"
                  @click="clooseModule(item.viewType, lists.length)">
                  {{item.viewName}}
                </div>
              </div>
            </div>
            <div class="mt15">
              <el-button type="primary" @click="handleAutoSave(0)">保存页面</el-button>
              <el-button type="success" @click="updatePage">更新页面</el-button>
              <el-dropdown class="ml10" @command="handleCommand">
                <el-button type="warning">
                  预览<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="local">本地预览</el-dropdown-item>
                  <el-dropdown-item command="miniprogram">小程序预览</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                type="text"
                class="ml10"
                v-show="checkMode === 'local'"
                @click="mode = 'edit'; checkMode = ''">
                取消
              </el-button>
              <div class="f12 text-info mt5">1.保存页面只是保存当前修改</div>
              <div class="f12 text-info">2.更新页面是把当前页面更新到小程序上</div>
            </div>
          </el-card>
        </div>
        <div class="build-main">
          <page-view
            ref="pageViews"
            :data="lists"
            @select="handleSelect"
            @handle-del="handleDel"
            @move="handleSelect"
            @add-module="addModule"
            :mode="mode"/>
          <div
            class="build-tools"
            v-show="activeData.id && mode === 'edit'"
            :style="{
              'top': top + 'px'
            }">
            <el-card :header="header">
              <tools-panel :data="activeData"/>
            </el-card>
          </div>
        </div>

        <el-dialog
          title="添加模块"
          width="610px"
          :close-on-click-modal="false"
          :visible.sync="visible">
          <el-form label-width="80px">
            <el-form-item label="内容模块:">
              <div class="clearfix">
                <div
                  class="build-module__item"
                  v-for="item in moduleOpts"
                  :key="item.viewType"
                  @click="clooseModule(item.viewType)">
                  {{item.viewName}}
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- end: 装修 -->
    </el-row>
  </el-row>
</template>

<script>
import dataB from './2.js'
import PageView from '@/components/build/page-view'
import ToolsPanel from '@/components/build/tools-panel/index'
import sort from '@/assets/util/sort.js'

export default {
  layout: 'admin',
  components: {
    PageView,
    ToolsPanel
  },
  data: () => ({
    checkMode: '',
    mode: 'edit',
    lists: [],
    activeData: {},
    top: 0,
    // 自动保存
    autoSave: true,
    saveTime: 2,
    moduleOpts: [
      {
        viewName: '切换导航',
        viewType: 1
      },
      {
        viewName: '图片广告',
        viewType: 2
      },
      {
        viewName: '图文导航',
        viewType: 3
      },
      {
        viewName: '店铺列表卡片',
        viewType: 4
      },
      {
        viewName: '产品列表',
        viewType: 5
      },
      {
        viewName: '产品分组',
        viewType: 6
      },
      {
        viewName: '店铺头部',
        viewType: 7
      },
      {
        viewName: '产品筛选',
        viewType: 8
      },
      {
        viewName: '产品搜索',
        viewType: 9
      }
    ],
    visible: false,
    plusIndex: 0,
    languageId: 1,
    canAutoSave: true
  }),
  computed: {
    header () {
      return this.activeData.viewName
    },
    duration: {
      get () {
        if (this.saveTime && this.saveTime > 0) {
          return this.saveTime
        }
        return 2
      },
      set (val) {
        this.saveTime = val || 2
      }
    },
    projectId () {
      return this.$ddvUtil.$adminSite.projectId || 1
    }
  },
  methods: {
    handleCommand (command) {
      this.checkMode = command

      if (command === 'local') {
        this.mode = this.mode === 'edit' ? '' : 'edit'
      } else {
        this.$message.warning('暂未支持')
      }
    },
    /**
     * 获取新增模块数据
     * @returns {Object}
     */
    modulesData (viewType) {
      switch (viewType) {
        case 1:
          return {
            viewName: '切换导航',
            viewType: 1,
            marginBottom: 0,
            contentBgColor: '#01A3C1',
            sort: 1,
            data: {
              textColor: '#E3FBFF',
              activeColor: '#ffffff',
              list: []
            }
          }
        case 2:
          return {
            viewName: '图片广告',
            viewType: 2,
            marginBottom: 0,
            contentBgColor: '#f5f5f5',
            sort: 1,
            data: {
              indicatorDots: true,
              vertical: false,
              template: 3,
              height: 0,
              list: []
            }
          }
        case 3:
          return {
            viewName: '图文导航',
            viewType: 3,
            marginBottom: 0,
            contentBgColor: '#fff',
            sort: 1,
            data: {
              indicatorDots: true,
              vertical: false,
              template: 1,
              height: 188,
              list: []
            }
          }
        case 4:
          return {
            viewName: '店铺列表卡片',
            viewType: 4,
            marginBottom: 0,
            contentBgColor: '#ffffff',
            sort: 1,
            data: {
              list: []
            }
          }
        case 5:
          return {
            viewName: '产品列表',
            viewType: 5,
            sort: 1,
            marginBottom: 0,
            contentBgColor: '#f5f5f5',
            data: {
              row: 2,
              showLeftTopMarker: true,
              showGoodsInfo: false,
              showKeyword: true,
              showGoodsLable: true,
              showUnitPrice: true,
              showBgCover: false,
              bgCover: '',
              bgCoverLink: '',
              topSpace: 0,
              list: []
            }
          }
        case 6:
          return {
            viewName: '产品分组',
            viewType: 6,
            sort: 1,
            marginBottom: 0,
            contentBgColor: '#f5f5f5',
            data: {
              row: 2,
              showGoodsInfo: false,
              activeBgcolor: '#6BBD71',
              showLeftTopMarker: true,
              showKeyword: true,
              showGoodsLable: true,
              showUnitPrice: true,
              list: []
            }
          }
        case 7:
          return {
            viewName: '店铺头部',
            viewType: 7,
            sort: 1,
            marginBottom: 0,
            contentBgColor: '#01A3C1',
            data: {
              bgCover: '',
              info: {
                shopHomeLogo: '',
                shopName: '',
                projectId: 0
              }
            }
          }
        case 8:
          return {
            viewName: '产品筛选',
            viewType: 8,
            contentBgColor: '#f5f5f5',
            marginBottom: 0,
            sort: 94,
            data: {
              row: 2,
              showGoodsInfo: false,
              showLeftTopMarker: false,
              showKeyword: true,
              showGoodsLable: true,
              showUnitPrice: false,
              showBgCover: false,
              bgCover: '',
              bgCoverLink: '',
              activeTextColor: '#FF6600',
              textColor: '#757575',
              fontSize: 28
            }
          }
        case 9:
          return {
            viewName: '产品搜索',
            viewType: 9,
            contentBgColor: '#01A3C1',
            marginBottom: 0,
            sort: 94,
            data: {
              bgCover: '',
              showChatImage: true,
              chatImage: ''
            }
          }
      }
    },
    clooseModule (viewType, i) {
      let data = this.modulesData(viewType)
      data.id = this.createModuleId()
      // 简单判断是不是数字类型
      // 就不判断 Infinity 和 NaN 了，不会有的
      let pustIndex = typeof i === 'number' ? i : this.plusIndex

      // 代表前面插入
      if (pustIndex === -1) {
        this.lists.unshift(data)
      } else if (pustIndex === this.lists.length) {
        this.lists.push(data)
      } else {
        this.lists.splice(pustIndex, 0, data)
      }

      this.visible = false
    },
    /**
     * @param i {number} 下标，数据范围 -1 to Array.length
     */
    addModule (i) {
      this.plusIndex = i
      this.visible = true
    },
    /**
     * @param i {number} 下标
     * 删除
     */
    handleDel (i) {
      let data = this.lists.splice(i, 1)[0]

      if (data.id === this.activeData.id) {
        this.activeData = {}
      }
    },
    /**
     * @param rect {Object} getBoundingClientRect
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
     * @param data {Object} item原始数据
     * 选择
     */
    handleSelect (rect, data /** 原始数据 */) {
      this.top = rect.top - this.$refs.pageViews.$el.getBoundingClientRect().top

      if (data) {
        // 引用
        this.activeData = data
      }
    },
    /**
     * 创建模块id
     */
    createModuleId () {
      return Math.ceil((new Date().getTime() + (Math.random() * 1000)) / Math.random())
    },
    /**
     * 处理自动保存
     */
    handleAutoSave (time) {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        if (!this.canAutoSave) return

        this.$ddvUtil.autoRetry(() => {
          return this.handleSave()
            .then(() => {
              this.$notify.success({
                title: `${typeof time === 'number' ? '' : '自动'}保存成功`,
                position: 'top-left',
                duration: 3000
              })
            })
        })
      }, typeof time === 'number' ? time : this.duration * 1000)
    },
    /**
     * 保存
     */
    handleSave () {
      // 克隆数据
      let list = JSON.parse(JSON.stringify(this.lists))

      list.forEach(item => {
        switch (item.viewType) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 6:
            item.data.list = sort(item.data.list, {
              sortOrder: 'desc',
              prop: 'sort'
            })
            break
        }

        if (item.viewType === 1) {
          item.data.list = item.data.list.filter(item => item.content !== '')
        } else if (item.viewType === 2) {
          item.data.list = (item.data.template === 1 ? item.data.list.slice(0, 1) : item.data.list).filter(item => item.cover !== '')
        } else if (item.viewType === 3) {
          item.data.list = item.data.list.filter(item => !(item.cover === '' && item.title === ''))
        }
      })
      console.log(list)
      return Promise.resolve()
    },
    getDataList () {
      this.canAutoSave = false
      this.lists = dataB.map(item => ({
        ...item,
        id: this.createModuleId()
      }))
      this.$nextTick(() => {
        this.canAutoSave = true
        clearTimeout(this.timer)
      })
    },
    updatePage () {
      this.$ddvUtil.autoRetry(() => {
        return this.$confirm('当前操作会把页面更新到小程序上, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          // 先保存一下
          .then(() => this.handleSave())
          .then(() => {
            return this.$ddvUtil.put('/v2.0/api/admin/cache')
              .send({
                isPlatform: this.projectId === 1 ? 1 : 0,
                languageId: this.languageId || 1,
                projectId: this.projectId
              })
              .then(() => {
                this.$notify.success({
                  title: '更新成功',
                  message: '请到线上查看',
                  duration: 3000
                })
              })
          })
      })
    }
  },
  watch: {
    autoSave () {
      if (!this.autoSave) {
        clearTimeout(this.timer)
      } else {
        this.handleAutoSave()
      }
    },
    lists: {
      deep: true,
      handler () {
        if (!this.autoSave) {
          clearTimeout(this.timer)
        } else {
          this.handleAutoSave()
        }
      }
    },
    languageId () {
      this.getDataList()
    }
  },
  mounted () {
    this.getDataList()
  }
}
</script>

<style scoped>
.build-main {
  position: relative;
  float: left;
  margin-left: 420px;
}
.build-panel {
  position: fixed;
  /* float: left; */
  width: 400px;
  /* margin-right: 20px; */
}
.build-tools {
  position: absolute;
  width: 430px;
  right: -450px;
  top: 0;
  transition: all 0.3s;
}
.build-panel__title {
  font-weight: 500;
  line-height: 1.2;
  font-size: 16px;
  color: #333;
  margin-bottom: .5rem;
}
.build-module__item {
  border: 1px solid #e5e5e5;
  color: #666;
  box-sizing: border-box;
  height: 30px;
  line-height: 30px;
  background: #f8f8f8;
  text-align: center;
  cursor: pointer;
  width: 109px;
  font-size: 14px;
  margin: 5px;
  float: left;
  overflow: hidden;
  /* user-select: none; */
  border-radius: 4px;
}
.build-module__item:active {
  background-color: rgba(229, 229, 229, 0.8);
}
</style>
