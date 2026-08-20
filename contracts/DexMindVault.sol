// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DexMindVault
 * @dev A simple mock yield vault for RWA assets (US Treasuries, REITs, Gold) on X Layer.
 */
contract DexMindVault {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    
    uint256 public totalAssets;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function deposit(uint256 assets, address receiver) public returns (uint256 shares) {
        require(assets > 0, "Deposit must be greater than 0");
        
        // In a real vault, we would transfer tokens from caller.
        // For this mock on X Layer testnet, we simulate deposit directly.
        shares = assets; // 1:1 conversion
        
        balanceOf[receiver] += shares;
        totalSupply += shares;
        totalAssets += assets;
        
        emit Deposit(msg.sender, receiver, assets, shares);
        emit Transfer(address(0), receiver, shares);
        return shares;
    }
    
    function withdraw(uint256 assets, address receiver, address owner) public returns (uint256 shares) {
        require(assets <= totalAssets, "Insufficient assets in vault");
        shares = assets; // 1:1 conversion
        
        require(balanceOf[owner] >= shares, "Insufficient share balance");
        
        if (msg.sender != owner) {
            uint256 allowed = allowance[owner][msg.sender];
            if (allowed != type(uint256).max) {
                require(allowed >= shares, "Allowance exceeded");
                allowance[owner][msg.sender] = allowed - shares;
            }
        }
        
        balanceOf[owner] -= shares;
        totalSupply -= shares;
        totalAssets -= assets;
        
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        emit Transfer(owner, address(0), shares);
        return shares;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
