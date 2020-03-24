const Room = require('../room')

const roomNumberList =[]
const playerRoom = {}
const userToRoom = {}


module.exports =  class RoomsController {
  // 创建房间
  static createRoom(socket){
    const rid = `${+new Date()}`
    roomNumberList.push(rid)
    const room  = new Room(rid,socket)
    playerRoom[rid]=room
    return room
  }
  // 加入房间
  static joinRoom(uid,room,socket){
    userToRoom[uid]=room.id
    room.joinUser(uid,socket.id)
    socket.join(room.id)
    socket.join(room.chatId)
  }

  // 获取某个房间
  static getRoomByUser(uid){
    const rid = userToRoom[uid]
    return playerRoom[rid]
  }
  // 获取所有房间
  static getRooms(){
    return Object.entries(playerRoom).map(arr=>arr[1])
  }
  static getRoomByRid(rid){
    return playerRoom[rid]
  }
}