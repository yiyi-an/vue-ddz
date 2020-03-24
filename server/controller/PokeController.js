const Pock = require('../poker')

const roomToPoke = {}

// 负责组织 发牌,出牌,判断牌型
class PokeController {
  constructor(room){
    const dealedPock = Pock.created()
    this.players = room.currentPlayer.map(item=>JSON.parse(JSON.stringify(item)))
    this.floorPock = dealedPock.dealedList.floorList
    this.dealedObj = dealedPock.dealedList.playerObj
    this.players.forEach( u =>{
      u.pock = this.dealedObj[u.index]
    })
    roomToPoke[room.id] = this
  }
  static dealing(room){
    new PokeController(room)
  }
  static getPokeByRUid(rid,uid){
    const pock =  roomToPoke[rid]
    const user = pock.players.filter( u =>{
      return u.uid === uid
    })
    if(user[0]){
      return user[0].pock
    }else{
      return false
    }
  }
  static getFloorByRid(rid){
    const pock =  roomToPoke[rid]
    return roomToPoke[rid].floorPock
  }
}


module.exports = PokeController