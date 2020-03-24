<template>
  <div class='analogue-container' :style="propStyle">

  </div>
</template>
<script>
export default {
  props:{
    design:{
      type:String,
      required:true,
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