<template>
  <div
    class="image-view"
    :class="{
      'image-view__flew': imagesList.length > 1
    }"
    :style="heightStyle">
    <img
      class="image-view__image"
      v-for="(item, i) in imagesList"
      :key="i"
      :src="item.cover"
      :style="{
        'width': (100 / imagesList.length) + '%',
        'height': heightStr
      }"/>
  </div>
</template>

<script>
export default {
  props: {
    imagesList: {
      type: Array,
      default: () => ([])
    },
    height: {
      type: [Number, String],
      value: 'auto'
    }
  },
  data () {
    return {
      heightStyle: ''
    }
  },
  computed: {
    heightStr () {
      if (!this.height) {
        return 'auto'
      } else {
        return typeof this.height === 'string' ? this.height : this.height + 'px'
      }
    }
  },
  methods: {
    handleHeightStyle () {
      if (this.height) {
        this.heightStyle = `height: ${typeof this.height === 'string' ? this.height : this.height + 'px'};`
      } else {
        this.heightStyle = ''
      }
    }
  },
  watch: {
    height () {
      this.handleHeightStyle()
    }
  },
  mounted () {
    this.handleHeightStyle()
  }
}
</script>

<style scoped>
.image-view {
  width: 100%;
  transition: all 0.3s;
}
.image-view__flew {
  display: flex
}
.image-view__image {
  display: block;
  object-fit: cover;
}
</style>
