<template>
  <div class='poke-view-container'>
    <div  class="poke-block" 
          style="width:22px"
          v-for="(p,ind) in  pokerData"  
          :key="p.id">
          <div class="poke-screen" 
               :class="{
                'poke-red':idRed.includes(p.color),
                'poke-checked':p.checked
                }"
                :style="{
                  'z-index':666+ind
                }"
                @click="handlePoke(p)">
             <span class="letter-tight" :class="{'poke-joker':p.weight>12}">{{p.label}}</span>
             <span>{{p.color|parseColor(p.id)}}</span>
          </div>
    </div>
  </div>
</template>
<script>

const pArr = ["♦️","♣️","♥️","♠️"]
const testData = [
        {checked:false,"id": 51,"weight": 12,"color": "黑","label": "2"},
        {checked:false,"id": 25,"weight": 12,"color": "梅","label": "2"},
        {checked:false,"id": 37,"weight": 11,"color": "红","label": "A"},
        {checked:false,"id": 49,"weight": 10,"color": "黑","label": "K"},
        {checked:false,"id": 10,"weight": 10,"color": "方","label": "K"},
        {checked:false,"id": 48,"weight": 9,"color": "黑","label": "Q"},
        {checked:false,"id": 35,"weight": 9,"color": "红","label": "Q"},
        {checked:false,"id": 34,"weight": 8,"color": "红","label": "J"},
        {checked:false,"id": 7,"weight": 7,"color": "方","label": "10"},
        {checked:false,"id": 45,"weight": 6,"color": "黑","label": "9"},
        {checked:false,"id": 32,"weight": 6,"color": "红","label": "9"},
        {checked:false,"id": 5,"weight": 5,"color": "方","label": "8"},
        {checked:false,"id": 30,"weight": 4,"color": "红","label": "7"},
        {checked:false,"id": 16,"weight": 3,"color": "梅","label": "6"},
        {checked:false,"id": 29,"weight": 3,"color": "红","label": "6"},
        {checked:false,"id": 0,"weight": 0,"color": "方","label": "3"},
        {checked:false,"id": 39,"weight": 0,"color": "黑","label": "3"}
      ]
export default {
  props:{
    pokerData:{
      required:true,
      type:Array
    }
  },
  watch:{
    pokerData(val){
      this.comCheckList()
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
        idRed:['红','方',"JOCKER"],
       pocker:undefined
    }
  },
  mounted() {

  },
  methods: {
    handlePoke(p){
      p.checked = !p.checked
       this.comCheckList()
    },
    comCheckList(){
      const checkedList = this.pokerData.filter(item=>{
        return item.checked
      })
      this.$emit('input',checkedList)
    }
  }
}
</script>