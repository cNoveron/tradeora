pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";
//import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/interfaces/LinkTokenInterface.sol";

contract Vessels is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    string public API_URL;
    //mapping(bytes32 => uint256) public riskScore_from;
    uint256 public riskScore;
    uint256 public dayOfTheMonth;
    bytes32 public plainResponse;

    address linkTokenAddress;

/*
    _oracle = 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455;
    _jobId = "c128fbb0175442c8ba828040fdd1a25e";
    _API_URL = https://services.marinetraffic.com/api/exportvessels/v:8/a8e59d94b1bcaaa16cbd7651b975340351ce1672/timespan:60/msgtype:extended/protocol:jsono;
*/
    constructor(string memory _API_URL) 
    public {
    	setPublicChainlinkToken();
    	oracle = 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455; // oracle address
    	jobId = "c128fbb0175442c8ba828040fdd1a25e";
    	API_URL = _API_URL;
    	fee = 0.1 * 10 ** 18; // 0.1 LINK
    	/*
    	uint256 initialFunding = fee * 10;
    	linkTokenAddress = chainlinkTokenAddress();
    	LinkTokenInterface link =  LinkTokenInterface(linkTokenAddress);
    	link.approve(msg.sender, initialFunding);
    	link.transferFrom(msg.sender, address(this), initialFunding);
    	*/
    }
    
    function evalRiskScore(string memory path)
    public {
    	Chainlink.Request memory req = buildChainlinkRequest(
    	    jobId,
    	    address(this),
    	    this.fulfill.selector
    	);
    	string memory URI = appendPath(path);
    	req.add("get", URI);
    	req.add("path", "ETA");
    	sendChainlinkRequestTo(oracle, req, fee);
    }
    
    function fulfill(bytes32 _requestId, bytes32 response)
    public {
        plainResponse = response;
        dayOfTheMonth = uint256(bytes32(bytes2(response << 5)));
    }
    
    function setAPI_URL(string memory URL) 
    public {
    	API_URL = URL;
    }

    function appendPath(string memory endpoint) 
    private view returns (string memory) {
        return string(abi.encodePacked(API_URL,"/",endpoint));
    }
    
    function appendFirstPram(string memory URL_withEndpoint, string memory paramKey, string memory paramVal) 
    private pure returns (string memory) {
        return string(abi.encodePacked(URL_withEndpoint,"?",paramKey,"=",paramVal));
    }
    
    function appendPrams(string memory URL_withFirstPram, string memory paramKey, string memory paramVal) 
    private pure returns (string memory) {
        return string(abi.encodePacked(URL_withFirstPram,"&",paramKey,"=",paramVal));
    }
}