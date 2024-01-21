// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title DogiToken
 * @dev Implementation of a basic token in Solidity.
 */
contract DogiToken {
    string public name = "Eth DogiToken";
    string public symbol = "DGT";
    uint256 public totalSupply = 6;

    mapping(address => uint256) public balances;

    /**
     * @dev Constructor that sets the initial supply and assigns it all to the contract creator.
     */
    constructor() {
        balances[msg.sender] = totalSupply;
    }

    /**
     * @dev Mints new tokens and increases the balance of a specified address.
     * @param _to The address to mint tokens to.
     * @param _value The amount of tokens to mint.
     */
    function mint(address _to, uint256 _value) public {
        require(_to != address(0), "Invalid address");
        totalSupply += _value;
        balances[_to] += _value;
    }

    /**
     * @dev Burns tokens and decreases the balance of the contract creator.
     * @param _value The amount of tokens to burn.
     */
    function burn(uint256 _value) public {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        totalSupply -= _value;
        balances[msg.sender] -= _value;
    }
}
