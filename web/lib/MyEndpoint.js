
var grpc = require('grpc');

// grpc.load(__dirname + '../proto/fabric.proto');
// grpc.load(__dirname + '../proto/chaincodeevent.proto');
// grpc.load(__dirname + '../proto/chaincode.proto');
var protos = grpc.load(__dirname + '/../protobuf/events.proto').protos;

var Events    = protos.Events;
var Interest  = protos.Interest;
var Register  = protos.Register;
var Event     = protos.Event;
var EventType = protos.EventType;


/**
 *
 */
function MyEndpoint(endpoint/*, credentials */){
  var self = this;

  var _ep = endpoint;
  var _credentials = grpc.credentials.createInsecure();

  self.createChatStream = createChatStream;


  /**
   *
   */
  function createChatStream(){
    var interest = new Interest().setEventType(EventType.BLOCK);
    var register = new Register();
    register.events.push(interest);

    var event = new Event();
    event.setRegister(register);
    event.Event = undefined;

    //
    // var eventsService = new Events("54.198.39.96:7053", grpc.credentials.createInsecure());
    var eventsService = new Events(_ep, _credentials);

    var stream = eventsService.chat();
    // console.log('eventsService: ', /*stream,*/ stream.constructor.name);

    stream.on('data', message=>{
      if(message.block){
        console.log('block:', message.block.stateHash.toString('base64')/*.substr(16)+'...'*/ );
      } else if(message.Event){
        console.log('event:', message.Event);
      } else {
        console.log('data:', message);
      }
    });
    // stream.on('error', err=>{
    //   console.log('error:', err);
    //   throw err;
    // });
    stream.on('end', message=>{
      console.log('protobuf: stream end:', message);
    });
    stream.on('error', message=>{
      console.log('protobuf: stream error:', message);
    });

    stream.write(event);

    return stream;
  }


}//


module.exports = MyEndpoint;
