<template>
  <div class='poke-view-container'>
    <div  class="poke-block" 
          v-for="(p) in  pokeData"  
          :key="p.id">
          <div class="poke-screen" 
               :class="{
                'poke-red':idRed.includes(p.color),
                }">
             <span class="letter-tight">{{p.label}}</span>
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