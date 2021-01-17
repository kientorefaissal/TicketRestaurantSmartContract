pragma solidity >=0.4.18; //We have to specify what version of the compiler this code will use

contract TiketsBCEAO {

  // We use the struct datatype to store the client information.
  struct client {
    address clientAddress; // The address of the client
    uint tokensBought;    // The total no. of tokens this client owns
    uint[] tokensUsedPerTiket; // Array to keep track of consumption per tiket.
    /* We have an array of tikets initialized below.
     Every time this client consum with her tokens, the value at that
     index is incremented. Example, if tketsList array declared
     below has ["Tiket blanc", "Tiket blue"] and this
     client consum 10 tokens to Tiket blue, the tokensUsedPerCandidate[1]
     will be incremented by 10.
     */
  }

  /* mapping is equivalent to an associate array or hash
   The key of the mapping is tiket name stored as type bytes32 and value is
   an unsigned integer which used to store the consumption count
   */

  mapping (address => client) public clientInfo;

  /* Solidity doesn't let you return an array of strings yet. We will use an array of bytes32
   instead to store the list of Tikets types
   */

  mapping (bytes32 => uint) public sellsReceived;

  bytes32[] public tiketsList;

  uint public totalTokens; // Total no. of tokens available for this tiketing application
  uint public balanceTokens; // Total no. of tokens still available for purchase
  uint public tokenPrice; // Price per token

  /* When the contract is deployed on the blockchain, we will initialize
   the total number of tokens for sale, cost per token and all the tikets
   */
  constructor(uint tokens, uint pricePerToken, bytes32[] tiketsNames) public {
    tiketsList = tiketsNames;
    totalTokens = tokens;
    balanceTokens = tokens;
    tokenPrice = pricePerToken;
  }

  function totalBoughtFor(bytes32 tiket) view public returns (uint) {
    return sellsReceived[tiket];
  }

  /* Instead of just taking the tiket name as an argument, we now also
   require the no. of tokens this client wants to consum for the tiket
   */
  function consumTikets(bytes32 tiket, uint tokensUsed) public {
    uint index = indexOfTiket(tiket);
    require(index != uint(-1));

    // msg.sender gives us the address of the account/voter who is trying
    // to call this function
    if (clientInfo[msg.sender].tokensUsedPerTiket.length == 0) {
      for(uint i = 0; i < tiketsList.length; i++) {
        clientInfo[msg.sender].tokensUsedPerTiket.push(0);
      }
    }

    // Make sure this client has enough tokens to consum the tiket
    uint availableTokens = clientInfo[msg.sender].tokensBought - totalTokensUsed(clientInfo[msg.sender].tokensUsedPerTiket);
    require(availableTokens >= tokensUsed);

    sellsReceived[tiket] += tokensUsed;

    // Store how many tokens were used for this tiket
    clientInfo[msg.sender].tokensUsedPerTiket[index] += tokensUsed;
  }

  // Return the sum of all the tokens used by this client.
  function totalTokensUsed(uint[] _tokensUsedPerTiket) private pure returns (uint) {
    uint totalUsedTokens = 0;
    for(uint i = 0; i < _tokensUsedPerTiket.length; i++) {
      totalUsedTokens += _tokensUsedPerTiket[i];
    }
    return totalUsedTokens;
  }

  function indexOfTiket(bytes32 tiket) view public returns (uint) {
    for(uint i = 0; i < tiketsList.length; i++) {
      if (tiketsList[i] == tiket) {
        return i;
      }
    }
    return uint(-1);
  }

  /* This function is used to purchase the tokens. Note the keyword 'payable'
   below. By just adding that one keyword to a function, your contract can
   now accept Ether from anyone who calls this function. Accepting money can
   not get any easier than this!
   */

  function buy() payable public returns (uint) {
    uint tokensToBuy = msg.value / tokenPrice;
    require(tokensToBuy <= balanceTokens);
    clientInfo[msg.sender].clientAddress = msg.sender;
    clientInfo[msg.sender].tokensBought += tokensToBuy;
    balanceTokens -= tokensToBuy;
    return tokensToBuy;
  }

  function tokensSold() view public returns (uint) {
    return totalTokens - balanceTokens;
  }

  function clientDetails(address user) view public returns (uint, uint[]) {
    return (clientInfo[user].tokensBought, clientInfo[user].tokensUsedPerTiket);
  }
  
  function transferTikets(address account, uint256 tikets) public {
    // Make sure this client has enough tokens to consum the tiket
    uint availableTokens = clientInfo[msg.sender].tokensBought - totalTokensUsed(clientInfo[msg.sender].tokensUsedPerTiket);
    require(availableTokens >= tikets);
    
    clientInfo[msg.sender].tokensBought -= tikets;
    clientInfo[account].tokensBought += tikets;
    
  }

  /* All the ether sent by client who purchased the tokens is in this
   contract's account. This method will be used to transfer out all those ethers
   in to another account. *** The way this function is written currently, anyone can call
   this method and transfer the balance in to their account. In reality, you should add
   check to make sure only the owner of this contract can cash out.
   */

  /*function transferTo(address account) public {
    account.transfer(this.balance);
  }*/

  function allTikets() view public returns (bytes32[]) {
    return tiketsList;
  }

}
