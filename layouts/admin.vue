<style src="element-ui/lib/theme-chalk/index.css" lang="css"></style>
<style src="bootstrap/dist/css/bootstrap.min.css" lang="css"></style>
<style src="font-awesome/css/font-awesome.min.css" lang="css"></style>
<style src="ddv-ui/css/admin/core.css" lang="css"></style>
<style src="ddv-ui/css/admin/components.css" lang="css"></style>
<style src="ddv-ui/css/admin/colors.css" lang="css"></style>
<style src="ddv-ui/css/admin/base.css" lang="css"></style>

<style lang="scss">
  [v-cloak] {
    display: none;
  }
  .ddv-management-system{
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .5s
    }

    .fade-enter,
    .fade-leave-active {
      opacity: 0
    }

    table {
      border-collapse: separate;
    }

    .panels {
      position: absolute;
      top: 0px;
      bottom: 0px;
      width: 100%;
    }

    .panel-top {
      height: 60px;
      line-height: 60px;
      background-color: #37474f;
      border-color: #37474f;
      color: #c0ccda;
    }

    .panel-center {
      background: #37474f;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
    }

    .logout {
      background-size: contain;
      width: 20px;
      height: 20px;
      float: left;
    }

    .pointer{
      cursor: pointer;
    }

    .logo {
      // width: 40px;
      // float: left;
      // margin: 10px 10px 10px 18px;
      height: 40px;
      float: left;
      width: auto;
      margin: 10px 10px 10px 18px;
    }

    .tip-logout {
      padding-right: 20px;
    }

    .tip-logout i {
      cursor: pointer;
    }

    .admin {
      color: #c0ccda;
      text-align: center;
    }

    .sidebars{
      height: 100%;
      /* overflow: auto; */
      vertical-align: top;
      width: 260px;
      background-color: #263238;
      color: #fff;
      position: relative;

      .el-menu--dark{
        background-color:#263238;
      }

      .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{
        background-color: #26a69a !important;
        color: #fff;
      }
    }

    .sidebars-main{
      z-index: 99;
      transition:all 0.3s;
      -moz-transition: all 0.3s;
      -webkit-transition: all 0.3s;
      -o-transition: all 0.3s;
    }

    .sidebars-main.active{
      width: 64px;
    }

    .panel-content{
      background: #f1f2f7;
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      left: 0px;
      overflow-y: auto;
      overflow-x: hidden;
      /*padding: 20px;*/
      padding-left: 260px;
      transition:all 0.3s;
      -moz-transition: all 0.3s;
      -webkit-transition: all 0.3s;
      -o-transition: all 0.3s;
    }

    .panel-content.active{
      padding-left: 64px !important;
    }

    .h37{
      height: 37px;
      line-height: 37px;
    }

    .mt-20{
      margin-top: -20px !important;
    }

    .row-xl{
      margin: 0 -20px;
    }

    .navbar-header-btn:hover{
      background-color: #324148;
    }

    .navbar-header{
      min-width: 260px;
    }

    .sidebars .el-menu--dark .el-submenu .el-menu{
      background-color:rgba(0,0,0,0.15) !important;
      -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset !important;
      box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset !important;
    }

    // ::-webkit-scrollbar {
    //   width: 8px;
    //   max-height: 8px;
    // }
    // ::-webkit-scrollbar-track {
    //   background-color: #fff;
    // }

    // ::-webkit-scrollbar-thumb {
    //   background-color: rgba(0, 0, 0, 0.2);
    //   border-radius: 4px;
    // }

    // ::-webkit-scrollbar-button {
    //   background-color: #7c2929;
    // }

    // ::-webkit-scrollbar-corner {
    //   background-color: black;
    // }
  }
  .overflow-visible {
    overflow: visible;
  }
</style>

<template>
  <div class="ddv-management-system">
    <nuxt/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'adminCheckLogin',
  head () {
    return {
      title: '',
      meta: [
        {
          'charset': 'utf-8'
        },
        {
          'name': 'viewport',
          'content': 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
        },
        {
          'name': 'renderer',
          'content': 'webkit'
        }
      ]
    }
  },
  data () {
    return {
      isFullScreen: false,
      showPage: false
    }
  },
  methods: {
    fullTodo () {
      this.isFullScreen = !this.isFullScreen
    },
    changePage () {
      let flag = this.$route.path !== '/admin/login'
      this.$store.commit('admin/setLogin', flag)
    },
    logout () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.replace('/admin/login')
      }).catch(() => {})
    }
  },
  computed: mapState({
    storeData: state => state.admin,
    breadcrumbTitle () {
      return this.storeData.breadcrumb.slice(this.storeData.breadcrumb.length - 2, this.storeData.breadcrumb.length)
    },
    ground () {
      if (this.storeData.breadcrumb.length === 1) {
        let obj = this.storeData.breadcrumb[0]
        return obj.name
      } else if (this.storeData.breadcrumb.length >= 2) {
        let obj = this.storeData.breadcrumb[this.storeData.breadcrumb.length - 2]
        return obj.name
      }
      return ''
    },
    nowPage () {
      if (this.storeData.breadcrumb.length >= 2) {
        let obj = this.storeData.breadcrumb[this.storeData.breadcrumb.length - 1]
        return ` - ${obj.name}`
      }
      return ''
    }
  }),
  watch: {
    '$route.path': {
      handler: 'changePage',
      deep: true
    }
  },
  created () {
    this.changePage()
  }
}
</script>
