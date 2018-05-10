const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile')

const provider = ganache.provider()
const web3 = new Web3(provider);
const initialMessage = 'Hello, World!';
const nextMessage = 'Updated Message!';

let accounts = [];
let inbox = {};


beforeEach(async () => {
  //Get a lost of all accounts
  accounts = await web3.eth.getAccounts();

  //Use an account to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [initialMessage] })
    .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider)
});


describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialMessage);
  });


  it('can set message', async () => {
    await inbox.methods.setMessage(nextMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, nextMessage);
  })
});
