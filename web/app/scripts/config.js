angular.module('config', [])
.constant('cfg',
    {
  endpoint: 'http://localhost:7050/chaincode',
  secureContext: 'auditor0',
  chaincodeID: "823c5031c771067239dcedffed1f63c25800e13c61b242c573b2d77ac2efa73ab2cfc4a85d5d989c4290c0a0b19cdf958e30c8c645763ac057e917b81d15ec88",
  users: [{id: 'issuer0', role: 'issuer', endpoint:'http://localhost:7050/chaincode'},
          {id: 'issuer1', role: 'issuer', endpoint:'http://localhost:7050/chaincode'},
          {id: 'investor0', role: 'investor', endpoint:'http://localhost:7050/chaincode'},
          {id: 'investor1', role: 'investor', endpoint:'http://localhost:7050/chaincode'},
          {id: 'auditor0', role: 'auditor', endpoint:'http://localhost:7050/chaincode'},
          {id: 'offlineServices', role: 'bank', endpoint:'http://localhost:7050/chaincode'}],
  triggers: ['hurricane 2 FL', 'earthquake 5 CA'],
  bonds: [{
            id: 'issuer0.2017.6.13.600',
            issuerId: 'issuer0',
            principal: 500000,
            term: 12,
            maturityDate: '2017.6.13',
            rate: 600,
            trigger: 'hurricane 2 FL',
            state: 'offer'
          }],
  contracts: [{
            id: 'issuer0.2017.6.13.600.0',
            issuerId: 'issuer0',
            bondId: 'issuer0.2017.6.13.600',
            ownerId: 'issuer0',
            couponsPaid: 0,
            state: 'offer'
          },
          {
            id: 'issuer0.2017.6.13.600.1',
            issuerId: 'issuer0',
            bondId: 'issuer0.2017.6.13.600',
            ownerId: 'issuer0',
            couponsPaid: 0,
            state: 'offer'
          },
          {
            id: 'issuer0.2017.6.13.600.2',
            issuerId: 'issuer0',
            bondId: 'issuer0.2017.6.13.600',
            ownerId: 'issuer0',
            couponsPaid: 0,
            state: 'offer'
          },
          {
            id: 'issuer0.2017.6.13.600.3',
            issuerId: 'issuer0',
            bondId: 'issuer0.2017.6.13.600',
            ownerId: 'issuer0',
            couponsPaid: 0,
            state: 'offer'
          },
          {
            id: 'issuer0.2017.6.13.600.4',
            issuerId: 'issuer0',
            bondId: 'issuer0.2017.6.13.600',
            ownerId: 'issuer0',
            couponsPaid: 0,
            state: 'offer'
          }],
    trades: [{
            id: 1000,
            contractId: 'issuer0.2017.6.13.600.0',
            sellerId: 'issuer0',
            price: 100,
            state: 'offer'
          },
          {
            id: 1001,
            contractId: 'issuer0.2017.6.13.600.1',
            sellerId: 'issuer0',
            price: 100,
            state: 'offer'
          },
          {
            id: 1002,
            contractId: 'issuer0.2017.6.13.600.2',
            sellerId: 'issuer0',
            price: 100,
            state: 'offer'
          },
          {
            id: 1003,
            contractId: 'issuer0.2017.6.13.600.3',
            sellerId: 'issuer0',
            price: 100,
            state: 'offer'
          },
          {
            id: 1004,
            contractId: 'issuer0.2017.6.13.600.4',
            sellerId: 'issuer0',
            price: 100,
            state: 'offer'
          }]
    }
);
