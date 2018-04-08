pragma solidity 0.4.21;


contract ScanTheSky {

    mapping (string => mapping (string => uint)) private timesBooked;
    mapping (string => uint) private hasBooked;
    string public name;

    event LogTimesBooked(string _user, string _airline, uint _count);
    event LogUnconfirmedBooking(string _booking);
    event LogHasBooked(string _booking);

    function ScanTheSky() public {
        name = "Scan The Sky";
    }

    function createBooking(string _booking) public {
        require(hasBooked[_booking] == 0);
        hasBooked[_booking] = 1;
        emit LogUnconfirmedBooking(_booking);
    }

    function confirmBooking(string _booking, string _user, string _airline) public {
        require(hasBooked[_booking] == 1);
        hasBooked[_booking] = 2;
        emit LogHasBooked(_booking);
        if (bytes(_user).length != 0) {
            timesBooked[_user][_airline] += 1;
            emit LogTimesBooked(_user, _airline, timesBooked[_user][_airline]);
        }
    }
}
