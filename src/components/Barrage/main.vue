<template>
  <transition name="barrage" 
              @after-enter="afterEnter" 
              appear>
        <span v-if="visible" 
              class="barrage" 
              :style="positionStyle">
          {{message}}
        </span>
  </transition>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        visible: false,
        message: '',
        remove:null,
        verticalOffset:10,
      };
    },

    methods: {
      afterEnter(el){
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
        this.remove(this)
      }
    },
    computed: {
      positionStyle() {
        return {
          'top': `${ this.verticalOffset }px`
        };
      }
    },
  };
</script>
<style lang="scss">
.barrage-enter{
  left: 100%;
  transform: translateX(0);
}
.barrage-enter-to{
  left:0;
  transform: translateX(-100%);
}
.barrage-enter-active{
  transition: all linear 10s;
}
.barrage{
  color:#fff;
  display: inline-block;
  padding: 4px 6px;
  position: absolute;
  overflow: hidden;
  background-color: rgba(30, 30, 30, 0.3);
  white-space: nowrap;
  border-radius: 4px;
}
</style>