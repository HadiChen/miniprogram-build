<template>
  <div class="shop-header">
    <img
      v-show="bgCover"
      :src="bgCover"
      class="shop-header__cover"/>

    <div class="shop-header__bot">
      <!-- 中间 -->
      <div class="shop-header__bot-left">
        <img
          class="shop-header__bot-left--img"
          :src="info.shopHomeLogo"
          mode="aspectFill"/>
      </div>
      <div class="shop-header__bot-right">
        <div class="shop-header__bot-content">
          <div class="shop-header__bot-store">{{info.shopName}}</div>
          <div class="shop-header__bot-label">
            <div class="shop-header__bot-label--label1">旗舰店</div>
            <div class="shop-header__bot-label--label2">100 人关注</div>
          </div>
        </div>
        <div class="shop-header__bot-content-att2">
          + 关注
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import image from './header-img'

export default {
  props: {
    viewData: {
      type: Object,
      default: () => ({
        bgCover: '',
        info: {
          shopHomeLogo: '',
          shopName: '',
          projectId: 0
        }
      })
    }
  },
  computed: {
    bgCover () {
      return this.viewData.bgCover || ''
    },
    info () {
      let obj = {
        ...(this.viewData.info || {})
      }
      obj.shopHomeLogo = obj.shopHomeLogo || image.logo
      obj.shopName = obj.shopName || '店铺名称'
      return obj
    }
  }
}
</script>

<style scoped>
.shop-header {
  width: 100%;
  height: 100px;
  position: relative;
}

.shop-header__cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@n shop {
  @b header {
    @e bot {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      width: 100%;
      margin-top: 20px;
      padding-left: 22px;
    }

    @e bot-left {
      width: 50px;
      height: 50px;
      background: #ffffff;
      border-radius: 4px;

      @m img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @e bot-right {
      display: flex;
      margin-left: 11px;
    }

    @e bot-content {
      width: 210px;
    }

    @e bot-store {
      font-size: 18px;
      color: #ffffff;
    }

    @e bot-label {
      margin-top: 9px;
      display: flex;
      align-items: flex-end;

      @m label1 {
        height: 18px;
        padding: 0 10px;
        margin-right: 6px;
        display: flex;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
        line-height: 18px;
        background-image: linear-gradient(-270deg, #FEBE47 2%, #FF9829 100%);
        border-radius: 9px;
      }

      @m label2 {
        height: 18px;
        font-size: 12px;
        color: #ffffff;
      }
    }

    @e bot-content-att1 {
      width: 72px;
      height: 23px;
      text-align: center;
      line-height: 23px;
      font-size: 13px;
      color: #ffffff;
      background: rgba(0, 0, 0, 0);
      border: 1px solid #ffffff;
      border-radius: 11.5px;
    }

    @e bot-content-att2 {
      width: 72px;
      height: 23px;
      text-align: center;
      line-height: 23px;
      font-size: 13px;
      color: #ffffff;
      background-image: linear-gradient(90deg, #F20400 0%, #FF4D17 100%);
      border-radius: 11.5px;
    }
  }

  @b follow {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 90px;
    height: 90px;
    margin-left: -45px;
    margin-top: -45px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 5px;
    text-align: center;

    @e text {
      color: #ffffff;
      font-size: 13px;
      margin-top: 5px;
    }
  }
}
</style>
