Emulator for SWIFT payments. 


# Deployment  

    curl -XPOST -d  '{"jsonrpc": "2.0", "method": "deploy",  "params": {"type": 1,"chaincodeID": {"path": "github.com/olegabu/Altoros/swift-emulator/chaincode","language": "GOLANG"}, "ctorMsg": { "args": ["aW5pdA=="] },"secureContext": "issuer0", "attributes": ["role"]},"id": 0}' http://vp2:7050/chaincode

# Start porject in local environment
  
    node index

## Specify custom port and run
  
    GULP_PORT=8080 node index
