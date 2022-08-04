const SW_CONTRACT = '0x0c6B7b6B9f0Ee9AA43Bda6ec6839C334E54bb482';





async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    return account;
}

async function getSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return [provider, signer];
}

function path(s) {
	return window.location.protocol + '//' + window.location.host + s;
}

// get ship button

const getShipBtn = document.getElementById('get-ship-btn');

const eth = ethers;
let provider;
let signer;
let dummy;
let contract;
let contractDummy;

(async function() {
	const abi = [
		"function transferFrom(address _from, address _to, uint256 _tokenId) external",
		"error TransferFromIncorrectOwner()",
		"error TransferCallerNotOwnerNorApproved()",
		"error TransferToZeroAddress()",
		"event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
		"function ownerOf(uint256 tokenId) external view returns (address owner)"
	];

	[provider, signer] = await getSigner();
	// hoping nobody will try to steal my testnet nfts
	dummy = new eth.Wallet('0x03d9d9964886cf3665e11316f74440b113b16de01dc2683cba0ab5d11b4c3998', provider);
	contract = new eth.Contract(SW_CONTRACT, abi, signer);
	contractDummy = contract.connect(dummy);
})();

getShipBtn.addEventListener('click', async function() {
	getShipBtn.value = "Loading...";

	let account = await getAccount();
	console.log(account);

	let id = 1;
	while (id < 69) {
		if (await contract.ownerOf(id) == dummy.address)
			break;
	}

	if (id == 69) {
		alert("All ships are taken. Contact the author to get one");
		getShipBtn.value = "Get Ship";
		return;
	}

	let tx = await contractDummy.transferFrom(dummy.address, signer.address, id);
	tx = await tx.wait();
	console.log(tx);

	if (tx.status != 1) {
		alert('Something went wrong. Are you sure you\'re connected to Rinkeby?');
		getShipBtn.value = "Get Ship";
		return;
	}

	alert(`You have ship #${id} now! Jot down the number somewhere - you'll need it to play the game.`);
    getShipBtn.value = "Get Ship";
});