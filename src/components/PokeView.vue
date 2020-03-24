<template>
  <div class='poke-view-container'>
    <div  class="poke-block" 
          v-for="(p) in  pokeData"  
          :key="p.id">
          <div class="poke-screen" 
               :class="{
                'poke-red':idRed.includes(p.color),
                }">
             <span>{{p.label}}</span>
             <span>{{p.color|parseColor(p.id)}}</span>
          </div>
    </div>
  </div>
</template>
<script>

const pArr = ["♦️","♣️","♥️","♠️"]
export default {
  props:{
    pokeData:{
      required:true,
      type:Array
    }
  },
  filters:{
    parseColor(val){
      switch(val){
        case '黑':return "♠️";
        case '红':return "♥️";
        case '梅':return "♣️";
        case '方':return "♦️";
      }
    }
  },
  data() {
    return {
        idRed:['红','方'],
       pocker:[
     
      ]
    }
  },
  mounted() {


  },
}
</script>
<style lang="scss">
  .poke-view-container{
    display: flex;
    justify-content: center;
    > div{
      width:28px;
    }
    .poke-screen{
      position: relative;
      font-size: 18px;
      cursor: auto;
      font-weight: 700;
      width: 60px;
      height: 80px;
      border: 1px solid #333;
      border-radius: 8px;
      padding:5px  7px;
      background: #eee;
      display: flex;
      flex-flow: column;
      overflow: hidden;
    }
    .poke-red{
      color: #d50e0e;
    }
    .poke-checked{
      transform: translateY(-20px);
    }
  }
</style>