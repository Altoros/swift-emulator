Emulator for SWIFT payments. 

# Changes to core.yaml 

    security.enabled = true

# Changes to membersrvc.yaml 

    aca.enabled = true

Add 7 more users

                  auditor0:  1 yg5DVhm0er1z bank_a
                  investor1: 1 b7pmSxzKNFiw bank_a 
                  investor0: 1 YsWZD4qQmYxo bank_a 
                  issuer1:   1 W8G0usrU7jRk bank_a       
                  issuer0:   1 H80SiB5ODKKQ bank_a
                  swift:     1 soiew0923408 bank_a
                  system:    1 sSfjw392fe24 bank_a


And add correct atributes to the aca.attributes section

                  #Bond role
                  attribute-role-12: auditor0;bank_a;role;auditor;2015-07-13T00:00:00-03:00;;
                  attribute-role-13: investor1;bank_a;role;investor;2001-02-02T00:00:00-03:00;;
                  attribute-role-14: investor0;bank_a;role;investor;2001-02-02T00:00:00-03:00;;
                  attribute-role-15: issuer1;bank_a;role;issuer;2015-01-01T00:00:00-03:00;;
                  attribute-role-16: issuer0;bank_a;role;issuer;2015-01-01T00:00:00-03:00;;
                  attribute-role-swift: swift;bank_a;role;swiftagent;2015-07-13T00:00:00-03:00;;
                  attribute-role-system: system;bank_a;role;system;2015-07-13T00:00:00-03:00;;
    
                  #Bond usernames
                  attribute-name-12: auditor0;bank_a;name;auditor0;2015-07-13T00:00:00-03:00;;
                  attribute-name-13: investor1;bank_a;name;investor1;2001-02-02T00:00:00-03:00;;
                  attribute-name-14: investor0;bank_a;name;investor0;2001-02-02T00:00:00-03:00;;
                  attribute-name-15: issuer1;bank_a;name;issuer1;2015-01-01T00:00:00-03:00;;
                  attribute-name-16: issuer0;bank_a;name;issuer0;2015-01-01T00:00:00-03:00;;

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

    curl -XPOST -d  '{"jsonrpc": "2.0", "method": "deploy",  "params": {"type": 1,"chaincodeID": {"path": "github.com/Altoros/swift-emulator/chaincode","language": "GOLANG"}, "ctorMsg": { "args": ["init", "aa"] },"secureContext": "swift", "attributes": ["role"]},"id": 0}' http://localhost:7050/chaincode

# Start porject in local environment
  
    gulp serve


