pragma solidity ^0.8.7;

contract Events {
    address public minter;
    uint256 public fee = 3;
    mapping (bytes32 => address) public events;
    mapping (bytes32 => uint256) public eventPrices;
    mapping (bytes32 => uint256) public eventTimes;
    mapping (bytes32 => uint256) public firstHandTickets;
    mapping (address => uint256) public balances;
    mapping (address => mapping (bytes32 => bool)) public ticketHolders;
    mapping (bytes32 => mapping (address => uint256)) public market;

    // Modifiers & events
    event eventHash(address indexed _sender, bytes32 indexed _event);

    modifier onlyMinter() {
        require(msg.sender == minter, "Only minter can call this function.");
        _;
    }

    modifier userExists(address user) {
        require(user != address(0), "No such user!");
        _;
    }

    modifier eventExists(bytes32 ticket) {
        require(events[ticket] != address(0), "There is no such event!");
        _;
    }

    modifier firstTimePurchase(bytes32 ticket, address buyer) {
        require(ticketHolders[buyer][ticket] == false, "You already own a ticket to this event!");
        _;
    }

    modifier validSeller(bytes32 ticket, address seller) {
        require(ticketHolders[seller][ticket] == true, "The seller doesn't own a ticket to this event!");
        _;
    }

    modifier validOwner(bytes32 ticket, address seller) {
        require(events[ticket] == seller, "The seller did not create this event!");
        _;
    }

    constructor() {
        minter = msg.sender;

    }

    // User creates an event;
    function createEvent(uint256 price, uint256 duration, uint256 amount) 
    external {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        events[hash] = msg.sender; 
        eventPrices[hash] = price;
        eventTimes[hash] = duration;
        firstHandTickets[hash] = amount;
        emit eventHash(msg.sender, hash);
    }

    // Allows user to buy ticket directly from the event organiser
    function buyTicket(bytes32 ticket, address seller) 
    userExists(seller) 
    eventExists(ticket) 
    firstTimePurchase(ticket, msg.sender)
    validOwner(ticket, seller)
    external 
    payable {
        require(msg.value >= eventPrices[ticket],"insufficient funds!");
        require(firstHandTickets[ticket] > 0, "Tickets for the event are sold out!, check the market for second hand tickets!");
        
        uint256 deposit = msg.value * (100 - fee) / 100;
        balances[events[ticket]] += deposit;
        balances[minter] += msg.value - deposit;
        ticketHolders[msg.sender][ticket] = true;
        firstHandTickets[ticket] -= 1;
    }

    // Allow users to buy tickets from market
    function buyMarket(bytes32 ticket, address seller) 
    userExists(seller) 
    eventExists(ticket) 
    firstTimePurchase(ticket, msg.sender)
    validSeller(ticket, seller) 
    external 
    payable {
        require(msg.value >= market[ticket][seller], "Insufficient funds!");
        uint256 deposit = msg.value * (100 - fee) / 100;
        balances[seller] += deposit;
        balances[events[ticket]] += msg.value - deposit;
        ticketHolders[msg.sender][ticket] = true; 
        delete ticketHolders[seller][ticket];
    }

    // Allow users to sell tickets on market
    function sellMarket(bytes32 ticket, uint256 price) 
    eventExists(ticket)
    validSeller(ticket, msg.sender) 
    external{
        require(price > 0, "Invalid price!");
        market[ticket][msg.sender] = price;
    }

    // Allow owner to adjust ticket price and duration
    function adjustEvent(bytes32 ticket, uint256 price, uint256 time) external {
        require(events[ticket] == msg.sender, "You do not have permission to do this request!");
        if (price > 0) {
            eventPrices[ticket] = price;
        }

        if (time > 0) {
            eventTimes[ticket] = time;
        }
    }

    // Allow owner to remove event
    function clearEvent(bytes32 ticket) external {
        require(events[ticket] == msg.sender, "You do not have permission to do this request!");
        delete events[ticket];
        delete eventPrices[ticket];
        delete eventTimes[ticket];
        delete firstHandTickets[ticket];
    }

    // Withdraw function
    function withdraw() external payable {
        require(balances[msg.sender] > 0);
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Adjust Revenue fee for company.
    function adjustFee(uint256 _value) onlyMinter external { 
        fee = _value;
    }

}