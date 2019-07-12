pragma solidity ^0.5.0;

  /**
  * @title SafeMath
  * @dev Math operations with safety checks that throw on error
  */
  library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
  // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
  // benefit is lost if 'b' is also tested.
  // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
  if (a == 0) {
  return 0;
  }

        c = a * b;
        assert(c / a == b);
        return c;
    }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
  // assert(b > 0); // Solidity automatically throws when dividing by 0
  // uint256 c = a / b;
  // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}
  
  /**
  * @title Helps contracts guard against reentrancy attacks.
  * @author Remco Bloemen <remco@2π.com>, Eenae <alexey@mixbytes.io>
  * @dev If you mark a function `nonReentrant`, you should also
  * mark it `external`.
  */

contract ReentrancyGuard {

  /// @dev counter to allow mutex lock with only one SSTORE operation
    uint256 private guardCounter = 1;

  /**
  * @dev Prevents a contract from calling itself, directly or indirectly.
  * If you mark a function `nonReentrant`, you should also
  * mark it `external`. Calling one `nonReentrant` function from
  * another is not supported. Instead, you can implement a
  * `private` function doing the actual work, and an `external`
  * wrapper marked as `nonReentrant`.
  */
    modifier nonReentrant() {
        guardCounter += 1;
        uint256 localCounter = guardCounter;
        _;
        require(localCounter == guardCounter);
    }

}
  

  /**
  * @title ERC165
  * @dev https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
  */

interface ERC165 {

