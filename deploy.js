require('dotenv').config()

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

console.log('env', process.env.ACCT_MN, process.env.RINKEBY_URL)

const provider = new HDWalletProvider(
  process.env.ACCT_MN,
  process.env.RINKEBY_URL
);
const web3 = new Web3(provider);


const deploy = async (accountNumber = 0) => {
  const accounts = await web3.eth.getAccounts();
  const deployAccount = accounts[accountNumber];
  const initialMessage = 'Hello, World!';
  const data = '0x' + bytecode;
  const gas = 1000000;
  const gasPrice = web3.utils.toWei('2', 'gwei');

  console.log('Attempting to deploy from account: ', deployAccount);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data, arguments: [initialMessage] })
    .send({ gas, gasPrice , from: deployAccount });

  console.log('Contract deployed to', result.options.address);
};
deploy();
