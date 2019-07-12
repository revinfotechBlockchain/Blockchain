pragma solidity ^0.4.25;
/**
 * @title SafeMath
 * @dev Unsigned math operations with safety checks that revert on error
 */
library SafeMath {
    /**
    * @dev Multiplies two unsigned integers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
    * @dev Adds two unsigned integers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}


/**
 * @title Ownable
 * @dev The Ownable contract has the owner address, and provides basic authorization 
 * control functions, this simplifies the implementation of "user permissions"
 */
contract Ownable {
    address private _owner;
    bool    public lockstatus;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @return the address of the owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
    /**
     * @dev Set the lock status for the contracts.
     * @param RunningStatusLock The address to transfer ownership to.
     */
    function setLockStatus(bool RunningStatusLock) external onlyOwner
    {
        lockstatus = RunningStatusLock;
    }
}

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract AfterMathIslands is Ownable,IERC20
{
    using SafeMath for uint256;
    string  public name;
    string  public symbol;
    uint256 public decimals;
    uint256 public totalSupply;
    uint256 public Price;
    bool    public mintedbonusPool;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => uint) balances;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) public
    {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        lockstatus = false;
        balances[owner()] = totalSupply;
        emit Transfer(address(0), owner(), balances[owner()]);
        mintedbonusPool = true;
    }
    function setPrice(uint256 _Price) external onlyOwner returns (bool status){
           Price = _Price;
           return true;
    }
    function getCurrentPrice() external view returns(uint256 _Price){
            _Price = Price;
    }
    function getAllDetails() view external returns(
                    uint256 _currentPrice,
					uint256 Supply,
					uint256 _available,
					string memory _Name,
					string memory _Image){
                    _currentPrice = Price;
					 Supply = totalSupply;
					_available = balances[owner()];
					_Name = "BantamHen";
					_Image = "http://admin.playaftermath.com/assets/images/contract/Bantam-Hen.png";
	}
    function myTokens() external view returns (uint256)
	{
		return balances[msg.sender];
	}
    function sendTokenByOwner(uint _Quantity, address _toAddress) external onlyOwner{
        balances[msg.sender] = balances[msg.sender].sub(_Quantity);
        balances[_toAddress] = balances[_toAddress].add(_Quantity);
        emit Transfer(msg.sender, _toAddress, _Quantity);
    }
    function buyToken(
        uint256 _tokenAmount
	  ) external payable returns(bool){
        require(msg.value >= Price.mul(_tokenAmount),"Less amount sent");
        require(Price > 0,"Insufficient amount");
        balances[owner()] = balances[owner()].sub(_tokenAmount);
        balances[msg.sender] = balances[msg.sender].add(_tokenAmount);
        emit Transfer(owner(), msg.sender, _tokenAmount);
        return true;
	}
    function withdrawAllAmount() external onlyOwner returns (bool resp){
        msg.sender.transfer(address(this).balance);
        return true;
    }
    function balanceOf(address tokenOwner) public view returns(uint256 balance) {
        return balances[tokenOwner];
    }
    function totalSupply() public view returns(uint256){
        return totalSupply;
    }
    function allowance(address tokenOwner, address spender) public view returns(uint256 remaining)
    {
        require(tokenOwner != address(0x0) && spender != address(0x0),"Incorrect Adddress");
        return allowed[tokenOwner][spender];
    }
    function approve(address _spender, uint256 _value) public returns(bool) {
        require(_spender != address(0),"Incorrect Address");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }
    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(_to != address(0) && !lockstatus,"Incorrect Address");
        require(balances[owner()] >= _value,"Insufficient Balance");
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _tokens) public returns(bool success)
    {
        require(balances[_from] >= _tokens && allowed[_from][msg.sender] >= _tokens && _tokens >= 0 && !lockstatus && _to != address(0x0),"Invalid");
        balances[_from] = balances[_from].sub(_tokens);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_tokens);
        balances[_to] = balances[_to].add(_tokens);
        emit Transfer(_from, _to, _tokens);
        return true;
    }
    function burn(uint256 value) external onlyOwner {
        totalSupply = totalSupply.sub(value);
        balances[msg.sender] = balances[msg.sender].sub(value);
        emit Transfer(msg.sender, address(0), value);
    }
    function burnFrom(address from, uint256 value) public onlyOwner {
        totalSupply = totalSupply.sub(value);
        balances[from] = balances[from].sub(value);
        emit Transfer(from, address(0), value);
    }
    function mint(uint256 _value) public onlyOwner returns(bool success){
        require(_value > 0,"The amount should be greater than 0");
        balances[msg.sender] = balances[msg.sender].add(_value);
        totalSupply = totalSupply.add(_value);
        emit Transfer(address(0), msg.sender, _value);
        return true;
    }
}