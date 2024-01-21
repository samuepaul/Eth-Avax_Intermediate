// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ErrorHandlingContract {
    // State variable to store a number
    uint256 public number;

    // Function to set the number
    // Uses require() to validate the input
    function setNumber(uint256 _number) public {
        // require() checks if the condition is true, if not, it reverts the transaction
        require(_number > 0, "Number must be greater than 0");
        number = _number;
    }

    // Function to decrease the number
    // Uses revert() to explicitly revert the transaction under certain condition
    function decreaseNumber(uint256 _amount) public {
        if (_amount > number) {
            // revert() reverts the transaction and can provide a custom error message
            revert("Cannot decrease number by a value larger than its current value");
        }
        number -= _amount;
    }

    // Function to multiply the number
    // Uses assert() for internal checks
    function multiplyNumber(uint256 _multiplier) public {
        uint256 originalNumber = number;
        number *= _multiplier;

        // assert() is used to ensure that a condition always holds true
        // It's typically used for checking invariants and internal errors
        assert(number >= originalNumber); // This should always be true for non-zero multipliers
    }
}
