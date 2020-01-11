var net = require('net');
var mongoose=require('mongoose');
var JsonSocket=require('json-socket');
var dotenv=require('dotenv');
dotenv.config();
const Post=require('./models/Post');

//Connect to database

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser:true },
    ()=>{
        console.log("CONNECTED DB");
    });
    

//Server side
 
var HOST = 'localhost';
var PORT = 8080;

var server = net.createServer();  
 
server.listen(PORT, HOST, function() {  
  console.log('server listening on %j', server.address());
});
 
server.on('connection', function(socket) { 
    socket = new JsonSocket(socket); 
    socket.on('message', async function(message) {
        const myPost = new Post({
            key: message.guid,
            value:message.datetime
        });
        try{
            await myPost.save();
            const resMessage={
                    'status': 'ok',
                    'error': null,
                    'myTime': myPost.value
            }
            socket.sendEndMessage(resMessage);

        } catch(err) {
            socket.sendEndMessage(err);
        }
        });
    });


//Client side

var host = '127.0.0.1';
var socket = new JsonSocket(new net.Socket());

socket.connect(PORT, host);
socket.on('connect', function() { 
    setInterval(async()=> {
        try{
            var dat=({
                'guid': '63d8da488ec84394aa2be5d81132ddc6',
                'datetime': Date.now()
            });
            await socket.sendMessage(dat);
        } catch(err){
            socket.sendMessage(dat);
        }
    },5000);
});
socket.on('message', async (resMessage)=> {
    try{
        const messageBack= await resMessage;
        console.log(messageBack);
    } catch(err){
        console.log(err);
    }
});

