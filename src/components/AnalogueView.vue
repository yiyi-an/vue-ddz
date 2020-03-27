<template>
  <div class='analogue-container' :style="propStyle">
    <div class="analogue-wrap" :class="{'row-reverse':design == 'next'}">
      <div style="width:52px">
        <div class="analogue-avtar" v-if="playerData.uid">
          {{playerData.uid}}
        </div>
        <div class="analogue-empty print-text" v-else >空闲</div>
      </div>
      <div class="analogue-print-view">
           <div class="print-text" v-show="pokeViewData.length==0"> {{playerData.message}}</div>
           <poke-view :pokeData="pokeViewData" v-show="pokeViewData.length!==0"/>
      </div>
    </div>
  </div>
</template>
<script>
import PokeView from '@c/PokeView.vue'

export default {
  components:{
    PokeView
  },
  props:{
    design:{// 上下家标识
      type:String,
      required:true,
    },
    playerData:{
      type:Object,
      required:true
    },
    pokeViewData:{
      type:Array,
      required:true
    }
  },
  data() {
    return {
       
    }
  },
  computed:{
    propStyle() {
      const isprev =  this.design ==="prev"
      if(isprev){
        return {
          left:"0"
        }
      }else{
        return {
          right:'0'
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    
  }
}
</script>
<style lang="scss">
.analogue-wrap{
    height: 70px;
    width: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
  .analogue-avtar{
    line-height: 50px;
    overflow: hidden;
    background: #fff;
    width: 52px;
    height: 70px;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 4px 4px;
  }
}
</style>