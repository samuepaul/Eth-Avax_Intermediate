// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title DogiToken
 * @dev Example of an ERC20 Token with minting and burning capabilities.
 */
contract DogiToken {

    string public constant NAME = "Dogi Token";
    string public constant SYMBOL = "DGT";
    address public immutable admin;

    uint256 public circulatingSupply;
    mapping(address => uint256) public accountBalances;

    /**
     * @dev Assigns the `admin` role to the account that deploys the contract.
     */
    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Ensures only the admin can call certain functions.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "DogiToken: caller is not the admin");
        _;
    }

    /**
     * @dev Creates `amount` new tokens and assigns them to `account`.
     *
     * Requirements:
     * - The function caller must be the admin.
     */
    function createToken(address account, uint256 amount) public onlyAdmin {
        require(account != address(0), "DogiToken: cannot mint to the zero address");

        circulatingSupply += amount;
        accountBalances[account] += amount;
    }

    /**
     * @dev Eliminates `amount` tokens from the caller's balance.
     *
     * Requirements:
     * - Caller must have at least `amount` tokens.
     */
    function eliminate(uint256 amount) public {
        require(accountBalances[msg.sender] >= amount, "DogiToken: burn amount exceeds balance");

        circulatingSupply -= amount;
        accountBalances[msg.sender] -= amount;
    }

    /**
     * @dev Moves `amount` tokens to `account` from the caller.
     *
     * Requirements:
     * - Caller cannot be the same as `account`.
     * - Caller must have at least `amount` of tokens.
     */
    function sendToken(address account, uint256 amount) public {
        require(msg.sender != account, "DogiToken: cannot transfer to the same address");
        require(accountBalances[msg.sender] >= amount, "DogiToken: transfer amount exceeds balance");

        accountBalances[msg.sender] -= amount;
        accountBalances[account] += amount;
    }
}
