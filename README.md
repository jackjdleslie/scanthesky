# scanthesky (STACSHack 2018)
Ðapp to facilitate confirmation of bookings redirected from Skyscanner to airline websites

## Getting Started

You'll need all the files from the repo to run both a webpack dev server and a separate node app

### Requirements

* Truffle
* Node / NPM

### Migrate contracts

This project assumes truffle develop is used, so to migrate accordingly:

```
truffle develop
```

then

```
migrate
```

### Starting the front-end

To run and serve the front-end on [http://localhost:8080](http://localhost:8080):

```
npm run dev
```

(note: if you want to simulate being logged in, add a query parameter user_id with the id you want to use - for example [http://localhost:8080?user_id=testuser](http://localhost:8080?user_id=testuser))

### Watching for smart contract events

To obtain the data from the emitted smart contract events:

```
node watch.js
```

## What is it?

The front-end is a simulation of the [Skyscanner](http://www.skyscanner.net/) website redirecting to an external airline 
provider's website (in this case [Ryanair](https://www.ryanair.com/)). As the user, you have just chosen a flight
deal on Skyscanner's website, and are ready to be redirected to the Ryanair website to book the deal.

From Skyscanner's perspective, when you redirect they theb don't know whether or not the flight ever gets booked - just
that the user was redirected.

## How does this fix the problem?

This simulation shows this described situation, except when the user is redirected the booking number and the user id are
send to a smart contract to create an unconfirmed booking.

When the user then confirms the booking on Ryanair's end, the booking number, the user id and the airline id (which have
been passed via query parameters) are sent to the same smart contract to check if there is an unconfirmed booking with
this number, and if there is to mark it as confirmed.

This solves two problems:
1. Skyscanner can now look at the emitted events from the contract, and see when a booking has been confirmed
2. Ryanair can look at the emitted events as well, and see if a certain user has booked with them through Skyscanner
before, and if so then how many times

## Does this need Ethereum?

It's not the only solution to the problem, however using a smart contract means that:
1. Neither party has to worry about creating an endpoint to query about this data, or worry about storing this data - this 
is processed and then emitted by the smart contract, which doesn't need to be stored by either party
2. It provides a way to benefit both parties - while at first it would only initially benefit Skyscanner (with seeing
confirmed bookings), it also benefits the external airline as they also get access to the smart contract data (as described 
previously)

In addition to this, the project was created at a [hackathon](http://www.stacshack.site/) by people who wanted to learn 
more about smart contract development, as well as tackle a real problem that Skyscanner have.
