// Import libraries we need.
var Web3 = require('web3');
var contract = require('truffle-contract');

// Import our contract artifacts and turn them into usable abstractions.
var artifacts = require('../scanthesky/build/contracts/ScanTheSky.json');

// ScanTheSky is our usable abstraction, which we'll use through the code below.
var ScanTheSky = contract(artifacts);

// app.js assumed truffle develop is the provider
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
ScanTheSky.setProvider(web3.currentProvider);

ScanTheSky.deployed().then(instance => {

  var confirmed = [];

  // get data from hasBooked events
  let hasBookedEvent = instance.LogHasBooked({}, {fromBlock: 0, toBlock: 'latest'});

  hasBookedEvent.get((error, logs) => {
    console.log();
    logs.forEach(log => {
      console.log("Data for Skyscanner: ");
      console.log("  Booking " + log.args._booking + " has been confirmed");
      confirmed.push(log.args._booking);
    });
  });

  // get data from unconfirmedBooking events
  let unconfirmedBookingEvent = instance.LogUnconfirmedBooking({}, {fromBlock: 0, toBlock: 'latest'});

  unconfirmedBookingEvent.get((error, logs) => {
    console.log();
    logs.forEach(log => {
      if (!confirmed.includes(log.args._booking)) {
        console.log("Data for Skyscanner: ");
        console.log("  Booking " + log.args._booking + " has been submitted but not confirmed");
      }
    });
  });

  // get data from timesBooked events
  let timesBookedEvent = instance.LogTimesBooked({}, {fromBlock: 0, toBlock: 'latest'});

  timesBookedEvent.get((error, logs) => {
    var prev = logs[0];
    var prevIndex = 0;

    // filter logs to only use when user book count is highest
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
