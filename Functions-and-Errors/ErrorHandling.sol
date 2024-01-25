// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FundManager
 * @dev A simple smart contract for managing deposits and withdrawals of Ether.
 *      This contract demonstrates the use of Solidity control structures 
 *      like require(), assert(), and revert() for error handling and validations.
 */
contract FundManager {
    // Mapping to keep track of Ether balances of each address.
    mapping(address => uint) public balances;

    // Event declarations for logging activities.

    /**
     * @dev Emitted when a user deposits Ether to the contract.
     * @param user The address of the user who made the deposit.
     * @param amount The amount of Ether deposited.
     */
    event Deposit(address indexed user, uint amount);

    /**
     * @dev Emitted when a user withdraws Ether from the contract.
     * @param user The address of the user who made the withdrawal.
     * @param amount The amount of Ether withdrawn.
     */
    event Withdrawal(address indexed user, uint amount);

    /**
     * @dev Allows users to deposit Ether into the contract.
     *      A minimum deposit amount is required.
     */
    function deposit() public payable {
        // Check that the sent Ether is above a minimum threshold.
        require(msg.value > 0.01 ether, "Minimum deposit is 0.01 ETH");

        // Update the sender's balance and emit the Deposit event.
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Allows users to withdraw Ether from their balance in the contract.
     * @param _amount The amount of Ether to withdraw.
     */
    function withdraw(uint _amount) public {
        // Check that the sender has enough balance to withdraw.
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Attempt to send Ether and ensure the transaction succeeds.
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        // Update the sender's balance and emit the Withdrawal event.
        // The assert statement is used to verify contract's balance never goes negative.
        balances[msg.sender] -= _amount;
        assert(address(this).balance >= 0);

        emit Withdrawal(msg.sender, _amount);
    }

    /**
     * @dev Returns the contract's current Ether balance.
     * @return The balance of Ether currently held by the contract.
     */
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev A custom function demonstrating the use of revert() for custom error handling.
     * @param _value An arbitrary input value for demonstration purposes.
     */
    function customFunction(uint _value) public pure {
        // Custom logic that reverts the transaction if the value is zero.
        if (_value == 0) {
            revert("Value cannot be zero");
        }
        // Additional function logic could be added here.
    }
}
