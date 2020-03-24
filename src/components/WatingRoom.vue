<template>
<div class="room page-container">
  <div class="room-main app-bg">

    <!-- <div class="room-status">
       <div class="clearfix player-self player-block">
         <span class="player-name">{{player.name}}</span>
         <span class="player-status" v-if="player.isReady">已准备</span>
         <span class="player-status" v-else>未准备</span>
       </div>
       <div class="clearfix player-block">
         <div v-if="prevPlayer.name">
           <span class="player-name">{{prevPlayer.name}}</span>
            <span class="player-status" v-if="prevPlayer.isReady">已准备</span>
            <span class="player-status" v-else>未准备</span>
         </div>
         <div v-else>空闲</div>
       </div>
       <div class="clearfix player-block">
         <div v-if="nextPlayer.name">
           <span class="player-name">{{nextPlayer.name}}</span>
            <span class="player-status" v-if="nextPlayer.isReady">已准备</span>
            <span class="player-status" v-else>未准备</span>
         </div>
         <div v-else>空闲</div>
       </div>
    </div> -->

      <div class="main-header"></div>
      <analogue-view design="prev" :playerData="prevPlayer"/>
      <analogue-view design="next" :playerData="nextPlayer"/>
      <div class="main-self">
         <div class="self-print-poke">
          <poke-view :pokeData="pokeViewData" />
        </div>
        <div class="self-widget">
          <div  style="text-align:center" v-if="!gameStart" >
            <el-button type="success" style="width:72px"  v-if="!isReady" @click="onReady(true)">准 备</el-button>
            <el-button type="warning" style="width:72px"  v-else @click="onReady(false)">取消准备</el-button>
          </div>
          <div v-if="gameStart && (currentIndex === playerIndex)">
              <el-button type="success" style="width:72px"  @click="onPass">过了</el-button>
              <!-- <time-widget> -->
              <el-button type="success" style="width:72px"  @click="onEmit">出牌</el-button>
          </div>
        </div>
        <div v-if="gameStart" class="self-pock-hand">
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
      gameStart:false,
      chatDisable:false,
      checkedList:[],
      pokeData:[],
      pokeViewData:[],
      chatMessage:'',
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

  },
  created() {},
  mounted() {
    this.uid = localStorage.getItem("ddz_uid");
    // 加入房间
    this.$socket.emit("roomChannel", this.uid);

    //监听房间频道
    this.sockets.subscribe("roomChannel", data => {
      const {room} = data
      this.setPlayers(room,this.uid)
      if(room.begin){
         this.$socket.emit("getPoke", this.uid,this.rid)
      }
    })

    //监听弹幕频道
    this.sockets.subscribe("chat", data => {
       this.$barrage(data.msg)
    })

    //监听出牌频道
     this.sockets.subscribe("gameChannel", ({data}) => {
       this.gameStart = true
        this.pokeData = data.poke.sort((a,b)=>b.weight-a.weight)
        window.pokeDataList = this.pokeData
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
      player.name="你"
      this.rid = room.id
      this.player = player
      this.playerIndex = this.player.index
      this.currentIndex = currentIndex
      // 设置上下家
      const nextPlayerIndex = ((this.playerIndex +1) %3 )
      const prevPlayerIndex = ((this.playerIndex +2) %3 )
      currentPlayer.forEach(u=>{
        if(u.index == nextPlayerIndex ){
          u.name="下家"
          this.nextPlayer = u
        }
        else if(u.index == prevPlayerIndex ){
          u.name="上家"
          this.prevPlayer = u 
        }  
      })
    },
    onPass(){},
    onEmit(){
      this.$socket.emit('gameChannel',this.checkedList)
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
      }
      .main-header{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 150px;
      }
      .self-print-poke{
        height: 80px;
        min-width: 30px;
      }
      .main-self{
        height: 300px;
        padding-bottom: 20px;
        position: absolute;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        align-items: center;
        left: 0;
        right:0;
        bottom:0;
        .self-widget{
          margin:10px auto;
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