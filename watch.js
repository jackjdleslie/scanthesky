// Import libraries we need.
var Web3 = require('web3');
let web3;
var contract = require('truffle-contract');

// Import our contract artifacts and turn them into usable abstractions.
var artifacts = require('../scanthesky/build/contracts/ScanTheSky.json');

// ScanTheSky is our usable abstraction, which we'll use through the code below.
var ScanTheSky = contract(artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
ScanTheSky.setProvider(web3.currentProvider);

ScanTheSky.deployed().then(instance => {

  var confirmed = [];

  let hasBookedEvent = instance.LogHasBooked({}, {fromBlock: 0, toBlock: 'latest'});
  hasBookedEvent.get((error, logs) => {
    // we have the logs, now print them
    console.log();
    logs.forEach(log => {
      console.log("Data for Skyscanner: ");
      console.log("  Booking " + log.args._booking + " has been confirmed");
      confirmed.push(log.args._booking);
    });
  });

  let unconfirmedBookingEvent = instance.LogUnconfirmedBooking({}, {fromBlock: 0, toBlock: 'latest'});
  unconfirmedBookingEvent.get((error, logs) => {
    // we have the logs, now print them
    console.log();
    logs.forEach(log => {
      if (!confirmed.includes(log.args._booking)) {
        console.log("Data for Skyscanner: ");
        console.log("  Booking " + log.args._booking + " has been submitted but not confirmed");
      }
    });
  });

  let timesBookedEvent = instance.LogTimesBooked({}, {fromBlock: 0, toBlock: 'latest'});
  timesBookedEvent.get((error, logs) => {
    var prev = logs[0];
    var prevIndex = 0;

    for (var i = 1; i < logs.length; i++) {
      if (logs[i].args._count > prev.args._count) {
        logs.splice(prevIndex, 1);
      }
      prev = logs[i];
      prevIndex = i;
    }
    console.log();
    logs.forEach(log => {
      console.log("Data for Airline: " + log.args._airline);
      console.log("  Skyscanner user " + log.args._user + " has booked with you " + log.args._count + " time(s)");
    });
    console.log();
  });
});
