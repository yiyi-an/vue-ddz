var PokeController = require('./controller/PokeController.js')

module.exports = class Room {
  constructor(
    id,
    socket,
    ){
    this.currentIndex = 0
    this.currentPlayerNum = 0
    this.currentPlayer= []
    this.id = id
    this.chatId =`chat_${id}` 
    this.empty=['0','1','2']
    this.begin = false
    // this.setSocket(socket)
   
  }
  joinUser(uid,sid){
    this.currentPlayer.push({
      uid,
      sid,
      isReady:false,
      index:this.empty.splice(0,1)[0]
    }) 
    this.currentPlayerNum++
  }
  userReady(uid,flag){
    const statusArr = this.currentPlayer.map(u=>{
      if(u.uid === uid) {
        u.isReady = flag
        return 1
      }else{
        return 0
      }
    })
    // 如果准备玩家数量 === 3 并且都准备游戏开始 就发牌
    if(statusArr.length ===1 ){
      if(statusArr.sort()[0] !== 0 ){
        this.begin = true
        PokeController.dealing(this)
        return true
      }
    }
  }
  //socket 开设房间
  // setSocket(socket){
  //   if(socket){
  //     this.socket = socket 
  //     this.socket.join(this.id)
  //   }
   
  // }
}