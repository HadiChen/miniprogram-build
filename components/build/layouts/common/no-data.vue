<template>
  <div class="no-data">{{title}}</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '模块无内容'
    }
  }
}
</script>

<style scoped>
.no-data {
  text-align: center;
  color: #ffffff;
  background: rgba(1, 163, 193, 1);
  padding: 15px 0;
  font-size: 14px;
  animation-name: shake-slow;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-play-state: running;
}
@keyframes shake-slow {
  0% {
      transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
      transform: translate(-1px, 1.5px) rotate(1.5deg);
  }
  4% {
      transform: translate(1.3px, 0px) rotate(-0.5deg);
  }
  6% {
      transform: translate(1.4px, 1.4px) rotate(-2deg);
  }
  8% {
      transform: translate(-1.3px, -1px) rotate(-1.5deg);
  }
  10% {
      transform: translate(1.4px, 0px) rotate(-2deg);
  }
  12% {
      transform: translate(-1.3px, -1px) rotate(-2deg);
  }
  14% {
      transform: translate(1.5px, 1.3px) rotate(1.5deg);
  }
  16% {
      transform: translate(1.5px, -1.5px) rotate(-1.5deg);
  }
  18% {
      transform: translate(1.3px, -1.3px) rotate(-2deg);
  }
  20% {
      transform: translate(1px, 1px) rotate(-0.5deg);
  }
  22% {
      transform: translate(1.3px, 1.5px) rotate(-2deg);
  }
  24% {
      transform: translate(-1.4px, -1px) rotate(2deg);
  }
  26% {
      transform: translate(1.3px, -1.3px) rotate(0.5deg);
  }
  28% {
      transform: translate(1.6px, -1.6px) rotate(-1.5deg);
  }
  30% {
      transform: translate(-1.3px, -1.3px) rotate(-1.5deg);
  }
  32% {
      transform: translate(-1px, 0px) rotate(2deg);
  }
  34% {
      transform: translate(1.3px, 1.3px) rotate(-0.5deg);
  }
  36% {
      transform: translate(1.3px, 1.6px) rotate(1.5deg);
  }
  38% {
      transform: translate(1.3px, -1.6px) rotate(1.5deg);
  }
  40% {
      transform: translate(-1.4px, -1px) rotate(-0.5deg);
  }
  42% {
      transform: translate(-1.4px, 1.3px) rotate(-0.5deg);
  }
  44% {
      transform: translate(-1.6px, 1.4px) rotate(0.5deg);
  }
  46% {
      transform: translate(-2.1px, -1.3px) rotate(-0.5deg);
  }
  48% {
      transform: translate(1px, 1.6px) rotate(1.5deg);
  }
  50% {
      transform: translate(1.6px, 1.6px) rotate(1.5deg);
  }
  52% {
      transform: translate(-1.4px, 1.6px) rotate(0.5deg);
  }
  54% {
      transform: translate(1.6px, -1px) rotate(-2deg);
  }
  56% {
      transform: translate(1.3px, -1.6px) rotate(-2deg);
  }
  58% {
      transform: translate(-1.3px, -1.6px) rotate(0.5deg);
  }
  60% {
      transform: translate(1.3px, 1.6px) rotate(-0.5deg);
  }
  62% {
      transform: translate(0px, 0px) rotate(-1.5deg);
  }
  64% {
      transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  66% {
      transform: translate(1.6px, -1.6px) rotate(0.5deg);
  }
  68% {
      transform: translate(0px, -1.6px) rotate(-2deg);
  }
  70% {
      transform: translate(-1.6px, 1px) rotate(1.5deg);
  }
  72% {
      transform: translate(-1.6px, 1.6px) rotate(2deg);
  }
  74% {
      transform: translate(1.3px, -1.6px) rotate(-0.5deg);
  }
  76% {
      transform: translate(1.4px, 1px) rotate(-0.5deg);
  }
  78% {
      transform: translate(-1px, 1.4px) rotate(2deg);
  }
  80% {
      transform: translate(1.4px, 1.6px) rotate(2deg);
  }
  82% {
      transform: translate(-1.6px, -1.6px) rotate(-0.5deg);
  }
  84% {
      transform: translate(-1.4px, 1.4px) rotate(-2deg);
  }
  86% {
      transform: translate(1px, 1.4px) rotate(-2deg);
  }
  88% {
      transform: translate(-1.4px, 1.4px) rotate(-1.5deg);
  }
  90% {
      transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  92% {
      transform: translate(-1.4px, 1.6px) rotate(2deg);
  }
  94% {
      transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  96% {
      transform: translate(-1.4px, 1.3px) rotate(-2deg);
  }
  98% {
      transform: translate(1.3px, 1px) rotate(-0.5deg);
  }
}
</style>
