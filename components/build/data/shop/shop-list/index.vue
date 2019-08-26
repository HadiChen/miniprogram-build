<template>
  <div>
    <el-form inline>
      <el-form-item label="店铺名称">
        <el-input v-model.trim="sendData.name" placeholder="请输入店铺名称，支持模糊搜索" style="width:250px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="经营主体">
        <el-input v-model.trim="sendData.companyName" placeholder="请输入经营主体的企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="店铺类型">
        <el-select v-model="sendData.projectType" placeholder="请选择">
          <el-option
            v-for="item in projectTypeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺状态">
        <el-select v-model="sendData.status" placeholder="请选择">
          <el-option
            v-for="item in statusOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="lists"
      tooltip-effect="dark"
      border
      ref="table"
      :highlight-current-row="!multiple"
      @current-change="handleChange"
      @selection-change="handleChange">
      <el-table-column type="selection" width="55" v-if="multiple"/>
      <el-table-column width="55" v-else>
        <template slot-scope="scope">
          <el-radio :value="projectId" :label="scope.row.projectId">
            <span> </span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" prop="shopName"></el-table-column>
      <el-table-column label="经营主体" prop="companyName"></el-table-column>
      <el-table-column label="店铺状态">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.status === 1
                ? '经营中'
                : scope.row.status === -1
                  ? '已打烊'
                  : '未知'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="店铺类型">
        <template slot-scope="scope">
          <span>{{scope.row.projectType === 1 ? '旗舰店' : '平台店'}}</span>
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
    }
  },
  data: () => ({
    sendData: {
      name: '',
      companyName: '',
      projectType: '',
      projectTypeOpts: '',
      status: ''
    },
    projectTypeOpts: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '旗舰店'
      },
      {
        value: 2,
        label: '平台店'
      }
    ],
    statusOpts: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '经营中'
      },
      {
        value: -1,
        label: '已打烊'
      }
    ],
    lists: [],
    pageNow: 1,
    pageSize: 10,
    count: 0,
    projectId: ''
  }),
  computed: {
    handleSendData () {
      let data = {}

      Object.keys(this.sendData).forEach(key => {
        if (this.sendData[key] || this.sendData[key] === 0) {
          data[key] = this.sendData[key]
        }
      })
      return data
    }
  },
  methods: {
    reset () {
      if (this.multiple) {
        this.$refs.table.clearSelection()
      } else {
        this.$refs.table.setCurrentRow(void 0)
      }
      this.goodsId = ''
      this.pageNow = 1
      this.pageSize = 10
      Object.keys(this.sendData).forEach(key => {
        this.sendData[key] = ''
      })
    },
    handleChange (val) {
      if (!val) {
        this.$emit('select-change', [])
      } else {
        if (!Array.isArray(val)) {
          this.projectId = val.projectId
        }

        this.$emit('select-change', (Array.isArray(val) ? val : [val]).map(item => ({
          shopId: item.projectId,
          shopName: item.shopName,
          logo: item.logo
        })))
      }
    },
    getLists () {
      return this.$ddvUtil.get('v1.0/api/admin/project')
        .send({
          ...this.handleSendData,
          pageNow: this.pageNow,
          pageSize: this.pageSize
        })
        .then(res => {
          this.lists = res.lists.map(item => ({
            projectId: item.projectId,
            shopName: (item.hasOneProjectDescriptionModel && item.hasOneProjectDescriptionModel.shopName) || '',
            companyName: (item.hasOneCompanyModel && item.hasOneCompanyModel.companyName) || '',
            status: item.status,
            projectType: item.projectType,
            logo: (item.hasOneProjectDescriptionModel && item.hasOneProjectDescriptionModel.shopMobileListLogo) || ''
          }))
          this.count = res.page.count
        })
    }
  },
  watch: {
    handleSendData () {
      this.pageNow = 1
      this.$tryReplaceRouterMethod({}, 'getLists')
    },
    pageNow () {
      this.$tryReplaceRouterMethod({}, 'getLists')
    },
    pageSize () {
      this.pageNow = 1
      this.$tryReplaceRouterMethod({}, 'getLists')
    }
  },
  mounted () {
    this.$ddvUtil.autoRetry(() => this.getLists())
  }
}
</script>