  /**
  * @notice Query if a contract implements an interface
  * @param _interfaceId The interface identifier, as specified in ERC-165
  * @dev Interface identification is specified in ERC-165. This function
  * uses less than 30,000 gas.
  */
    function supportsInterface(bytes4 _interfaceId)
    external
    view
		returns (bool);
	}

  /**
  * @title ERC721 token receiver interface
  * @dev Interface for any contract that wants to support safeTransfers
  * from ERC721 asset contracts.
  */

 contract ERC721Receiver {
  /**
  * @dev Magic value to be returned upon successful reception of an NFT
  *  Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`,
  *  which can be also obtained as `ERC721Receiver(0).onERC721Received.selector`
  */
	  bytes4 internal constant ERC721_RECEIVED = 0x150b7a02;

  /**
  * @notice Handle the receipt of an NFT
  * @dev The ERC721 smart contract calls this function on the recipient
  * after a `safetransfer`. This function MAY throw to revert and reject the
 * transfer. Return of other than the magic value MUST result in the 
 * transaction being reverted.
 * Note: the contract address is always the message sender.
 * @param _operator The address which called `safeTransferFrom` function
 * @param _from The address which previously owned the token
 * @param _tokenId The NFT identifier which is being transfered
 * @param _data Additional data with no specified format
 * @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
 */
	  function onERC721Received(
		address _operator,
		address _from,
		uint256 _tokenId,
		bytes memory _data
	  )
		public
		returns(bytes4);
	}

 /**
 * Utility library of inline functions on addresses
 */
	library AddressUtils {

  /**
  * Returns whether the target address is a contract
  * @dev This function will return false if invoked during the constructor of a contract,
  * as the code is not actually created until after the constructor finishes.
  * @param addr address to check
  * @return whether the target address is a contract
  */
	  function isContract(address addr) internal view returns (bool) {
		uint256 size;
  // XXX Currently there is no better way to check if there is a contract in an address
  // than to check the size of the code at that address.
  // See https://ethereum.stackexchange.com/a/14016/36603
  // for more details about how this works.
  // TODO Check this again before the Serenity release, because all addresses will be
  // contracts then.
  // solium-disable-next-line security/no-inline-assembly
		assembly { size := extcodesize(addr) }
		return size > 0;
	  }

	}

  /**
  * @title Ownable
  * @dev The Ownable contract has an owner address, and provides basic authorization control
  * functions, this simplifies the implementation of "user permissions".
  */

	contract Ownable {
	  address owner;
   

	  event OwnershipRenounced(address indexed previousOwner);
	  event OwnershipTransferred(
		address indexed previousOwner,
		address indexed newOwner
	  );

     
  /**
  * @dev The Ownable constructor sets the original `owner` of the contract to the sender
  * account.
  */
	  constructor() public {
		owner = msg.sender;
	  }

  /**
  * @dev Throws if called by any account other than the owner.
  */
	  modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	  }

  /**
  * @dev Allows the current owner to relinquish control of the contract.
  * @notice Renouncing to ownership will leave the contract without an owner.
  * It will not be possible to call the functions with the `onlyOwner`
  * modifier anymore.
  */
	  function renounceOwnership() public onlyOwner {
		emit OwnershipRenounced(owner);
		owner = address(0);
	  } 

  /**
  * @dev Allows the current owner to transfer control of the contract to a newOwner.
  * @param _newOwner The address to transfer ownership to.
  */
	  function transferOwnership(address _newOwner) public onlyOwner {
		_transferOwnership(_newOwner);
	  }

  /**
  * @dev Transfers control of the contract to a newOwner.
  * @param _newOwner The address to transfer ownership to.
  */
	  function _transferOwnership(address _newOwner) internal {
		require(_newOwner != address(0));
		emit OwnershipTransferred(owner, _newOwner);
		owner = _newOwner;
	  }
	}

  /**
  * @title SupportsInterfaceWithLookup
  * @author Matt Condon (@shrugs)
  * @dev Implements ERC165 using a lookup table.
  */

	contract SupportsInterfaceWithLookup is ERC165 {
	  bytes4 public constant InterfaceId_ERC165 = 0x01ffc9a7;
  /**
  * 0x01ffc9a7 ===
  *   bytes4(keccak256('supportsInterface(bytes4)'))
  */

  /**
  * @dev a mapping of interface id to whether or not it's supported
  */
	  mapping(bytes4 => bool) internal supportedInterfaces;

  /**
  * @dev A contract implementing SupportsInterfaceWithLookup
  * implement ERC165 itself
  */
	  constructor()
		public
	  {
		_registerInterface(InterfaceId_ERC165);
	  }

  /**
  * @dev implement supportsInterface(bytes4) using a lookup table
  */
  function supportsInterface(bytes4 _interfaceId)
external
view
  returns (bool)
  {
  return supportedInterfaces[_interfaceId];
  }

  /**
  * @dev private method for registering an interface
  */
  function _registerInterface(bytes4 _interfaceId)
  internal
  {
  require(_interfaceId != 0xffffffff);
  supportedInterfaces[_interfaceId] = true;
  }
  }

  /**
  * @title ERC721 Non-Fungible Token Standard basic interface
  * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
  */

	contract ERC721Basic is ERC165 {
	  event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 indexed _tokenId
	  );
	  event Approval(
		address indexed _owner,
		address indexed _approved,
		uint256 indexed _tokenId
	  );
	  event ApprovalForAll(
		address indexed _owner,
		address indexed _operator,
		bool _approved
	  );

	  function balanceOf(address _owner) public view returns (uint256 _balance);
	  function ownerOf(uint256 _tokenId) public view returns (address _owner);
	  function exists(uint256 _tokenId) public view returns (bool _exists);

	  function approve(address _to, uint256 _tokenId) public;
	  function getApproved(uint256 _tokenId)
		public view returns (address _operator);

	  function setApprovalForAll(address _operator, bool _approved) public;
	  function isApprovedForAll(address _owner, address _operator)
		public view returns (bool);

	  function transferFrom(address _from, address _to, uint256 _tokenId) public;
	  function safeTransferFrom(address _from, address _to, uint256 _tokenId)
		public;

	  function safeTransferFrom(
		address _from,
		address _to,
		uint256 _tokenId,
		bytes memory _data
	  )
		public;
	}

  /**
  * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
  * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
  */

  contract ERC721Enumerable is ERC721Basic {
  function totalSupply() public view returns (uint256);
  function tokenOfOwnerByIndex(
  address _owner,
  uint256 _index
  )
  public
  view
  returns (uint256 _tokenId);

  function tokenByIndex(uint256 _index) public view returns (uint256);
  }


  /**
  * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
  * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
  */
  contract ERC721Metadata is ERC721Basic {
  function name() external view returns (string memory _name);
  function symbol() external view returns (string memory _symbol);
  function tokenURI(uint256 _tokenId) public view returns (string memory);
  }


  /**
  * @title ERC-721 Non-Fungible Token Standard, full implementation interface
  * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
  */
  contract ERC721 is ERC721Basic, ERC721Enumerable, ERC721Metadata {
  }

  /**
  * @title ERC721 Non-Fungible Token Standard basic implementation
  * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
  */

  contract ERC721BasicToken is SupportsInterfaceWithLookup, ERC721Basic {

  bytes4 private constant InterfaceId_ERC721 = 0x80ac58cd;
  /*
  * 0x80ac58cd ===
  *   bytes4(keccak256('balanceOf(address)')) ^
  *   bytes4(keccak256('ownerOf(uint256)')) ^
  *   bytes4(keccak256('approve(address,uint256)')) ^
  *   bytes4(keccak256('getApproved(uint256)')) ^
  *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
  *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
  *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
  *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
  *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
  */

	  bytes4 private constant InterfaceId_ERC721Exists = 0x4f558e79;
	  /*
	   * 0x4f558e79 ===
	   *   bytes4(keccak256('exists(uint256)'))
	   */

	  using SafeMath for uint256;
	  using AddressUtils for address;

	  // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
	  // which can be also obtained as `ERC721Receiver(0).onERC721Received.selector`
	  bytes4 private constant ERC721_RECEIVED = 0x150b7a02;

	  // Mapping from token ID to owner
	  mapping (uint256 => address) internal tokenOwner;

	  // Mapping from token ID to approved address
	  mapping (uint256 => address) internal tokenApprovals;

	  // Mapping from owner to number of owned token
	  mapping (address => uint256) internal ownedTokensCount;

	  // Mapping from owner to operator approvals
	  mapping (address => mapping (address => bool)) internal operatorApprovals;
	   
	  // The token holder of each token types
      mapping (address => mapping (uint => uint)) internal tokenHoldersById;
      
	   /// The token type (1 for Genesis, 2 for Mini, 3 for Oasis, 4 for Refuge)
	  mapping(uint256 => uint256) tokenTypes;

	  //Internal use only
	  uint256 public total = 0;
	  
	  /**
	   * @dev Guarantees msg.sender is owner of the given token
	   * @param _tokenId uint256 ID of the token to validate its ownership belongs to msg.sender
	   */
	  modifier onlyOwnerOf(uint256 _tokenId) {
		require(ownerOf(_tokenId) == msg.sender);
		_;
	  }

	  /**
	   * @dev Checks msg.sender can transfer a token, by being owner, approved, or operator
	   * @param _tokenId uint256 ID of the token to validate
	   */
	  modifier canTransfer(uint256 _tokenId) {
		require(isApprovedOrOwner(msg.sender, _tokenId));
		_;
	  }

	  constructor()
		public
	  {
		// register the supported interfaces to conform to ERC721 via ERC165
		_registerInterface(InterfaceId_ERC721);
		_registerInterface(InterfaceId_ERC721Exists);
	  }

	  /**
	   * @dev Gets the balance of the specified address
	   * @param _owner address to query the balance of
	   * @return uint256 representing the amount owned by the passed address
	   */
	  function balanceOf(address _owner) public view returns (uint256) {
		require(_owner != address(0));
		return ownedTokensCount[_owner];
	  }

	  /**
	   * @dev Gets the owner of the specified token ID
	   * @param _tokenId uint256 ID of the token to query the owner of
	   * @return owner address currently marked as the owner of the given token ID
	   */
	  function ownerOf(uint256 _tokenId) public view returns (address) {
		address owner = tokenOwner[_tokenId];
		require(owner != address(0));
		return owner;
	  }

	  /**
	   * @dev Returns whether the specified token exists
	   * @param _tokenId uint256 ID of the token to query the existence of
	   * @return whether the token exists
	   */
	  function exists(uint256 _tokenId) public view returns (bool) {
		address owner = tokenOwner[_tokenId];
		return owner != address(0);
	  }

	  /**
	   * @dev Approves another address to transfer the given token ID
	   * The zero address indicates there is no approved address.
	   * There can only be one approved address per token at a given time.
	   * Can only be called by the token owner or an approved operator.
	   * @param _to address to be approved for the given token ID
	   * @param _tokenId uint256 ID of the token to be approved
	   */
	  function approve(address _to, uint256 _tokenId) public {
		address owner = ownerOf(_tokenId);
		require(_to != owner);
		require(msg.sender == owner || isApprovedForAll(owner, msg.sender));

		tokenApprovals[_tokenId] = _to;
		emit Approval(owner, _to, _tokenId);
	  }

	  /**
	   * @dev Gets the approved address for a token ID, or zero if no address set
	   * @param _tokenId uint256 ID of the token to query the approval of
	   * @return address currently approved for the given token ID
	   */
	  function getApproved(uint256 _tokenId) public view returns (address) {
		return tokenApprovals[_tokenId];
	  }

	  /**
	   * @dev Sets or unsets the approval of a given operator
	   * An operator is allowed to transfer all tokens of the sender on their behalf
	   * @param _to operator address to set the approval
	   * @param _approved representing the status of the approval to be set
	   */
	  function setApprovalForAll(address _to, bool _approved) public {
		require(_to != msg.sender);
		operatorApprovals[msg.sender][_to] = _approved;
		emit ApprovalForAll(msg.sender, _to, _approved);
	  }

	  /**
	   * @dev Tells whether an operator is approved by a given owner
	   * @param _owner owner address which you want to query the approval of
	   * @param _operator operator address which you want to query the approval of
	   * @return bool whether the given operator is approved by the given owner
	   */
	  function isApprovedForAll(
		address _owner,
		address _operator
	  )
		public
		view
		returns (bool)
	  {
		return operatorApprovals[_owner][_operator];
	  }

	  /**
	   * @dev Transfers the ownership of a given token ID to another address
	   * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
	   * Requires the msg sender to be the owner, approved, or operator
	   * @param _from current owner of the token
	   * @param _to address to receive the ownership of the given token ID
	   * @param _tokenId uint256 ID of the token to be transferred
	  */
	  function transferFrom( address _from, address _to, uint256 _tokenId ) public canTransfer(_tokenId)
	  {
		uint256 tokenType_ = 0;
		require(_from != address(0));
		require(_to != address(0));
		tokenType_ = tokenTypes[_tokenId];
		total = tokenHoldersById[_from][tokenType_] - 1;
		tokenHoldersById[_from][tokenType_] = total;
		total = tokenHoldersById[_to][tokenType_] + 1;
		tokenHoldersById[_to][tokenType_] = total;
		clearApproval(_from, _tokenId);
		removeTokenFrom(_from, _tokenId);
		addTokenTo(_to, _tokenId);
		emit Transfer(_from, _to, _tokenId);
	  }

	  /**
	   * @dev Safely transfers the ownership of a given token ID to another address
	   * If the target address is a contract, it must implement `onERC721Received`,
	   * which is called upon a safe transfer, and return the magic value
	   * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
	   * the transfer is reverted.
	   *
	   * Requires the msg sender to be the owner, approved, or operator
	   * @param _from current owner of the token
	   * @param _to address to receive the ownership of the given token ID
	   * @param _tokenId uint256 ID of the token to be transferred
	  */
	  function safeTransferFrom( address _from, address _to, uint256 _tokenId ) public canTransfer(_tokenId)
	  {
		// solium-disable-next-line arg-overflow
		safeTransferFrom(_from, _to, _tokenId, "");
	  }

	  /**
	   * @dev Safely transfers the ownership of a given token ID to another address
	   * If the target address is a contract, it must implement `onERC721Received`,
	   * which is called upon a safe transfer, and return the magic value
	   * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
	   * the transfer is reverted.
	   * Requires the msg sender to be the owner, approved, or operator
	   * @param _from current owner of the token
	   * @param _to address to receive the ownership of the given token ID
	   * @param _tokenId uint256 ID of the token to be transferred
	   * @param _data bytes data to send along with a safe transfer check
	   */
	  function safeTransferFrom(
		address _from,
		address _to,
		uint256 _tokenId,
		bytes memory _data
	  )
		public
		canTransfer(_tokenId)
	  {
		transferFrom(_from, _to, _tokenId);
		// solium-disable-next-line arg-overflow
		require(checkAndCallSafeTransfer(_from, _to, _tokenId, _data));
      }
       /**
	   * @dev Returns whether the given spender can transfer a given token ID
	   * @param _spender address of the spender to query
	   * @param _tokenId uint256 ID of the token to be transferred
	   * @return bool whether the msg.sender is approved for the given token ID,
	   *  is an operator of the owner, or is the owner of the token
	   */
	  function isApprovedOrOwner(
		address _spender,
		uint256 _tokenId
	  )
		internal
		view
		returns (bool)
	  {
		address owner = ownerOf(_tokenId);
		// Disable solium check because of
		// https://github.com/duaraghav8/Solium/issues/175
		// solium-disable-next-line operator-whitespace
		return (
		  _spender == owner ||
		  getApproved(_tokenId) == _spender ||
		  isApprovedForAll(owner, _spender)
		);
	  }

	  /**
	   * @dev Internal function to mint a new token
	   * Reverts if the given token ID already exists
	   * @param _to The address that will own the minted token
	   * @param _tokenId uint256 ID of the token to be minted by the msg.sender
	   */
	  function _mint(address _to, uint256 _tokenId) internal {
		require(_to != address(0));
		addTokenTo(_to, _tokenId);
		emit Transfer(address(0), _to, _tokenId);
	  }

	  /**
	   * @dev Internal function to burn a specific token
	   * Reverts if the token does not exist
	   * @param _tokenId uint256 ID of the token being burned by the msg.sender
	   */
	  function _burn(address _owner, uint256 _tokenId) internal {
		clearApproval(_owner, _tokenId);
		removeTokenFrom(_owner, _tokenId);
		emit Transfer(_owner, address(0), _tokenId);
	  }

	  /**
	   * @dev Internal function to clear current approval of a given token ID
	   * Reverts if the given address is not indeed the owner of the token
	   * @param _owner owner of the token
	   * @param _tokenId uint256 ID of the token to be transferred
	   */
	  function clearApproval(address _owner, uint256 _tokenId) internal {
		require(ownerOf(_tokenId) == _owner);
		if (tokenApprovals[_tokenId] != address(0)) {
		  tokenApprovals[_tokenId] = address(0);
		}
	  }

	  /**isApprovedOrOwner
	   * @dev Internal function to add a token ID to the list of a given address
	   * @param _to address representing the new owner of the given token ID
	   * @param _tokenId uint256 ID of the token to be added to the tokens list of the given address
	   */
	  function addTokenTo(address _to, uint256 _tokenId) internal {
		require(tokenOwner[_tokenId] == address(0));
		tokenOwner[_tokenId] = _to;
		ownedTokensCount[_to] = ownedTokensCount[_to].add(1);
	  }

	  /**
	   * @dev Internal function to remove a token ID from the list of a given address
	   * @param _from address representing the previous owner of the given token ID
	   * @param _tokenId uint256 ID of the token to be removed from the tokens list of the given address
	   */
	  function removeTokenFrom(address _from, uint256 _tokenId) internal {
		require(ownerOf(_tokenId) == _from);
		ownedTokensCount[_from] = ownedTokensCount[_from].sub(1);
		tokenOwner[_tokenId] = address(0);
	  }

	  /**
	   * @dev Internal function to invoke `onERC721Received` on a target address
	   * The call is not executed if the target address is not a contract
	   * @param _from address representing the previous owner of the given token ID
	   * @param _to target address that will receive the tokens
	   * @param _tokenId uint256 ID of the token to be transferred
	   * @param _data bytes optional data to send along with the call
	   * @return whether the call correctly returned the expected magic value
	   */
	  function checkAndCallSafeTransfer(
		address _from,
		address _to,
		uint256 _tokenId,
		bytes memory _data
	  )
		internal
		returns (bool)
	  {
		if (!_to.isContract()) {
		  return true;
		}
		bytes4 retval = ERC721Receiver(_to).onERC721Received(
		  msg.sender, _from, _tokenId, _data);
		return (retval == ERC721_RECEIVED);
	  }
	}

	/**
	 * @title Full ERC721 Token
	 * This implementation includes all the required and some optional functionality of the ERC721 standard
	 * Moreover, it includes approve all functionality using operator terminology
	 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
	 */
     
	contract ERC721Token is SupportsInterfaceWithLookup, ERC721BasicToken, ERC721 {

	  bytes4 private constant InterfaceId_ERC721Enumerable = 0x780e9d63;
	  /**
	   * 0x780e9d63 ===
	   *   bytes4(keccak256('totalSupply()')) ^
	   *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
	   *   bytes4(keccak256('tokenByIndex(uint256)'))
	   */

	  bytes4 private constant InterfaceId_ERC721Metadata = 0x5b5e139f;
	  /**
	   * 0x5b5e139f ===
	   *   bytes4(keccak256('name()')) ^
	   *   bytes4(keccak256('symbol()')) ^
	   *   bytes4(keccak256('tokenURI(uint256)'))
	   */

	  // Token name
	  string public constant name_ = "AfterMath";

	  // Token symbol
	  string public constant symbol_ = "AIT";

      //Decimal of the tokens
      uint256 public constant decimal = 0;

	  // Mapping from owner to list of owned token IDs
	  mapping(address => uint256[]) internal ownedTokens;

	  // Mapping from token ID to index of the owner tokens list
	  mapping(uint256 => uint256) internal ownedTokensIndex;

	  // Array with all token ids, used for enumeration
	  uint256[] internal allTokens;

	  // Mapping from token id to position in the allTokens array
	  mapping(uint256 => uint256) internal allTokensIndex;

	  // Optional mapping for token URIs
	  mapping(uint256 => string) internal tokenURIs;

	  /**
	   * @dev Constructor function
	   */
	  constructor() public {
		// register the supported interfaces to conform to ERC721 via ERC165
		_registerInterface(InterfaceId_ERC721Enumerable);
		_registerInterface(InterfaceId_ERC721Metadata);
	  }

	  /**
	   * @dev Gets the token name
	   * @return string representing the token name
	   */
	  function name() external view returns (string memory) {
		return name_;
	  }

	  /**
	   * @dev Gets the token symbol
	   * @return string representing the token symbol
	   */
	  function symbol() external view returns (string memory) {
		return symbol_;
	  }

	  /**
	   * @dev Returns an URI for a given token ID
	   * Throws if the token ID does not exist. May return an empty string.
	   * @param _tokenId uint256 ID of the token to query
	   */
	  function tokenURI(uint256 _tokenId) public view returns (string memory) {
		require(exists(_tokenId));
		return tokenURIs[_tokenId];
	  }

	  /**
	   * @dev Gets the token ID at a given index of the tokens list of the requested owner
	   * @param _owner address owning the tokens list to be accessed
	   * @param _index uint256 representing the index to be accessed of the requested tokens list
	   * @return uint256 token ID at the given index of the tokens list owned by the requested address
	   */
	  function tokenOfOwnerByIndex(
		address _owner,
		uint256 _index
	  )
		public
		view
		returns (uint256)
	  {
		require(_index < balanceOf(_owner));
		return ownedTokens[_owner][_index];
	  }

	  /**
	   * @dev Gets the total amount of tokens stored by the contract
	   * @return uint256 representing the total amount of tokens
	   */
	  function totalSupply() public view returns (uint256) {
		return allTokens.length;
	  }

	  /**
	   * @dev Gets the token ID at a given index of all the tokens in this contract
	   * Reverts if the index is greater or equal to the total number of tokens
	   * @param _index uint256 representing the index to be accessed of the tokens list
	   * @return uint256 token ID at the given index of the tokens list
	   */
	  function tokenByIndex(uint256 _index) public view returns (uint256) {
		require(_index < totalSupply());
		return allTokens[_index];
	  }

	  /**
	   * @dev Internal function to set the token URI for a given token
	   * Reverts if the token ID does not exist
	   * @param _tokenId uint256 ID of the token to set its URI
	   * @param _uri string URI to assign
	   */
	  function _setTokenURI(uint256 _tokenId, string memory _uri) internal {
		require(exists(_tokenId));
		tokenURIs[_tokenId] = _uri;
	  }

	  /**
	   * @dev Internal function to add a token ID to the list of a given address
	   * @param _to address representing the new owner of the given token ID
	   * @param _tokenId uint256 ID of the token to be added to the tokens list of the given address
	   */
	  function addTokenTo(address _to, uint256 _tokenId) internal {
		super.addTokenTo(_to, _tokenId);
		uint256 length = ownedTokens[_to].length;
		ownedTokens[_to].push(_tokenId);
		ownedTokensIndex[_tokenId] = length;
	  }

	  /**
	   * @dev Internal function to remove a token ID from the list of a given address
	   * @param _from address representing the previous owner of the given token ID
	   * @param _tokenId uint256 ID of the token to be removed from the tokens list of the given address
	   */
	  function removeTokenFrom(address _from, uint256 _tokenId) internal {
		super.removeTokenFrom(_from, _tokenId);

		uint256 tokenIndex = ownedTokensIndex[_tokenId];
		uint256 lastTokenIndex = ownedTokens[_from].length.sub(1);
		uint256 lastToken = ownedTokens[_from][lastTokenIndex];

		ownedTokens[_from][tokenIndex] = lastToken;
		ownedTokens[_from][lastTokenIndex] = 0;
		// Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
		// be zero. Then we can make sure that we will remove _tokenId from the ownedTokens list since we are first swapping
		// the lastToken to the first position, and then dropping the element placed in the last position of the list

		ownedTokens[_from].length--;
		ownedTokensIndex[_tokenId] = 0;
		ownedTokensIndex[lastToken] = tokenIndex;
	  }

	  /**
	   * @dev Internal function to mint a new token
	   * Reverts if the given token ID already exists
	   * @param _to address the beneficiary that will own the minted token
	   * @param _tokenId uint256 ID of the token to be minted by the msg.sender
	   */
	  function _mint(address _to, uint256 _tokenId) internal {
		super._mint(_to, _tokenId);

		allTokensIndex[_tokenId] = allTokens.length;
		allTokens.push(_tokenId);
	  }

	  /**
	   * @dev Internal function to burn a specific token
	   * Reverts if the token does not exist
	   * @param _owner owner of the token to burn
	   * @param _tokenId uint256 ID of the token being burned by the msg.sender
	   */
	  function _burn(address _owner, uint256 _tokenId) internal {
		super._burn(_owner, _tokenId);

		// Clear metadata (if any)
		if (bytes(tokenURIs[_tokenId]).length != 0) {
		  delete tokenURIs[_tokenId];
		}

		// Reorg all tokens array
		uint256 tokenIndex = allTokensIndex[_tokenId];
		uint256 lastTokenIndex = allTokens.length.sub(1);
		uint256 lastToken = allTokens[lastTokenIndex];

		allTokens[tokenIndex] = lastToken;
		allTokens[lastTokenIndex] = 0;

		allTokens.length--;
		allTokensIndex[_tokenId] = 0;
		allTokensIndex[lastToken] = tokenIndex;
	  }

	}

	contract AftermathIslands is ERC721Token, Ownable {
      /**Variables for uri use */
		    string public totalAssetsSupply = "1200000";
	  	  string public totalBasicHutSupply = "100000";
		    string public totalBasicShedSupply = "100000";
		    string public totalBasicBarnSupply = "100000";
		    string public totalBasicGreenhouseSupply = "100000";
        string public totalBasicBarracksSupply = "100000";
        string public totalBasicDockSupply = "100000";
        string public totalBasicTownCenterSupply = "100000";
        string public totalBasicFreshWaterWellSupply = "100000";
        string public totalBrahamaBullSupply = "100000";
        string public totalBrahamaCowSupply = "100000";
        string public totalAngusBullSupply = "100000";
        string public totalAngusCowSupply = "100000";
        uint256 public BasicHutPrice;
        uint256 public BasicShedPrice;
        uint256 public BasicBarnPrice;
        uint256 public BasicGreenhousePrice;
        uint256 public BasicBarracksPrice;
        uint256 public BasicDockPrice;
        uint256 public BasicTownCenterPrice;
        uint256 public BasicFreshWaterWellPrice;
        uint256 public BrahamaBullPrice;
        uint256 public BrahamaCowPrice;
        uint256 public AngusBullPrice;
        uint256 public AngusCowPrice;
        uint256 public currentAssetsSupply = 1200000;
	    	uint256 public currentBasicHutSupply = 100000;
	    	uint256 public currentBasicShedSupply = 100000;
	    	uint256 public currentBasicBarnSupply = 100000;
	    	uint256 public currentBasicGreenhouseSupply = 100000;
        uint256 public currentBasicBarracksSupply = 100000;
        uint256 public currentBasicDockSupply = 100000;
        uint256 public currentBasicTownCenterSupply = 100000;
        uint256 public currentBasicFreshWaterWellSupply = 100000;
        uint256 public currentBrahamaBullSupply = 100000;
        uint256 public currentBrahamaCowSupply = 100000;
        uint256 public currentAngusBullSupply = 100000;
        uint256 public currentAngusCowSupply = 100000;
	    	// uint256 private total = 0;
        string private uriString;
        string private response = "";
        string private _title;
        string private _description;

        uint256 private counter = 0;
	  /*** EVENTS ***/
	  /// The event emitted (useable by web3) when a token is purchased
	  event BoughtToken(address indexed buyer, uint256 tokenId);
      
	  /// The token type (1 for Genesis, 2 for Mini, 3 for Oasis, 4 for Refuge)
	//   mapping(uint256 => uint256) tokenTypes;

	  /// The title of the token
	  mapping(uint256 => string) tokenTitles;
	  
	  /// The description of the token
	  mapping(uint256 => string) tokenDescription;

		// The token holder of each token types
    // mapping (address => mapping (uint => uint)) internal tokenHoldersById;
       //Modifier for testing conditions
    modifier validations(uint256 _typeId){
        require(_typeId > 0,"Incorrect ID");
		require(_typeId < 13, "Incorrect ID");
        _;
    }

	  /// Requires the amount of Ether be at least or more of the currentPrice
	  /// @dev Creates an instance of an token and mints it to the purchaser
	  /// @param _typeID The token type as an integer
	  function buyToken(
		uint256 _typeID
		// string calldata _title,
		// string calldata _description
	  ) external payable validations(_typeID) returns(string memory _response){
		uint256 index = allTokens.length + 1;
        if(_typeID == 1 && currentBasicHutSupply > 0){
            require(msg.value >= BasicHutPrice && BasicHutPrice > 0,"Insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicHut.json";
            _title = "Basic Hut";
            _description = "Uses 250 squares of space. Stores 250 cubes. For avatar resting to restore health status, storage and personal property management.";
            currentBasicHutSupply = currentBasicHutSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 2 && currentBasicShedSupply > 0){
            require(msg.value >= BasicShedPrice && BasicShedPrice > 0, "Insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicShed.json";
            _title = "Basic Shed";
            _description = "Uses 250 squares of space. Stores 750 cubes. For storage.";
            currentBasicShedSupply = currentBasicShedSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 3 && currentBasicBarnSupply > 0){
            require(msg.value >= BasicBarnPrice && BasicBarnPrice > 0, "Insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicBarn.json";
            _title = "Basic Barn";
            _description = "Uses 500 squares of space. Houses 2 large animals or 6 small animals.Increases animal production by 10%. ";
            currentBasicBarnSupply = currentBasicBarnSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 4 && currentBasicGreenhouseSupply > 0){
            require(msg.value >= BasicGreenhousePrice && BasicGreenhousePrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicGreenhouse.json";
            _title = "Basic Greenhouse";
            _description = "Uses 500 squares of space. Grows 500 squares of crops.10% crop growth production boost. ";
            currentBasicGreenhouseSupply = currentBasicGreenhouseSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 5 && currentBasicBarracksSupply > 0){
            require(msg.value >= BasicBarracksPrice && BasicBarracksPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicBarracks.json";
            _title = "Basic Barracks";
            _description = "Uses 2500 squares of space. Houses 100 troops.";
            currentBasicBarracksSupply = currentBasicBarracksSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 6 && currentBasicDockSupply > 0){
            require(msg.value >= BasicDockPrice && BasicDockPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicDock.json";
            _title = "Basic Dock";
            _description = "Uses 200 squares community land space & over water space. Allows visitors and imports from other islands. Community building.";
            currentBasicDockSupply = currentBasicDockSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 7 && currentBasicTownCenterSupply > 0){
            require(msg.value >= BasicTownCenterPrice && BasicTownCenterPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/Basic TownCenter.json";
            _title = "Basic Town Center";
            _description = "Uses 2500 squares of community space. Community management and 10,000 cubes community storage.";
            currentBasicTownCenterSupply = currentBasicTownCenterSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 8 && currentBasicFreshWaterWellSupply > 0){
            require(msg.value >= BasicFreshWaterWellPrice && BasicFreshWaterWellPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicFreshWaterWell.json";
            _title = "Basic Fresh Water Well";
            _description = "Uses 50 squares of community or personal land space.Provides fresh water to 50,000 squares proximity.";
            currentBasicFreshWaterWellSupply = currentBasicFreshWaterWellSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 9 && currentBrahamaBullSupply > 0){
            require(msg.value >= BrahamaBullPrice && BrahamaBullPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/Brahama Bull.json";
            _title = "Brahama Bull";
            _description = "Produces 3 cubes manure per day. Requires 6 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentBrahamaBullSupply = currentBrahamaBullSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 10 && currentBrahamaCowSupply > 0){
            require(msg.value >= BrahamaCowPrice && BrahamaCowPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BrahamaCow.json";
            _title = "Brahama Cow";
            _description = " Produces 3 cubes manure per day, 1 jar milk per day. Requires 6 corn or feed per 24 hours. 60 day breeding period. 30 day cool down after calf birth. 500 lifetime births.";
            currentBrahamaCowSupply = currentBrahamaCowSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 11 && currentAngusBullSupply > 0){
            require(msg.value >= AngusBullPrice && AngusBullPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/AngusBull.json";
            _title = "Angus Bull";
            _description = "Produces 2 cubes manure per day. Requires 5 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentAngusBullSupply = currentAngusBullSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }

        else if(_typeID == 12 && currentAngusCowSupply > 0){
            require(msg.value >= AngusCowPrice && AngusCowPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/AngusCow.json";
            _title = "Angus Cow";
            _description = "Produces 2 cubes manure per day, 1 jar milk per day. Requires 5 corn or feed per 24 hours. 60 day breeding period. 30 day cool down after calf birth. 500 lifetime births.";
            currentAngusCowSupply = currentAngusCowSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        /**Minting new coins dynamically and set the URI value based on the input number */
		    setTokenByTokenID(_typeID);
        _mint(msg.sender, index);
        _setTokenURI(index,uriString);
				tokenTypes[index] = _typeID;
				tokenTitles[index] = _title;
				tokenDescription[index] = _description;
        
				emit BoughtToken(msg.sender, index);
        return response;
	  } 
		  //Set the value of total token by token ID 
			function setTokenByTokenID(uint256 _tokenTypeId) internal {
				total = tokenHoldersById[msg.sender][_tokenTypeId] + 1;
				tokenHoldersById[msg.sender][_tokenTypeId] = total;
			}

			//Get token by token ID and address
			function getTokenByTypeId(uint256 _AssetTypeID, address HolderAddress) public view validations(_AssetTypeID) returns (uint256){
				 require(HolderAddress != address(0),"Incorrect Address");
				 return tokenHoldersById[HolderAddress][_AssetTypeID];
				}

      //Function to withdraw all the balance from the smart contract
      function withdrawAllAmount() external onlyOwner returns (bool resp){
        msg.sender.transfer(address(this).balance);
        return true;
     }

	  /**
	   * @dev Returns all of the tokens that the user owns
	   * @return An array of token indices
	   */
	  function myTokens() external view returns ( uint256[] memory )
	  {
		return ownedTokens[msg.sender];
	  }

	  /// @notice Returns all the relevant information about a specific token
	  /// @param _tokenId The ID of the token of interest
	  function viewToken(uint256 _tokenId) external view returns (
		  uint256 tokenType_,
		  string memory tokenTitle_,
		  string memory tokenDescription_
	  ) {
		  tokenType_ = tokenTypes[_tokenId];
		  tokenTitle_ = tokenTitles[_tokenId];
		  tokenDescription_ = tokenDescription[_tokenId];
	  }

      //Get total coin balance
        function getTotalAssetsBalance() external view returns (uint256 bal){
            return currentAssetsSupply;
        }

      //Get total Assets balance
        function getBasicHutBalance() external view returns (uint256 bal){
            return currentBasicHutSupply;
        }
      
      //Get Mini total balance
        function getBasicShedBalance() external view returns (uint256 bal){
            return currentBasicShedSupply;
        }
      
      //Get Oasis total balance
        function getBasicBarnBalance() external view returns (uint256 bal){
            return currentBasicBarnSupply;
        }

      //Get Refuge total balance
        function getBasicGreenhouseBalance() external view returns (uint256 bal){
            return currentBasicGreenhouseSupply;
        }
        //Get Refuge total balance
        function getBasicBarracksBalance() external view returns (uint256 bal){
            return currentBasicBarracksSupply;
        }
        //Get Refuge total balance
        function getBasicDockBalance() external view returns (uint256 bal){
            return currentBasicDockSupply;
        }
        //Get Refuge total balance
        function getBasicTownCenterBalance() external view returns (uint256 bal){
            return currentBasicTownCenterSupply;
        }
        //Get Refuge total balance
        function getBasicFreshWaterWellBalance() external view returns (uint256 bal){
            return currentBasicFreshWaterWellSupply;
        }
        //Get Refuge total balance
        function getBrahamaBullBalance() external view returns (uint256 bal){
            return currentBrahamaBullSupply;
        }
        //Get Refuge total balance
        function getBrahamaCowBalance() external view returns (uint256 bal){
            return currentBrahamaCowSupply;
        }
        //Get Refuge total balance
        function getAngusBullBalance() external view returns (uint256 bal){
            return currentAngusBullSupply;
        }
        //Get Refuge total balance
        function getAngusCowBalance() external view returns (uint256 bal){
            return currentAngusCowSupply;
        }
 
      //Set Oasis price
       function setBasicHutPrice(uint256 _BasicHutPrice) external onlyOwner returns (bool status){
           BasicHutPrice = _BasicHutPrice;
           return true;
       }

       function setBasicShedPrice(uint256 _BasicShedPrice) external onlyOwner returns (bool status){
           BasicShedPrice = _BasicShedPrice;
           return true;
       }
       function setBasicBarnPrice(uint256 _BasicBarnPrice) external onlyOwner returns (bool status){
           BasicBarnPrice = _BasicBarnPrice;
           return true;
       }
       function setBasicGreenhousePrice(uint256 _BasicGreenhousePrice) external onlyOwner returns (bool status){
           BasicGreenhousePrice = _BasicGreenhousePrice;
           return true;
       }
       function setBasicBarracksPrice(uint256 _BasicBarracksPrice) external onlyOwner returns (bool status){
           BasicBarracksPrice = _BasicBarracksPrice;
           return true;
       }
       function setBasicDockPrice(uint256 _BasicDockPrice) external onlyOwner returns (bool status){
           BasicDockPrice = _BasicDockPrice;
           return true;
       }
       function setBasicTownCenterPrice(uint256 _BasicTownCenterPrice) external onlyOwner returns (bool status){
           BasicTownCenterPrice = _BasicTownCenterPrice;
           return true;
       }
       function setBasicFreshWaterWellPrice(uint256 _BasicFreshWaterWellPrice) external onlyOwner returns (bool status){
           BasicFreshWaterWellPrice = _BasicFreshWaterWellPrice;
           return true;
       }
       function setBrahamaBullPrice(uint256 _BrahamaBullPrice) external onlyOwner returns (bool status){
           BrahamaBullPrice = _BrahamaBullPrice;
           return true;
       }
       function setBrahamaCowPrice(uint256 _BrahamaCowPrice) external onlyOwner returns (bool status){
           BrahamaCowPrice = _BrahamaCowPrice;
           return true;
       }
       function setAngusBullPrice(uint256 _AngusBullPrice) external onlyOwner returns (bool status){
           AngusBullPrice = _AngusBullPrice;
           return true;
       }
       function setAngusCowPrice(uint256 _AngusCowPrice) external onlyOwner returns (bool status){
           AngusCowPrice = _AngusCowPrice;
           return true;
       }

       //get current prices of all the Assets
        function getCurrentPrices() external view returns(
        uint256  _BasicHutPrice,
        uint256  _BasicShedPrice,
        uint256  _BasicBarnPrice,
        uint256  _BasicGreenhousePrice,
        uint256  _BasicBarracksPrice,
        uint256  _BasicDockPrice,
        uint256  _BasicTownCenterPrice,
        uint256  _BasicFreshWaterWellPrice,
        uint256  _BrahamaBullPrice,
        uint256  _BrahamaCowPrice,
        uint256  _AngusBullPrice,
        uint256  _AngusCowPrice
        ){
            _BasicHutPrice = BasicHutPrice;
            _BasicShedPrice = BasicShedPrice;
            _BasicBarnPrice = BasicBarnPrice;
            _BasicGreenhousePrice = BasicGreenhousePrice;
            _BasicBarracksPrice = BasicBarracksPrice;
            _BasicDockPrice = BasicDockPrice;
            _BasicTownCenterPrice = BasicTownCenterPrice;
            _BasicFreshWaterWellPrice = BasicFreshWaterWellPrice;
            _BrahamaBullPrice = BrahamaBullPrice;
            _BrahamaCowPrice = BrahamaCowPrice;
            _AngusBullPrice = AngusBullPrice;
            _AngusCowPrice = AngusCowPrice;
        }
				
				//get island details
				function getAssetsDetails(uint256 _typeID) external view validations(_typeID) returns(
					uint256 _TypeID, 
					string memory _AssetName,
					uint256 _AssetPrice,
					uint256 _AssetQuantatyLeft
					){
						 _TypeID = _typeID;
						 if(_typeID == 1){
                            _AssetName = "Basic Hut";
							_AssetPrice = BasicHutPrice;
							_AssetQuantatyLeft = currentBasicHutSupply;

						 }
                          else if(_typeID == 2){
                            _AssetName = "Basic Shed";
							_AssetPrice = BasicShedPrice;
							_AssetQuantatyLeft = currentBasicShedSupply;

						 }
                          else if(_typeID == 3){
                            _AssetName = "Basic Barn";
							_AssetPrice = BasicBarnPrice;
							_AssetQuantatyLeft = currentBasicBarnSupply;

						 }
                          else if(_typeID == 4){
                            _AssetName = "Basic Greenhouse";
							_AssetPrice = BasicGreenhousePrice;
							_AssetQuantatyLeft = currentBasicGreenhouseSupply;

						 }
                          else if(_typeID == 5){
                            _AssetName = "Basic Barracks";
							_AssetPrice = BasicBarracksPrice;
							_AssetQuantatyLeft = currentBasicBarracksSupply;

						 }
                          else if(_typeID == 6){
                            _AssetName = "Basic Dock";
							_AssetPrice = BasicDockPrice;
							_AssetQuantatyLeft = currentBasicDockSupply;

						 }
                          else if(_typeID == 7){
                            _AssetName = "Basic Town Center";
							_AssetPrice = BasicTownCenterPrice;
							_AssetQuantatyLeft = currentBasicTownCenterSupply;

						 }
                          else if(_typeID == 8){
                            _AssetName = "Basic Fresh Water Well";
							_AssetPrice = BasicFreshWaterWellPrice;
							_AssetQuantatyLeft = currentBasicFreshWaterWellSupply;

						 }
                          else if(_typeID == 9){
                            _AssetName = "Brahama Bull";
							_AssetPrice = BrahamaBullPrice;
							_AssetQuantatyLeft = currentBrahamaBullSupply;

						 }
                          else if(_typeID == 10){
                            _AssetName = "Brahama Cow";
							_AssetPrice = BrahamaCowPrice;
							_AssetQuantatyLeft = currentBrahamaCowSupply;

						 }
                          else if(_typeID == 11){
                            _AssetName = "Angus Bull";
							_AssetPrice = AngusBullPrice;
							_AssetQuantatyLeft = currentAngusBullSupply;

						 }
                          else if(_typeID == 12){
                            _AssetName = "Angus Cow";
							_AssetPrice = AngusCowPrice;
							_AssetQuantatyLeft = currentAngusCowSupply;

						 }
				}
				
				function getTokenURIByTokenTypeID(uint256 _typeId) view external validations(_typeId) returns(string memory AssetURI){
					if(_typeId == 1){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Hut"},"description": {"type": "string","description": "Uses 250 squares of space. Stores 250 cubes. For avatar resting to restore health status, storage and personal property management."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Hut.png"}}}';
					}
					else if(_typeId == 2){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Shed"},"description": {"type": "string","description": "Uses 250 squares of space. Stores 750 cubes. For storage."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Shed.png "}}}';
					}
					else if(_typeId == 3){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Barn"},"description": {"type": "string","description": "Uses 500 squares of space. Houses 2 large animals or 6 small animals.Increases animal production by 10%. "},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Barn.png"}}}';
					}
					else if(_typeId == 4){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Greenhouse"},"description": {"type": "string","description": "Uses 500 squares of space. Grows 500 squares of crops.10% crop growth production boost. "},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Greenhouse.png"}}}';
					}
                    else if(_typeId == 5){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Barracks"},"description": {"type": "string","description": "Uses 2500 squares of space. Houses 100 troops. "},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Barracks.png"}}}';
					}
                    else if(_typeId == 6){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Dock"},"description": {"type": "string","description": "Uses 200 squares community land space & over water space. Allows visitors and imports from other islands. Community building."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Dock.png"}}}';
					}
                    else if(_typeId == 7){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Town Center"},"description": {"type": "string","description": "Uses 2500 squares of community space. Community management and 10,000 cubes community storage."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Town-Center.png"}}}';
					}
                    else if(_typeId == 8){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Basic Fresh Water Well"},"description": {"type": "string","description": "Uses 50 squares of community or personal land space.Provides fresh water to 50,000 squares proximity."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Basic-Fresh-Water-Well.png"}}}';
					}
                    else if(_typeId == 9){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Brahama Bull"},"description": {"type": "string","description": "Produces 3 cubes manure per day. Requires 6 corn or feed per 24 hours. 24 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Brahama-Bull.png"}}}';
					}
                    else if(_typeId == 10){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Brahama Cow"},"description": {"type": "string","description": " Produces 3 cubes manure per day, 1 jar milk per day. Requires 6 corn or feed per 24 hours. 60 day breeding period. 30 day cool down after calf birth. 500 lifetime births."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Brahama-Cow.png"}}}';
					}
                    else if(_typeId == 11){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Angus Bull"},"description": {"type": "string","description": "Produces 2 cubes manure per day. Requires 5 corn or feed per 24 hours. 24 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Angus-Bull.png"}}}';
					}
                    else if(_typeId == 12){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Angus Cow"},"description": {"type": "string","description": "Produces 2 cubes manure per day, 1 jar milk per day. Requires 5 corn or feed per 24 hours. 60 day breeding period. 30 day cool down after calf birth. 500 lifetime births."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Angus-Cow.png"}}}';
					}
				}
			function getAssetsAllDetails(uint256 _typeId) view external validations(_typeId) returns(
				    uint256 _currentPrice,
					string memory _totalSupply,
					uint256 _availableAssets,
					string memory _assetName,
					string memory _assetImage){
					if(_typeId == 1){
          _currentPrice = BasicHutPrice;
					_totalSupply = totalBasicHutSupply;
					_availableAssets = currentBasicHutSupply;
					_assetName = "Basic Hut";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Hut.png";
					}
					else if(_typeId == 2){
          _currentPrice = BasicShedPrice;
					_totalSupply = totalBasicShedSupply;
					_availableAssets = currentBasicShedSupply;
					_assetName = "Basic Shed";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Shed.png";
					}
                    else if(_typeId == 3){
          _currentPrice = BasicBarnPrice;
					_totalSupply = totalBasicBarnSupply;
					_availableAssets = currentBasicBarnSupply;
					_assetName = "Basic Barn";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Barn.png";
					}
                    else if(_typeId == 4){
          _currentPrice = BasicGreenhousePrice;
					_totalSupply = totalBasicGreenhouseSupply;
					_availableAssets = currentBasicGreenhouseSupply;
					_assetName = "Basic Greenhouse";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Greenhouse.png";
					}
                    else if(_typeId == 5){
          _currentPrice = BasicBarracksPrice;
					_totalSupply = totalBasicBarracksSupply;
					_availableAssets = currentBasicBarracksSupply;
					_assetName = "Basic Barracks";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Barracks.png";
					}
                    else if(_typeId == 6){
          _currentPrice = BasicDockPrice;
					_totalSupply = totalBasicDockSupply;
					_availableAssets = currentBasicDockSupply;
					_assetName = "Basic Dock";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Dock.png";
					}
                    else if(_typeId == 7){
          _currentPrice = BasicTownCenterPrice;
					_totalSupply = totalBasicTownCenterSupply;
					_availableAssets = currentBasicTownCenterSupply;
					_assetName = "Basic Town Center";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Town-Center.png";
					}
                    else if(_typeId == 8){
          _currentPrice = BasicFreshWaterWellPrice;
					_totalSupply = totalBasicFreshWaterWellSupply;
					_availableAssets = currentBasicFreshWaterWellSupply;
					_assetName = "Basic Fresh Water Well";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Basic-Fresh-Water-Well.png";
					}
                    else if(_typeId == 9){
          _currentPrice = BrahamaBullPrice;
					_totalSupply = totalBrahamaBullSupply;
					_availableAssets = currentBrahamaBullSupply;
					_assetName = "Brahama Bull";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Brahama-Bull.png";
					}
                    else if(_typeId == 10){
          _currentPrice = BrahamaCowPrice;
					_totalSupply = totalBrahamaCowSupply;
					_availableAssets = currentBrahamaCowSupply;
					_assetName = "Brahama Cow";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Brahama-Cow.png";
					}
                    else if(_typeId == 11){
          _currentPrice = AngusBullPrice;
					_totalSupply = totalBrahamaBullSupply;
					_availableAssets = currentAngusBullSupply;
					_assetName = "Angus Bull";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Angus-Bull.png";
					}
                    else if(_typeId == 12){
          _currentPrice = AngusCowPrice;
					_totalSupply = totalBrahamaCowSupply;
					_availableAssets = currentAngusCowSupply;
					_assetName = "Angus Cow";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Angus-Cow.png";
					}
			}

	    function sendTokenByOwner(uint _typeID, uint _Quantity, address _toAddress) external onlyOwner validations(_typeID) returns(bool _status){
		for(counter = 0; counter < _Quantity; counter ++){
			uint256 index = allTokens.length + 1;

        if(_typeID == 1 && currentBasicHutSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicHut.json";
            _title = "Basic Hut ";
            _description = "Uses 250 squares of space. Stores 250 cubes. For avatar resting to restore health status, storage and personal property management.";
            currentBasicHutSupply = currentBasicHutSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 2 && currentBasicShedSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicShed.json";
            _title = "Basic Shed";
            _description = "Uses 250 squares of space. Stores 750 cubes. For storage.";
            currentBasicShedSupply = currentBasicShedSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 3 && currentBasicBarnSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicBarn.json";
            _title = "Basic Barn";
            _description = "Uses 500 squares of space. Houses 2 large animals or 6 small animals.Increases animal production by 10%. ";
            currentBasicBarnSupply = currentBasicBarnSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 4 && currentBasicGreenhouseSupply > 0){
            uriString =  "http://admin.playaftermath.com/assets/images/contract/BasicGreenhouse.json";
            _title = "Basic Greenhouse";
            _description = "Uses 500 squares of space. Grows 500 squares of crops.10% crop growth production boost. ";
            currentBasicGreenhouseSupply = currentBasicGreenhouseSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 5 && currentBasicBarracksSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicBarracks.json";
            _title = "Basic Barracks";
            _description = "Uses 2500 squares of space. Houses 100 troops. ";
            currentBasicBarracksSupply = currentBasicBarracksSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 6 && currentBasicDockSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicDock.json";
            _title = "Basic Dock";
            _description = "Uses 200 squares community land space & over water space. Allows visitors and imports from other islands. Community building.";
            currentBasicDockSupply = currentBasicDockSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 7 && currentBasicTownCenterSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/Basic TownCenter.json";
            _title = "Basic Town Center";
            _description = "Uses 2500 squares of community space. Community management and 10,000 cubes community storage.";
            currentBasicTownCenterSupply = currentBasicTownCenterSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 8 && currentBasicFreshWaterWellSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BasicFreshWaterWell.json";
            _title = "Basic Fresh Water Well";
            _description = "Uses 50 squares of community or personal land space.Provides fresh water to 50,000 squares proximity.";
            currentBasicFreshWaterWellSupply = currentBasicFreshWaterWellSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 9 && currentBrahamaBullSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/Brahama Bull.json";
            _title = "Brahama Bull";
            _description = "Produces 3 cubes manure per day. Requires 6 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentBrahamaBullSupply = currentBrahamaBullSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 10 && currentBrahamaCowSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BrahamaCow.json";
            _title = "Brahama Cow";
            _description = " Produces 3 cubes manure per day, 1 jar milk per day. Requires 6 corn or feed per 24 hours. 60 day breeding period. 30 day cool down after calf birth. 500 lifetime births.";
            currentBrahamaCowSupply = currentBrahamaCowSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 11 && currentAngusBullSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/AngusBull.json";
            _title = "Angus Bull";
            _description = "Produces 2 cubes manure per day. Requires 5 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentAngusBullSupply = currentAngusBullSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 12 && currentAngusCowSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/AngusCow.json";
            _title = "Angus Cow";
            _description = "Produces 2 cubes manure per day, 1 jar milk per day. Requires 5 corn or feed per 24 hours. 60 day breeding period. 30 day cool down after calf birth. 500 lifetime births.";
            currentAngusCowSupply = currentAngusCowSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        
        /**Minting new coins dynamically and set the URI value based on the input number */
		total = tokenHoldersById[_toAddress][_typeID] + 1;
		tokenHoldersById[_toAddress][_typeID] = total;
				
        _mint(_toAddress, index);
        _setTokenURI(index,uriString);
		tokenTypes[index] = _typeID;
		tokenTitles[index] = _title;
		tokenDescription[index] = _description;
		emit BoughtToken(_toAddress, index);
			}
        return true;
			}
	
	  function myTokensDetails() external view returns (
		uint256[] memory
	  ){
		  uint256 count;
		  uint256[] memory data = new uint256[](ownedTokens[msg.sender].length);
		  uint256 l;
		  uint256[] memory counters = ownedTokens[msg.sender];
		  for(count = 0; count < ownedTokens[msg.sender].length; count ++){
			  l = counters[count];
		  data[count] = tokenTypes[l];
	      }
	      return data;
	  }
}