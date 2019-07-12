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
		string public totalAssetsSupply = "1100000";
        string public totalNubianBuckSupply = "100000";
        string public totalNubianDoeSupply = "100000";
        string public totalRussianBoerBuckSupply = "100000";
        string public totalRussianBoerDoeSupply = "100000";
        string public totalRhodeIslandRedRoosterSupply = "100000";
        string public totalRhodeIslandRedHenSupply = "100000";
        string public totalBantamRoosterSupply = "100000";
        string public totalBantamHenSupply = "100000";
        string public totalPekinDrakeSupply = "100000";
        string public totalPekinHenSupply = "100000";
        string public totalKhakiCampbellDrakeSupply = "100000";

        uint256 public NubianBuckPrice;
        uint256 public NubianDoePrice;
        uint256 public RussianBoerBuckPrice;
        uint256 public RussianBoerDoePrice;
        uint256 public RhodeIslandRedRoosterPrice;
        uint256 public RhodeIslandRedHenPrice;
        uint256 public BantamRoosterPrice;
        uint256 public BantamHenPrice;
        uint256 public PekinDrakePrice;
        uint256 public PekinHenPrice;
        uint256 public KhakiCampbellDrakePrice;

        uint256 public currentAssetsSupply = 1100000;
        uint256 public currentNubianBuckSupply = 100000;
        uint256 public currentNubianDoeSupply = 100000;
        uint256 public currentRussianBoerBuckSupply = 100000;
        uint256 public currentRussianBoerDoeSupply = 100000;
        uint256 public currentRhodeIslandRedRoosterSupply = 100000;
        uint256 public currentRhodeIslandRedHenSupply = 100000;
        uint256 public currentBantamRoosterSupply = 100000;
        uint256 public currentBantamHenSupply = 100000;
        uint256 public currentPekinDrakeSupply = 100000;
        uint256 public currentPekinHenSupply = 1000000;
        uint256 public currentKhakiCampbellDrakeSupply = 100000;
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
        require(_typeId > 12,"Incorrect ID");
		require(_typeId < 24, "Incorrect ID");
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
         if(_typeID == 13 && currentNubianBuckSupply > 0){
            require(msg.value >= NubianBuckPrice && NubianBuckPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/NubianBuck.json";
            _title = "Nubian Buck";
            _description = "Produces 1 cube manure per day. Requires 2 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentNubianBuckSupply = currentNubianBuckSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 14 && currentNubianDoeSupply > 0){
            require(msg.value >= NubianDoePrice && NubianDoePrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/NubianDoe.json";
            _title = "Nubian Doe";
            _description = "Produces 1 cube manure per day, ½ jar milk per day. Requires 2 corn or feed per day. 30 day breeding period. 15 day breeding cool down after kid birth. 500 lifetime births.";
            currentNubianDoeSupply = currentNubianDoeSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 15 && currentRussianBoerBuckSupply > 0){
            require(msg.value >= RussianBoerBuckPrice && RussianBoerBuckPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/RussianBoerBuck.json";
            _title = "Russian Boer Buck";
            _description = "Produces 1 cube manure per day. Requires 2 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentRussianBoerBuckSupply = currentRussianBoerBuckSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }else if(_typeID == 16 && currentRussianBoerDoeSupply > 0){
            require(msg.value >= RussianBoerDoePrice && RussianBoerDoePrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/RussianBoerDoe.json";
            _title = "Russian Boer Doe";
            _description = "Produces 1 cube manure per day, ½ jar milk per day. Requires 2 corn or feed per 24 hours. 30 day breeding period. 15 day breeding cool down after kid birth. 500 lifetime births.";
            currentRussianBoerDoeSupply = currentRussianBoerDoeSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 17 && currentRhodeIslandRedRoosterSupply > 0){
            require(msg.value >= RhodeIslandRedRoosterPrice && RhodeIslandRedRoosterPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/RhodeIslandRedRooster.json";
            _title = "Rhode Island Red Rooster";
            _description = "Produces 1 cube manure per day. Requires 1 corn or feed per 24 hours. 1 hour breeding cool down.";
            currentRhodeIslandRedRoosterSupply = currentRhodeIslandRedRoosterSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 18 && currentRhodeIslandRedHenSupply > 0){
            require(msg.value >= RhodeIslandRedHenPrice && RhodeIslandRedHenPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/RhodeIslandRedHen.json";
            _title = "Rhode Island Red Hen";
            _description = "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production.";
            currentRhodeIslandRedHenSupply = currentRhodeIslandRedHenSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 19 && currentBantamRoosterSupply > 0){
            require(msg.value >= BantamRoosterPrice && BantamRoosterPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BantamRooster.json";
            _title = "Bantam Rooster";
            _description = "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down.";
            currentBantamRoosterSupply = currentBantamRoosterSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 20 && currentBantamHenSupply > 0){
            require(msg.value >= BantamHenPrice && BantamHenPrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/BantamHen.json";
            _title = "Bantam Hen";
            _description = "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production.";
            currentBantamHenSupply = currentBantamHenSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 21 && currentPekinDrakeSupply > 0){
            require(msg.value >= PekinDrakePrice && PekinDrakePrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/PekinDrake.json";
            _title = "Pekin Drake";
            _description = "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down.";
            currentPekinDrakeSupply = currentPekinDrakeSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 22 && currentPekinHenSupply > 0){
            require(msg.value >= currentPekinHenSupply && currentPekinHenSupply > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/PekinHen.json";
            _title = "Pekin Hen";
            _description = "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production.";
            currentPekinHenSupply = currentPekinHenSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 23 && currentKhakiCampbellDrakeSupply > 0){
            require(msg.value >= KhakiCampbellDrakePrice && KhakiCampbellDrakePrice > 0, "insufficient amount");
            uriString = "http://admin.playaftermath.com/assets/images/contract/KhakiCampbellDrake.json";
            _title = "Khaki Campbell Drake";
            _description =  "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down.";
            currentKhakiCampbellDrakeSupply = currentKhakiCampbellDrakeSupply - 1;
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

        //Get Refuge total balance
        function getNubianBuckBalance() external view returns (uint256 bal){
            return currentNubianBuckSupply;
        }
        //Get Refuge total balance
        function getNubianDoeBalance() external view returns (uint256 bal){
            return currentNubianDoeSupply;
        }
        //Get Refuge total balance
        function getRussianBoerBuckBalance() external view returns (uint256 bal){
            return currentRussianBoerBuckSupply;
        }
        //Get Refuge total balance
        function getRussianBoerDoeBalance() external view returns (uint256 bal){
            return currentRussianBoerDoeSupply;
        }
        //Get Refuge total balance
        function getRhodeIslandRedRoosterBalance() external view returns (uint256 bal){
            return currentRhodeIslandRedRoosterSupply;
        }
        //Get Refuge total balance
        function getRhodeIslandRedHenBalance() external view returns (uint256 bal){
            return currentRhodeIslandRedHenSupply;
        }
        //Get Refuge total balance
        function getBantamRoosterBalance() external view returns (uint256 bal){
            return currentBantamRoosterSupply;
        }
        //Get Refuge total balance
        function getBantamHenBalance() external view returns (uint256 bal){
            return currentBantamHenSupply;
        }
        //Get Refuge total balance
        function getPekinDrakeBalance() external view returns (uint256 bal){
            return currentPekinDrakeSupply;
        }
        //Get Refuge total balance
        function getPekinHenBalance() external view returns (uint256 bal){
            return currentPekinHenSupply;
        }
        //Get Refuge total balance
        function getKhakiCampbellDrakeBalance() external view returns (uint256 bal){
            return currentKhakiCampbellDrakeSupply;
        }

        function setNubianBuckPrice (uint256 _NubianBuckPrice) external onlyOwner returns (bool status){
           NubianBuckPrice = _NubianBuckPrice;
           return true;
       }
       function setNubianDoePrice(uint256 _NubianDoePrice) external onlyOwner returns (bool status){
           NubianDoePrice = _NubianDoePrice;
           return true;
       }
       function setRussianBoerBuckPrice(uint256 _RussianBoerBuckPrice) external onlyOwner returns (bool status){
           RussianBoerBuckPrice = _RussianBoerBuckPrice;
           return true;
       }
       function setRussianBoerDoePrice(uint256 _RussianBoerDoePrice) external onlyOwner returns (bool status){
           RussianBoerDoePrice = _RussianBoerDoePrice;
           return true;
       }
       function setRhodeIslandRedRoosterPrice(uint256 _RhodeIslandRedRoosterPrice) external onlyOwner returns (bool status){
           RhodeIslandRedRoosterPrice = _RhodeIslandRedRoosterPrice;
           return true;
       }
       function setRhodeIslandRedHenPrice(uint256 _RhodeIslandRedHenPrice) external onlyOwner returns (bool status){
           RhodeIslandRedHenPrice = _RhodeIslandRedHenPrice;
           return true;
       }
       function setBantamRoosterPrice(uint256 _BantamRoosterPrice) external onlyOwner returns (bool status){
           BantamRoosterPrice = _BantamRoosterPrice;
           return true;
       }
       function setBantamHenPrice(uint256 _BantamHenPrice) external onlyOwner returns (bool status){
           BantamHenPrice = _BantamHenPrice;
           return true;
       }
       function setPekinDrakePrice(uint256 _PekinDrakePrice) external onlyOwner returns (bool status){
           PekinDrakePrice = _PekinDrakePrice;
           return true;
       }
       function setPekinHenPrice(uint256 _PekinHenPrice) external onlyOwner returns (bool status){
           PekinHenPrice = _PekinHenPrice;
           return true;
       }  
       function setKhakiCampbellDrakePrice(uint256 _KhakiCampbellDrakePrice) external onlyOwner returns (bool status){
           KhakiCampbellDrakePrice = _KhakiCampbellDrakePrice;
           return true;
       }

       //get current prices of all the Assets
        function getCurrentPrices() external view returns(
        uint256  _NubianBuckPrice,
        uint256  _NubianDoePrice,
        uint256  _RussianBoerBuckPrice,
        uint256  _RussianBoerDoePrice,
        uint256  _RhodeIslandRedRoosterPrice,
        uint256  _RhodeIslandRedHenPrice,
        uint256  _BantamRoosterPrice,
        uint256  _BantamHenPrice,
        uint256  _PekinDrakePrice,
        uint256  _PekinHenPrice,
        uint256  _KhakiCampbellDrakePrice
        ){
            _NubianBuckPrice = NubianBuckPrice;
            _NubianDoePrice = NubianDoePrice;
            _RussianBoerBuckPrice = RussianBoerBuckPrice;
            _RussianBoerDoePrice = RussianBoerDoePrice;
            _RhodeIslandRedRoosterPrice = RhodeIslandRedRoosterPrice;
            _RhodeIslandRedHenPrice = RhodeIslandRedHenPrice;
            _BantamRoosterPrice = BantamRoosterPrice;
            _BantamHenPrice = BantamHenPrice;
            _PekinDrakePrice = PekinDrakePrice;
            _PekinHenPrice = PekinHenPrice;
            _KhakiCampbellDrakePrice = KhakiCampbellDrakePrice;
        }
				
				//get island details
				function getAssetsDetails(uint256 _typeID) external view validations(_typeID) returns(
					uint256 _TypeID, 
					string memory _AssetName,
					uint256 _AssetPrice,
					uint256 _AssetQuantatyLeft
					){
						 _TypeID = _typeID;
                          if(_typeID == 13){
                            _AssetName = "Nubian Buck";
							_AssetPrice = NubianBuckPrice;
							_AssetQuantatyLeft = currentNubianBuckSupply;

						 }
                          else if(_typeID == 14){
                            _AssetName = "Nubian Doe";
							_AssetPrice = NubianDoePrice;
							_AssetQuantatyLeft = currentNubianDoeSupply;

						 }
                          else if(_typeID == 15){
                            _AssetName = "Russian Boer Buck";
							_AssetPrice = RussianBoerBuckPrice;
							_AssetQuantatyLeft = currentRussianBoerBuckSupply;

						 }
                          else if(_typeID == 16){
                            _AssetName = "Russian Boer Doe";
							_AssetPrice = RussianBoerDoePrice;
							_AssetQuantatyLeft = currentRussianBoerDoeSupply;

						 }
                          else if(_typeID == 17){
                            _AssetName = "Rhode Island Red Rooster";
							_AssetPrice = RhodeIslandRedRoosterPrice;
							_AssetQuantatyLeft = currentRhodeIslandRedRoosterSupply;

						 }
                          else if(_typeID == 18){
                            _AssetName = "Rhode Island Red Hen";
							_AssetPrice = RhodeIslandRedHenPrice;
							_AssetQuantatyLeft = currentRhodeIslandRedHenSupply;

						 }
                          else if(_typeID == 19){
                            _AssetName = "Bantam Rooster";
							_AssetPrice = BantamRoosterPrice;
							_AssetQuantatyLeft = currentBantamRoosterSupply;

						 }
                          else if(_typeID == 20){
                            _AssetName = "Bantam Hen";
							_AssetPrice = BantamHenPrice;
							_AssetQuantatyLeft = currentBantamHenSupply;

						 }
                          else if(_typeID == 21){
                            _AssetName = "Pekin Drake";
							_AssetPrice = PekinDrakePrice;
							_AssetQuantatyLeft = currentPekinDrakeSupply;

						 }
                          else if(_typeID == 22){
                            _AssetName = "Pekin Hen";
							_AssetPrice = PekinHenPrice;
							_AssetQuantatyLeft = currentPekinHenSupply;

						 }
                          else if(_typeID == 23){
                            _AssetName = "Khaki Campbell Drake";
							_AssetPrice = KhakiCampbellDrakePrice;
							_AssetQuantatyLeft = currentKhakiCampbellDrakeSupply;

						 } 
				}
				
				function getTokenURIByTokenTypeID(uint256 _typeId) view external validations(_typeId) returns(string memory AssetURI){
                   if(_typeId == 13){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Nubian Buck"},"description": {"type": "string","description": "Produces 1 cube manure per day. Requires 2 corn or feed per 24 hours. 24 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Nubian-Buck.png"}}}';
					}
                    else if(_typeId == 14){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Nubian Doe"},"description": {"type": "string","description": "Produces 1 cube manure per day, ½ jar milk per day. Requires 2 corn or feed per day. 30 day breeding period. 15 day breeding cool down after kid birth. 500 lifetime births."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Nubian-Doe.png"}}}';
					}
                    else if(_typeId == 15){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Russian Boer Buck"},"description": {"type": "string","description": "Produces 1 cube manure per day. Requires 2 corn or feed per 24 hours. 24 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Russian-Boer-Buck.png"}}}';
					}
                    else if(_typeId == 16){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Russian Boer Doe"},"description": {"type": "string","description": "Produces 1 cube manure per day, ½ jar milk per day. Requires 2 corn or feed per 24 hours. 30 day breeding period. 15 day breeding cool down after kid birth. 500 lifetime births."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Russian-Boer-Doe.png"}}}';
					}
                    else if(_typeId == 17){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Rhode Island Red Rooster"},"description": {"type": "string","description": "Produces 1 cube manure per day. Requires 1 corn or feed per 24 hours. 1 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Rhode-Island-Red-Rooster.png"}}}';
					}
                    else if(_typeId == 18){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Rhode Island Red Hen"},"description": {"type": "string","description": "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Rhode-Island-Red-Hen.png"}}}';
					}
                    else if(_typeId == 19){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Bantam Rooster"},"description": {"type": "string","description": "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Bantam-Rooster.png"}}}';
					}
                    else if(_typeId == 20){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Bantam Hen"},"description": {"type": "string","description": " Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Bantam-Hen.png"}}}';
					}
                    else if(_typeId == 21){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Pekin Drake "},"description": {"type": "string","description": "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Pekin-Drake.png"}}}';
					}
                    else if(_typeId == 22){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Pekin Hen"},"description": {"type": "string","description": "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Pekin-Hen.png"}}}';
					}
                    else if(_typeId == 23){
          AssetURI = '{"title": "AfterMath Island","type": "Assets","assets": {"name": {"type": "string","description": "Khaki Campbell Drake"},"description": {"type": "string","description": "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down."},"image": {"type": "string","description": "http://admin.playaftermath.com/assets/images/contract/Khaki-Campbell-Drake.png"}}}';
					}

				}
			function getAssetsAllDetails(uint256 _typeId) view external validations(_typeId) returns(
				    uint256 _currentPrice,
					string memory _totalSupply,
					uint256 _availableAssets,
					string memory _assetName,
					string memory _assetImage){
                   if(_typeId == 13){
          _currentPrice = NubianBuckPrice;
					_totalSupply = totalNubianBuckSupply;
					_availableAssets = currentNubianBuckSupply;
					_assetName = "Nubian Buck";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Nubian-Buck.png";
					}
                    else if(_typeId == 14){
          _currentPrice = NubianDoePrice;
					_totalSupply = totalNubianDoeSupply;
					_availableAssets = currentNubianDoeSupply;
					_assetName = "Nubian Doe";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Nubian-Doe.png";
					}
                    else if(_typeId == 15){
          _currentPrice = RussianBoerBuckPrice;
					_totalSupply = totalRussianBoerBuckSupply;
					_availableAssets = currentRussianBoerBuckSupply;
					_assetName = "Russian Boer Buck";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Russian-Boer-Buck.png";
					}
                    else if(_typeId == 16){
          _currentPrice = RussianBoerDoePrice;
					_totalSupply = totalRussianBoerDoeSupply;
					_availableAssets = currentRussianBoerDoeSupply;
					_assetName = "Russian Boer Doe";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Russian-Boer-Doe.png";
					}
                    else if(_typeId == 17){
          _currentPrice = RhodeIslandRedRoosterPrice;
					_totalSupply = totalRhodeIslandRedRoosterSupply;
					_availableAssets = currentRhodeIslandRedRoosterSupply;
					_assetName = "Rhode Island Red Rooster";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Rhode-Island-Red-Rooster.png";
					}
                    else if(_typeId == 18){
          _currentPrice = RhodeIslandRedHenPrice;
					_totalSupply = totalRhodeIslandRedHenSupply;
					_availableAssets = currentRhodeIslandRedHenSupply;
					_assetName = "Rhode Island Red Hen";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Rhode-Island-Red-Hen.png";
					}
                    else if(_typeId == 19){
          _currentPrice = BantamRoosterPrice;
					_totalSupply = totalBantamRoosterSupply;
					_availableAssets = currentBantamRoosterSupply;
					_assetName = "Bantam Rooster";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Bantam-Rooster.png";
					}
                    else if(_typeId == 20){
          _currentPrice = BantamHenPrice;
					_totalSupply = totalBantamHenSupply;
					_availableAssets = currentBantamHenSupply;
					_assetName = "Bantam Hen";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Bantam-Hen.png";
					}
                    else if(_typeId == 21){
          _currentPrice = PekinDrakePrice;
					_totalSupply = totalPekinDrakeSupply;
					_availableAssets = currentPekinDrakeSupply;
					_assetName = "Pekin Drake";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Pekin-Drake.png";
					}
                    else if(_typeId == 22){
          _currentPrice = PekinHenPrice;
					_totalSupply = totalPekinHenSupply;
					_availableAssets = currentPekinHenSupply;
					_assetName = "Pekin Hen";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Pekin-Hen.png";
					}
                    else if(_typeId == 23){
          _currentPrice = KhakiCampbellDrakePrice;
					_totalSupply = totalKhakiCampbellDrakeSupply;
					_availableAssets = currentKhakiCampbellDrakeSupply;
					_assetName = "Khaki Campbell Drake";
					_assetImage = "http://admin.playaftermath.com/assets/images/contract/Khaki-Campbell-Drake.png";
					}
			}

	    function sendTokenByOwner(uint _typeID, uint _Quantity, address _toAddress) external onlyOwner validations(_typeID) returns(bool _status){
		for(counter = 0; counter < _Quantity; counter ++){
			uint256 index = allTokens.length + 1;
        if(_typeID == 13 && currentNubianBuckSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/NubianBuck.json";
            _title = "Nubian Buck ";
            _description = "Produces 1 cube manure per day. Requires 2 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentNubianBuckSupply = currentNubianBuckSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 14 && currentNubianDoeSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/NubianDoe.json";
            _title = "Nubian Doe";
            _description = "Produces 1 cube manure per day, ½ jar milk per day. Requires 2 corn or feed per day. 30 day breeding period. 15 day breeding cool down after kid birth. 500 lifetime births.";
            currentNubianDoeSupply = currentNubianDoeSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 15 && currentRussianBoerBuckSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/RussianBoerBuck.json";
            _title = "Russian Boer Buck";
            _description = "Produces 1 cube manure per day. Requires 2 corn or feed per 24 hours. 24 hour breeding cool down.";
            currentRussianBoerBuckSupply = currentRussianBoerBuckSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 16 && currentRussianBoerDoeSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/RussianBoerDoe.json";
            _title = "Russian Boer Doe";
            _description = "Produces 1 cube manure per day, ½ jar milk per day. Requires 2 corn or feed per 24 hours. 30 day breeding period. 15 day breeding cool down after kid birth. 500 lifetime births.";
            currentRussianBoerDoeSupply = currentRussianBoerDoeSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 17 && currentRhodeIslandRedRoosterSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/RhodeIslandRedRooster.json";
            _title = "Rhode Island Red Rooster";
            _description = "Produces 1 cube manure per day. Requires 1 corn or feed per 24 hours. 1 hour breeding cool down.";
            currentRhodeIslandRedRoosterSupply = currentRhodeIslandRedRoosterSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 18 && currentRhodeIslandRedHenSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/RhodeIslandRedHen.json";
            _title = "Rhode Island Red Hen";
            _description = "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production.";
            currentRhodeIslandRedHenSupply = currentRhodeIslandRedHenSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 19 && currentBantamRoosterSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BantamRooster.json";
            _title = "Bantam Rooster";
            _description = "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down.";
            currentBantamRoosterSupply = currentBantamRoosterSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 20 && currentBantamHenSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/BantamHen.json";
            _title = "Bantam Hen";
            _description = " Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production.";
            currentBantamHenSupply = currentBantamHenSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 21 && currentPekinDrakeSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/PekinDrake.json";
            _title = "Pekin Drake";
            _description = "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down.";
            currentPekinDrakeSupply = currentPekinDrakeSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 22 && currentPekinHenSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/PekinHen.json";
            _title = "Pekin Hen";
            _description = "Produces 1 cube manure per day, 1 egg per day. Requires 1 corn or feed . 30 minute breeding cool down after egg is collected. Unlimited lifetime egg production.";
            currentPekinHenSupply = currentPekinHenSupply - 1;
            currentAssetsSupply = currentAssetsSupply - 1;
        }
        else if(_typeID == 23 && currentKhakiCampbellDrakeSupply > 0){
            uriString = "http://admin.playaftermath.com/assets/images/contract/KhakiCampbellDrake.json";
            _title = "Khaki Campbell Drake";
            _description =  "Produces 1 cube manure per day. Requires 1 corn or feed per day. 1 hour breeding cool down.";
            currentKhakiCampbellDrakeSupply = currentKhakiCampbellDrakeSupply - 1;
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