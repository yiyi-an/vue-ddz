var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var RoomsController = require('./controller/RoomsController.js')
var PockController = require('./controller/PokeController.js')

io.on('connection', function(socket){
  console.log(`新建立连接:${socket.id}`);

  // 登录
  socket.on('login',(uid)=>{
    socket.emit('login', {
      uid:uid !== null ? uid:createClientId(),
      msg: `登录成功`,
      code: 200
    });  
    console.log(`用户登录:${socket.id}`);
    socket.emit('roomList',{ list:RoomsController.getRooms(),code:200 } )
  })


  // 房间列表
  socket.on('roomList', ()=>{
    socket.emit('roomList', JSON.stringify(roomArray));
  })

  // 创建房间
  socket.on('createRoom',(uid)=>{
    // todo 判断user是否已经有房间
    const room = RoomsController.createRoom()
    RoomsController.joinRoom(uid,room,socket)
    io.to(room.id).emit('roomChannel',{ room ,code:200})
    socket.emit('chat',{msg:'聊天弹幕链接成功'})
    io.sockets.emit('roomList',{ list:RoomsController.getRooms(),code:200 } )
    console.log(`${uid}创建了房间`)
  })
  // 加入房间
  socket.on('joinRoom',(uid,rid)=>{
    const room = RoomsController.getRoomByRid(rid)
    RoomsController.joinRoom(uid,room,socket)
    io.to(room.id).emit('roomChannel',{ room ,code:200})
    io.to(room.chatId).emit('chat',{msg:'聊天弹幕链接成功'})
    io.sockets.emit('roomList',{ list:RoomsController.getRooms(),code:200 } )
    console.log(`${uid}加入了房间${rid}`)
  })

  // 房内聊天
  socket.on('chat',(message,uid)=>{
    const room =  RoomsController.getRoomByUser(uid)
    io.to(room.chatId).emit('chat',{msg:message})
  })
  
  // 获取房间信息
  socket.on('roomChannel',uid=>{
    const room =  RoomsController.getRoomByUser(uid)
    io.to(room.id).emit('roomChannel',{ room ,code:200})
  })

 
  //玩家准备
  socket.on('ready' , (uid,flag)=>{
    const room =  RoomsController.getRoomByUser(uid)
    const isGame = room.userReady(uid,flag)
    console.log(`${uid}玩家已${flag?'准备':'取消准备'}`)
    if(isGame) console.log('玩家都准备,游戏开始')
    io.to(room.id).emit('roomChannel',{ room ,code:200})
  })

  // 玩家获取手牌
  socket.on('getPoke',(uid,rid)=>{
    // 房间发牌
    const room =  RoomsController.getRoomByUser(uid)
    const poke = PockController.getPokeByRUid(rid,uid)
    socket.emit('gameChannel',{ data:{room,poke},code:200 })

  })

  //玩家掉线
  socket.on('disconnect',()=>{
    console.log(`${socket.id}断开了链接`)
  })
})




http.listen(8082, function(){
	console.log('服务启动,端口号:8082');
});



const createClientId = ()=>{
  const attr = 'abcdefghijklmnopqrstuvwxyz'
  return attr[Math.floor(Math.random() * attr.length )]+ Number(new Date())
}