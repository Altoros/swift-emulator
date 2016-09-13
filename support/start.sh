#!/usr/bin/env bash


#add to Vagrant file:
# config.vm.synced_folder "/usr/local/Cellar/go/1.6/src/github.com/Altoros", "/opt/gopath/src/github.com/Altoros"

cd $GOPATH/src/github.com/hyperledger/fabric/devenv/
vagrant ssh -c /opt/gopath/src/github.com/Altoros/swift-emulator/support/deploy_chaincode.sh

if [[ $? != 0 ]];
then
    echo "Error in Chaincode deployment"
    exit 1;
fi


cd $GOPATH/src/github.com/Altoros/swift-emulator/web
ps -ef | grep gulp | grep -v grep | awk '{print $2}' | xargs kill &> /tmp/kill
gulp serve  &> /tmp/gulp.log &

echo "Server started. Ready."

sleep 10

cd $GOPATH/src/github.com/hyperledger/fabric/devenv/
vagrant ssh -c 'docker ps -l -q | xargs docker attach'
