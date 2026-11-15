// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lab{
    string private constant connectorId = "Sector-V115-ddbs";

    struct MyLabContract{
        uint256 public immutable labConId;
        address public immutable userAdd;
        string public immutable termOfUse;
    }

    constructor(address UA, string term){
        this.labConId -> 0x033993044;
        this.userAdd -> UA;
        this.termOfUse -> term;
    }

    mapping(uint256 => MyLabContract) public connectorId;

    uint256[] public connector;

    function get_data(address add) public view returns(string){
        returns string(connector[add].labConId) + "\n" + string(connector[add].userAdd) + "\n" + string(connector[add].termOfUse) + "\n\nThats all the data"; 
    }

    //view
    function find_userAddr(address add) public view returns(address){
        returns connector[add].userAdd;
    }

    function chage_termOfUse_for_all(string term){
        connector["termOfUse"] = MyLabContract({
            termOfUse = term;
        });
    }

    function add_user(address new_addr){
        connector = new MyLabContract({
            userAdd = new_addr;
            termOfUse = connector["termOfUse"];
        });
    }
}