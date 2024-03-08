// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//BuyMeACoffee deployed to  0x152775DCcF8e3a7600c92DB526b76329D933735D

// Uncomment this line to use console.log
contract BuyMeACoffee {
    //Event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo Struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of memo received from friend
    Memo[] memos;

    //Track the address of deployer
    address payable owner;

    //Deploy logic.

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     *  @dev buy a coffee for contract owner
     *  @param _name name of the coffee buyer
     *  @param _message a nice message from the coffee buyer
     */

    //anybody can call this function since it is public
    function buyCoffee(string memory _name, string memory _message) public payable  {
        require(msg.value > 0, "can't buy coffee with 0 eth");
        //add memo to storage Memo[];
        memos.push(
            Memo(
                msg.sender,
                block.timestamp,
                _name,
                _message
            )
        );

        // Emit a log even when a new memo is pushed ir created

        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

     /**
     *  @dev send the entire balanced stored in this contract to the owner
     */

    function withdrawTips() public {
        // get the address of this contract and access the balance
        // address(this).balance;

        require(
            owner.send( address(this).balance)
        );

    }

    /**
     *  @dev returns all the received and stored blockchain memos
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;

    }
}
