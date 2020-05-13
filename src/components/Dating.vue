<template>
  <div class="dating page-container">

    <div class="dating-main app-bg">
      <div class="dating-user">
        <span v-if="uid">你好, {{uid}}</span>
        <span v-else>未登录</span>
      </div>
      <div class="dating-middle">
        <div class="dating-left dating-block">
          <div class="dating-title">历史战绩</div>
        </div>
        <div>
          <el-button
            type="primary"
            style="width:180px;margin-top:80px"
            @click="createRoom"
          >创建房间</el-button>
        </div>
        <div class="dating-left  dating-block">
          <div class="dating-title">房间列表</div>
          <div class="dating-rooms">
            <div
              v-for="r in roomList"
              :key="r.id"
              class="room-block"
              @click="joinRoom(r)"
            >
              <span>房间号:{{r.id}}</span>
              <span style="float:right">在线人数:{{r.playerNum}}/3</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dating",
  data() {
    return {
      roomList: [],
      uid: ""
    };
  },
  methods: {
    login() {
      // debugger
      const uid = sessionStorage.getItem("ddz_uid");
      this.$socket.emit("login", uid);
      this.sockets.subscribe("login", data => {
        sessionStorage.setItem("ddz_uid", data.uid);
        this.uid = data.uid;
      });

      this.sockets.subscribe('roomList',data=>{
        this.roomList= data.list
      })
    },
    createRoom(){
      this.$socket.emit("createRoom", this.uid);
      this.sockets.subscribe("roomChannel", data => {
        if(data.code === 200){
          this.$store.dispatch('toggleView','GameRoom')
        }
      });
    },
    joinRoom(room){
      if(room.currentPlayer.length >= 3) return this.$message.info('房间人数已满')
      this.$socket.emit("joinRoom", this.uid,room.id);
      this.sockets.subscribe("roomChannel", data => {
        if(data.code === 200){
          this.$store.dispatch('toggleView','GameRoom')
        }
      });

    }
  },
  mounted() {
    setTimeout(() => {
      this.login();
    }, 1000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.dating {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .dating-main {
    padding: 10px;
    
    height: 100%;
    
    margin: auto;
    .dating-user {
      margin: 12px 0 ;
      font-size: 20px;
      line-height: 20px;
      color: red;
    }
    .dating-middle {
      height:calc(100vh - 64px) !important;
      max-height: 536px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .dating-block {
      border: 3px solid #eee;
      border-radius: 10px;
      width: 360px;
      overflow: hidden;
    }
    .dating-title {
      color: #eee;
      line-height: 38px;
      font-size: 20px;
      padding: 0 5px;
      border-bottom: 3px solid;
    }
    .dating-rooms {
      width: 360px;
      height: 88%;
      margin-top: 8px;
      padding: 0px 10px 8px 8px;
      overflow-y: scroll;
      box-sizing: content-box;
      .room-block {
        height: 28px;
        line-height: 28px;
        background: #efefef;
        border-radius: 5px;
        margin-bottom: 10px;
        font-size: 12px;
        margin: 0 12px 8px 4px;
        padding: 0 10px;
      }
    }
  }
}
</style>
