const Web3 = require("web3");
const web3 = new Web3("HTTP://127.0.0.1:7545");


const ethTransfer = async(senderAddress,senderKey,recieverAddress,money)=>{
    console.log("Transfering money from " + senderAddress + " to " + recieverAddress);

    const createTransaction = await web3.eth.accounts.signTransaction({
        from: senderAddress,
        to: recieverAddress,
        value: web3.utils.toWei(money,"ether"),
        gas: 21000,
    },senderKey);

    web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
        .then((reciept)=>{
            console.log("Transaction Successful");
            // console.log(reciept);
            let eth = web3.eth.getBalance(senderAddress)
                .then((wei)=>{
                    const ethBalance = web3.utils.fromWei(wei);
                    console.log(ethBalance,"ether");
                });
        })
        .catch((err)=>{
            console.log(err);
        })
}

let senderAddress = "0xC1D622adB4E21aB7415375D09c189299404D1bc6";
let recieverAddress = "0x56BD50935a9b491e81b0db107179b40e7A523E69";
let senderKey = "74f754151c684f5a2cb3a9677a4a0a2c6d1c54e37679e457b0bb8fbdbfdee759";

// ethTransfer(senderAddress,senderKey,recieverAddress,"0.000795537");


// console.log(eth);

const getBalance = (address)=>{
    let eth = web3.eth.getBalance(address)
        .then((wei)=>{
            const ethBalance = web3.utils.fromWei(wei);
            return ethBalance;
    })
    .catch((err)=>{
        console.log("something went wrong!");
        console.log(err);
        throw err;
    })
}


// getBalance("0xC1D622adB4E21aB7415375D09c189299404D1bc6");

module.exports = {
    getBalance,
    ethTransfer,
};