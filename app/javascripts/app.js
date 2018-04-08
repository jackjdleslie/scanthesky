// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import sweetalert2
import swal from 'sweetalert2'

// Import our contract artifacts and turn them into usable abstractions.
import artifacts from '../../build/contracts/ScanTheSky.json'

// ScanTheSky is our usable abstraction, which we'll use through the code below.
var ScanTheSky = contract(artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the ScanTheSky abstraction for Use.
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

  },

  generateId: function() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
  },

  showSuccess: function(message) {
    swal({
      title: 'Booking Confirmed',
      text: message,
      type: 'success',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  },

  showError: function(message) {
    swal(
      'Error',
      message,
      'error'
    )
  },

  create: function(booking_id, user_id, airport_from, airport_to) {
    var self = this;

    ScanTheSky.deployed().then(instance => {
      return instance.createBooking(booking_id, {from: account});
    }).then(() => {
      $('.loading').css('display', 'block');
      var url = "/airline.html?booking_id=" + booking_id + "&user_id=" + user_id + "&airline_id=ryanair";
      url += "&airport_from=" + airport_from + "&airport_to=" + airport_to;
      setTimeout(() => { window.location = url; }, 3000);
    }).catch(e => {
      console.log(e);
      App.showError("Booking id has already been used");
    });
  },

  confirm: function(booking_id, user_id, airline_id, airport_from, airport_to) {
    var self = this;

    ScanTheSky.deployed().then(instance => {
      return instance.confirmBooking(booking_id, user_id, airline_id, airport_from, airport_to, {from: account});
  }).then(() => {
      App.showSuccess("You're going to Budapest!");
  }).catch(e => {
      console.log(e);
      App.showError(e.message);
  });
  }
};

window.addEventListener('load', function() {
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  App.start();
});
