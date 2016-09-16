Emulator for SWIFT payments. 

# Changes to core.yaml 

    security.enabled = true

# Changes to membersrvc.yaml 

    aca.enabled = true

Add 6 more users

    swift: 1 soiew0923408r9w0er bank_a  


And add correct atributes to the aca.attributes section

    attribute-role-swift: swift;bank_a;role;swiftagent;2015-07-13T00:00:00-03:00;;

# Web Application
Demo is served by an Angular single page web application. Please install and run in `web` directory.

## Install
```
npm install
bower install
```
Will download developer dependencies which may take a little while.

# Login to the network
    peer network login swift -p soiew0923408

# Deployment  

    curl -XPOST -d  '{"jsonrpc": "2.0", "method": "deploy",  "params": {"type": 1,"chaincodeID": {"path": "github.com/Altoros/swift-emulator/chaincode","language": "GOLANG"}, "ctorMsg": { "args": ["init"] },"secureContext": "swift", "attributes": ["role"]},"id": 0}' http://localhost:7050/chaincode

# Start porject in local environment
  
    gulp serve


