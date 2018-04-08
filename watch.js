// Import libraries we need.
var Web3 = require('web3');
let web3;
var contract = require('truffle-contract');

// Import our contract artifacts and turn them into usable abstractions.
var artifacts = require('./build/contracts/ScanTheSky.json');

// ScanTheSky is our usable abstraction, which we'll use through the code below.
var ScanTheSky = contract(artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
ScanTheSky.setProvider(web3.currentProvider);

web3.eth.getAccounts(function(err, accs) {
  if (err != null) {
    alert("There was an error fetching your accounts.");
    return;
  }

  if (accs.length == 0) {
    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
    return;
  }

  accounts = accs;
  account = accounts[0];
});

ScanTheSky.deployed().then(instance => {
  let hasBookedEvent = instance.LogHasBooked({}, {fromBlock: 0, toBlock: 'latest'});
  hasBookedEvent.get((error, logs) => {
    // we have the logs, now print them
    logs.forEach(log => console.log(log.args));
  });

  let timesBookedEvent = instance.LogTimesBooked({}, {fromBlock: 0, toBlock: 'latest'});
  timesBookedEvent.get((error, logs) => {
    // we have the logs, now print them
    logs.forEach(log => console.log(log.args));
  });
});
