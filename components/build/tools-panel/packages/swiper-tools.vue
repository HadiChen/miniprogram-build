<template>
  <div>
    <base-tools :data="data"/>
    <el-form>
      <el-form-item label="选择模板:">
        <div class="clearfix">
          <div
            v-for="item in opts"
            :key="item.type"
            class="pull-left opts-item"
            :class="{
              'active': template === item.type
            }"
            @click="template = item.type">
            <img :src="item.icon"/>
            <div class="opts-item__text">
              {{item.title}}
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="高度:">
        <el-input
          v-model.trim="height"
          placeholder="请输入高度(数字或者'auto')"
          class="input">
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否显示面板指示点:" v-show="template === 3">
        <el-switch v-model="indicatorDots" active-text="显示" inactive-text="不显示"/>
      </el-form-item>
      <el-form-item label="是否纵向滑动:" v-show="template === 3">
        <el-switch v-model="vertical" active-text="是" inactive-text="否"/>
      </el-form-item>
    </el-form>
    <list-wrap :list="list" flex-direction="column" @handle-close="delModule">
      <template v-slot:sidebar="scope">
        <image-upload v-model="scope.row.data.cover"/>
      </template>
      <template v-slot="scope">
        <el-form style="width: 100%;" class="mt15">
          <el-form-item label="链接:">
            <el-input v-model.trim="scope.row.data.link" class="input"/>
          </el-form-item>
          <el-form-item label="排序:" class="mb0">
            <el-input v-model.trim="scope.row.data.sort" type="number" :min="0" class="input"/>
          </el-form-item>
        </el-form>
      </template>
    </list-wrap>

    <div class="text-center">
      <el-button type="text" icon="el-icon-plus" @click="plus">添加导航</el-button>
    </div>
  </div>
</template>

<script>
import BaseTools from './common/base-tools'
import ListWrap from './common/list-wrap'
import ImageUpload from '@/components/image-upload/index'
const oneImage = require('./images/one.png')
const twoImage = require('./images/two.png')
const threeImage = require('./images/three.png')

export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        contentBgColor: '',
        marginBottom: '',
        sort: 1,
        data: {
          indicatorDots: true,
          vertical: false,
          template: 1,
          height: 0,
          list: []
        }
      })
    }
  },
  data () {
    return {
      opts: [
        {
          icon: oneImage,
          title: '单个大图',
          type: 1
        },
        {
          icon: twoImage,
          title: '横向多图',
          type: 2
        },
        {
          icon: threeImage,
          title: '轮播图',
          type: 3
        }
      ]
    }
  },
  components: {
    BaseTools,
    ImageUpload,
    ListWrap
  },
  computed: {
    list () {
      return this.data.data && Array.isArray(this.data.data.list) ? this.data.data.list : []
    },
    height: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('height') ? this.data.data.height : 0
      },
      set (val) {
        this.checkData()

        if ('auto'.indexOf(val) === 0) {
          this.data.data.height = val
        } else if (val || val === 0) {
          this.data.data.height = parseFloat(val) || 0
        } else {
          this.data.data.height = ''
        }
      }
    },
    template: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('template') ? this.data.data.template : 1
      },
      set (val) {
        this.checkData()
        this.data.data.template = val
      }
    },
    vertical: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('vertical') ? this.data.data.vertical : false
      },
      set (val) {
        this.checkData()
        this.data.data.vertical = val
      }
    },
    indicatorDots: {
      get () {
        return this.data.data && this.data.data.hasOwnProperty('indicatorDots') ? this.data.data.indicatorDots : true
      },
      set (val) {
        this.checkData()
        this.data.data.indicatorDots = val
      }
    }
  },
  methods: {
    checkData () {
      if (!this.data.data) {
        this.$set(this.data, 'data', {
          indicatorDots: true,
          vertical: false,
          template: 1,
          height: 0,
          list: []
        })
      }
    },
    delModule (i) {
      this.data.data.list.splice(i, 1)
    },
    plus () {
      this.checkData()
      this.data.data.list.push({
        cover: '',
        link: '',
        sort: 1
      })
    }
  }
}
</script>

<style scoped>
.input {
  width: 280px;
}
.opts-item {
  width: 90px;
  margin-right: 10px;
  cursor: pointer;
  border: 1px solid #f5f5f5;
}
.opts-item.active {
  border: 1px solid #d44950;
}
.opts-item__text {
  text-align: center;
  font-size: 12px;
  color: #333;
  line-height: 28px;
}
.opts-item > img {
  display: block;
  width: 100%;
}
.opts-item:last-child {
  margin-right: 0px;
}
</style>
