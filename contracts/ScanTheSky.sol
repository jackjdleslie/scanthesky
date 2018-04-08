pragma solidity 0.4.21;


contract ScanTheSky {

    enum BookingState {EMPTY, UNCONFIRMED, CONFIRMED}
    mapping (string => mapping (string => uint)) private timesBooked;
    mapping (string => BookingState) private hasBooked;
    string public name;

    event LogTimesBooked(string _user, string _airline, uint _count);
    event LogUnconfirmedBooking(string _booking);
    event LogHasBooked(string _booking);

    function ScanTheSky() public {
        name = "Scan The Sky";
    }

    function createBooking(string _booking) public {
        require(hasBooked[_booking] == BookingState.EMPTY);
        hasBooked[_booking] = BookingState.UNCONFIRMED;
        emit LogUnconfirmedBooking(_booking);
    }

    function confirmBooking(string _booking, string _user, string _airline) public {
        require(hasBooked[_booking] == BookingState.UNCONFIRMED);
        hasBooked[_booking] = BookingState.CONFIRMED;
        emit LogHasBooked(_booking);
        if (bytes(_user).length != 0) {
            timesBooked[_user][_airline] += 1;
            emit LogTimesBooked(_user, _airline, timesBooked[_user][_airline]);
        }
    }
}
