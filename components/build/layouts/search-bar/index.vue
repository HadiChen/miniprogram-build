<template>
  <div class="searchbar-wrap">
    <img
      :src="info.bgCover"
      v-if="info.bgCover"
      class="searchbar-wrap__cover"/>
    <div class="searchbar-wrap__main">
      <div class="searchbar-main__input">
        <span class="iconfont icon-sousuo searchbar-main__sousuo"></span>
        <span class="searchbar-main__placeholder">
          {{info.placeholder}}
        </span>
      </div>
      <div class="searchbar-chat" v-if="info.showChatImage">
        <div class="searchbar-chat__sms">
          10
        </div>
        <img
          :src="viewData.chatImage"
          v-if="info.showChatImage && info.chatImage"
          class="searchbar-chat__cover"/>
        <span class="el-icon-chat-dot-round searchbar-chat__icon" v-else></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    viewData: {
      type: Object,
      default: () => ({
        bgCover: '',
        chatImage: '',
        showChatImage: true,
        placeholder: '请输入产品型号，支持模糊搜索'
      })
    }
  },
  computed: {
    info () {
      return {
        bgCover: '',
        chatImage: '',
        showChatImage: true,
        placeholder: '请输入产品型号，支持模糊搜索',
        ...(this.viewData || {})
      }
    }
  }
}
</script>

<style scoped>
.searchbar-wrap {
  width: 100%;
  height: 50px;
  position: relative;
  background: #01A3C1;
}

.searchbar-wrap__cover {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.searchbar-wrap__main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searchbar-main__input {
  width: 310px;
  height: 30px;
  line-height: 30px;
  background: #fff;
  border-radius: 15px;
  padding: 0 16px;
}

.searchbar-main__sousuo {
  color: #979797;
  font-size: 15px;
  margin-right: 8px;
}

.searchbar-main__placeholder {
  font-size: 14px;
  color: #CCCCCC;
}

.searchbar-chat {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: relative;
  margin-left: 13px;
}
.searchbar-chat__cover {
  width: 100%;
  height: 100%;
  display: block;
}

.searchbar-chat__icon {
  color: #fff;
  font-size: 19px;
}

.searchbar-chat__sms {
  position: absolute;
  top: -5px;
  right: -5px;
  color: #fff;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  background: red;
  border-radius: 10px;
}
</style>
