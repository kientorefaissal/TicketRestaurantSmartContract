//var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
/*var account;
var listaccounts;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})*/

abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tiketsList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tiket","type":"bytes32"}],"name":"indexOfTiket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokensSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tiket","type":"bytes32"}],"name":"totalBoughtFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allTikets","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"clientInfo","outputs":[{"name":"clientAddress","type":"address"},{"name":"tokensBought","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"clientDetails","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"tikets","type":"uint256"}],"name":"transferTikets","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"sellsReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tiket","type":"bytes32"},{"name":"tokensUsed","type":"uint256"}],"name":"consumTikets","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"balanceTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"tokens","type":"uint256"},{"name":"pricePerToken","type":"uint256"},{"name":"tiketsNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');

contract = new web3.eth.Contract(abi);
contract.options.address = "0xdd7D26D1c9180c03B049599C30C74f33560c9a9c";
// update this contract address with your contract address

tickets = {"tiket bleu": "ticket-bleu", "tiket blanc": "ticket-blanc"};

function BuyTokens() {
    ethUsed = $("#nbrethtobuy").val();
    clientaccount = $("#adressBuyer").val();

    contract.methods.buy().send({from: clientaccount, value: web3.utils.toWei(ethUsed, 'ether')}).then((f) => {
        location.reload();
    });
}

function transferTokens() {
    nbrtokens = $("#nbrethtotransfert").val();
    adresssender = $("#adresssender").val();
    adressreceiver = $("#adressreceiver").val();

    contract.methods.transferTikets(adressreceiver, nbrtokens).send({from: adresssender}).then((f) => {
        location.reload();
    });
}

function consumTikets() {
    ticketName = $("#tickettoconsum").val();
    tokensUsed = $("#nbrticketstoconsum").val();
    clientaccount = $("#adressconsumer").val();
    //console.log(ticketName);

    contract.methods.consumTikets(web3.utils.asciiToHex(ticketName), tokensUsed).send({from: clientaccount, gas: 1500000}).then((f) => {
        location.reload();
    });
}

function getAdressEthSold(adress, id) {
    web3.eth.getBalance(adress).then((l) => {
        $("#soldeth" + id).html(l);
        //console.log("soldeth"+id+": "+l);
    });
}

function getAdressTicketSold(adress, id) {
    contract.methods.clientDetails(adress).call().then((h) => {
        $("#soldticket" + id).html(h[0]+" : "+h[1]);
        //console.log("soldticket"+id+": "+h[0]+" : "+h[1]);
    });
}

$(document).ready(function() {
    ticketNames = Object.keys(tickets);

    for(var i=0; i<ticketNames.length; i++) {
        let name = ticketNames[i];  
        contract.methods.totalBoughtFor(web3.utils.asciiToHex(name)).call().then((f) => {
        $("#" + tickets[name]).html(f);
        });
    }

    web3.eth.getAccounts().then((f) => {
        for(var i=0; i<f.length; i++) {
            //console.log(f[i]);
            $("#adress" + (i)).html(f[i]);
        }
    });

    web3.eth.getAccounts().then((f) => {
        for(var i=0; i<f.length; i++) {
            getAdressEthSold(f[i], i);
        }
    });
    
    web3.eth.getAccounts().then((f) => {
        for(var i=0; i<f.length; i++) {
            getAdressTicketSold(f[i], i);
        }
    });

});