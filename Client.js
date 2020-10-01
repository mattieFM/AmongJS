// creating a custom socket client and connecting it....
module.exports = function ClientConnect(player) {
var net = require('net');
const prompt = require('prompt-sync')();
var client  = new net.Socket();
const IpAdress = prompt('What Ipv4 address do you want to connect to? (\"localhost\" if you are on a lan server): ');
const port = prompt('What port do you want to connect to? ');
client.connect({
  port:port,
  host:IpAdress
});

client.on('connect',function(){
  console.log('Client: connection established with server');

  console.log('---------client details -----------------');
  var address = client.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  // writing data to server
  client.write('newPlayer: ' + JSON.stringify(player));
});

client.setEncoding('utf8');

// client.on('data',function(data){
//   //console.log('Data from server:' + data);
// });

setTimeout(function(){
  client.end('Bye bye server');
},5000);

}
