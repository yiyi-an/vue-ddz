<template>
<div class="room page-container">
  <div class="room-main app-bg">
      <div class="main-header"></div>
      <analogue-view design="prev" :player-data="prevPlayer" :poke-view-data="prevPokeData"/>
      <analogue-view design="next" :player-data="nextPlayer" :poke-view-data="nextPokeData"/>

      <div class="main-self">
         <div class="self-print-poke">
           <div class="print-text" v-show="pokeViewData.length==0"> {{this.textView}}</div>
           <poke-view :pokeData="pokeViewData" v-show="pokeViewData.length!==0"/>
        </div>
        <div class="self-widget">
          <div v-if="gameStatus=='wating'" style="text-align:center"  >
            <el-button type="success" style="width:72px"  size="mini" v-if="!isReady" @click="onReady(true)">准 备</el-button>
            <el-button type="warning" style="width:72px"  size="mini" v-else @click="onReady(false)">取消准备</el-button>
          </div>
          <div v-if="gameStatus=='game' && yourRound" style="text-align:center">
              <el-button type="warning" style="width:72px"  @click="onPass">PASS</el-button>
              <el-button type="success" style="width:72px"  @click="onEmit">出 牌</el-button>
          </div>
          <div v-if="gameStatus=='grab' && yourRound" style="text-align:center">
              <el-button type="primary" style="width:72px" :disabled="jetton>=1" @click="onGrab(1)">1 分</el-button>
              <el-button type="primary" style="width:72px" :disabled="jetton>=2" @click="onGrab(2)">2 分</el-button>
              <el-button type="primary" style="width:72px" :disabled="jetton>=3" @click="onGrab(3)">3 分</el-button>
              <el-button type="warning" style="width:72px"  @click="onGrab(0)">不 抢</el-button>
          </div>
        </div>
        <div v-if="gameStatus=='game' || gameStatus=='grab' " class="self-pock-hand">
          <poke-hand :poke-data="pokeData" v-model="checkedList"/>
        </div>
      </div>
    </div>


    



    <div class="chat-container">
      <el-input v-model="chatMessage" ref="chatInput"
                @keyup.enter.native="onMessage"
                :placeholder="chatDisable?'1秒后可再次发言':'Ctrl+Enter 输入框获取焦点, Enter 发送'" 
                :disabled="chatDisable"
                class="chat-input"></el-input>
      <el-button class="chat-button" type="primary" @click="onMessage" :disabled="chatDisable">发送</el-button>
    </div>
</div>
  
</template>
<script>
import AnalogueView from '@c/AnalogueView.vue'
import PokeHand from '@c/PokeHand.vue'
import PokeView from '@c/PokeView.vue'
export default {
  components:{
    AnalogueView,
    PokeHand,
    PokeView
  },
  data() {
    return {
      gameStatus:"wating",
      chatDisable:false,
      checkedList:[],
      pokeData:[],
      pokeViewData:[],
      prevPokeData:[],
      nextPokeData:[],
      textView:'',
      chatMessage:'',
      jetton:'',
      currentIndex:'',
      playerIndex:undefined,
      uid:undefined,
      player:{},
      
      prevPlayer:{},
      nextPlayer:{},
    }
  },
  computed:{
    isReady() {
      return this.player.isReady
    },
    yourRound(){
      return `${this.currentIndex}` === `${this.playerIndex}`
    }
  },
  created() {},
  mounted() {
    this.uid = localStorage.getItem("ddz_uid");
    // 加入房间
    this.$socket.emit("roomChannel", this.uid);

    //监听房间频道
    this.sockets.subscribe("roomChannel", data => {
       this.gameStatus = data.room.gameStatus
      this.setPlayers(data.room,this.uid)
      if(data.room.gameStatus=='grab'){
         this.$socket.emit("getPoke", this.uid)
      }
    })
  
    //监听弹幕频道
    this.sockets.subscribe("chat", data => {
      this.$barrage(data.msg)
    })

    //监听游戏频道
     this.sockets.subscribe("gameChannel", (data) => {
      this.gameStatus = data.room.gameStatus
      this.jetton = data.room.jetton
      this.pokeData = data.poke.sort((a,b)=>b.weight-a.weight)
      this.setPlayers(data.room,this.uid)
    })


    // 监听快速输入
    document.onkeydown = (e) =>{
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if(ctrlKey && keyCode == 13) {
            this.$refs.chatInput.focus()
        }
    }

    // 监听右键出牌
    document.onmousedown = (e)=>{
      if(event.button == 2){
        if(this.gameStatus !=='game') return  // 非出牌阶段 
        if(!this.yourRound) return  // 不是你的回合
        this.onEmit()
        e.preventDefault()
        return false;
      }
    }
  },
  methods: {
    onReady(flag){
      this.$socket.emit("ready",this.uid,flag)
    },
    onPass(){
      this.$socket.emit('gameChannel',this.uid,"pass")
    },
    onEmit(){
      if(!this.checkedList.length) return  //没选牌
      this.$socket.emit('gameChannel',this.uid,this.checkedList)
    },
    onGrab(type){
      this.$socket.emit('gameChannel',this.uid,type)
    },
    onMessage(){
      if(!this.chatMessage.trim()) return
      this.$socket.emit("chat", this.chatMessage,this.uid);
      this.chatMessage = ''
      this.chatDisable = true
      setTimeout(() => {
        this.chatDisable = false
        this.$nextTick(()=>this.$refs.chatInput.focus())
      }, 1000);
    },
    setPlayers(room,uid){
      // 设置当前玩家
      const {currentPlayer,currentIndex} = room
      const player = currentPlayer.filter(u=>{
        return u.uid===this.uid
      })[0]
      this.player = player
      this.pokeViewData = this.player.topPoke
      this.textView = this.player.message
      this.playerIndex = this.player.index
      this.currentIndex = currentIndex
      // 设置上下家
      const nextPlayerIndex = ((this.playerIndex +1) %3 )
      const prevPlayerIndex = ((this.playerIndex +2) %3 )
      let nextSetted = false
      let prevSetted = false
      currentPlayer.forEach(u=>{
        if(u.index == nextPlayerIndex ){
          this.nextPlayer = u
           this.nextPokeData = u.topPoke
           nextSetted = true
        }
        else if(u.index == prevPlayerIndex ){
          this.prevPlayer = u
          this.prevPokeData = u.topPoke
           prevSetted = true
        }  
      })
      if(!nextSetted){    
        this.nextPlayer = {}
        this.nextPokeData = []
      }
      if(!prevSetted){    
        this.prevPlayer = {}
        this.prevPokeData = []
      }
    },
  }
}
</script>
<style lang="scss">
  .room{
     position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      
    .room-main{
      position: absolute;
      top:0;
      right:0;
      left:0;
      bottom:38px;
      margin: auto;
      > div{
        background: rgba(0,0,0,.3);
        border: 1px solid red;
      }
      .main-header{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 70px;
      }
      .self-print-poke{
        position: absolute;
        top: -80px;
        height: 80px;
        min-width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .self-pock-hand{
        position: absolute;
        bottom: 10px;
      }
      .main-self{
        height: 120px;
        padding-bottom: 10px;
        position: absolute;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        align-items: center;
        left: 0;
        right:0;
        bottom:0;
        .self-widget{
          position: absolute;
          top:0;
          left: 0;
          width: 100%;
          height: 10px;
        }
      }
    }
  }
  .chat-container{
    display: flex;
    height: 38px;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0 10px 0 ;
    background: #111;
    .chat-button{
      width:80px;
      margin-left: 10px;
    }
  }
</style>