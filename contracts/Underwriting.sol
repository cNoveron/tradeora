pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "./BOL.sol";
import "./LinkPoolClient.sol";

contract Underwriting{
    
    uint256 public riskScore = 100;
    string public LoanRequest; 
    
   //importing Finacials variables
    address FINAddress;
    uint256 public FIN_Reduction;
    
   //importing Bill of Lading variables
    address BOLAddress;
    uint256 public BOL_Reduction;
    
    
    //set Contract Addresses for API function call contracts
    
    function setAddressBOL(address _addressBOL,address _addressFIN) external{
        BOLAddress = _addressBOL;
        FINAddress = _addressFIN;
    }
    
    //1. Call Financials Contract and get risk_reduction 
    function call_requestFinancialRiskReduction(string memory tradeID, string memory loanAmount) internal{
        riskScore = 100;
        LoanRequest = loanAmount;
        LinkPoolClient FIN = LinkPoolClient(FINAddress);
        FIN.evalRiskScore(tradeID, loanAmount);
    }
    
    function call_requestBillOfLading() internal returns(uint256){
        BillOfLadingRequest BOL = BillOfLadingRequest(BOLAddress);
        BOL.requestBillOfLading();
    }
    
    function getRiskReductionFIN() internal returns(uint256){
        LinkPoolClient FIN = LinkPoolClient(FINAddress);
        FIN_Reduction = FIN.riskScore();
        riskScore = riskScore - FIN_Reduction;
    }
    
    function getRiskReductionBOL() internal returns (uint256){
        BillOfLadingRequest BOL = BillOfLadingRequest(BOLAddress);
        BOL_Reduction = BOL.risk_reduction();
        riskScore = riskScore - BOL_Reduction;
    }
      
     
    function batchcall_APIs(string memory tradeID, string memory loanAmount) public{
        call_requestFinancialRiskReduction(tradeID, loanAmount);
        call_requestBillOfLading();
        
        getRiskReductionFIN();
        getRiskReductionBOL();
    }
    
    
} 

