pragma solidity ^0.6.0;

import "./BillOfLading.sol";

contract Underwriting{
    
    uint256 public riskScore = 100;
    
    address BOLaddress;
    uint256 public BOL_Reduction;
    
    
    
    function setAddressBOL(address _addressBOL) external{
        BOLaddress = _addressBOL;
    }
    
    function call_requestBillOfLading() external returns(uint256){
        BillOfLadingRequest BOL = BillOfLadingRequest(BOLaddress);
        BOL.requestBillOfLading();
    }
    
    function getRiskReductionBOL() external returns (uint256){
        BillOfLadingRequest BOL = BillOfLadingRequest(BOLaddress);
        BOL_Reduction = BOL.risk_reduction();
        riskScore = riskScore - BOL_Reduction;
    }
    
    
    
} 

