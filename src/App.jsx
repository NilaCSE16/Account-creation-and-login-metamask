import { Wallet, ethers } from "ethers";
import "./App.css";
import Login from "./Component/Login/Login";
import { useEffect, useState } from "react";
import Connected from "./Component/Connected/Connected";
import WalletConnect from "@walletconnect/client/dist/umd/index.min";

function App() {
  // ethers.Wallet.createRandom([options = {}]);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  });

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account != accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const providers = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(providers);
        await providers.send("eth_requestAccounts", []);
        const signer = providers.getSigner();
        const address = await signer.getAddress();
        // const acc = await signer.getBalance();
        console.log("Metamask connected: ", providers);
        // console.log("Providers: ", acc);
        setIsConnected(true);
        setAccount(address);
        console.log(account);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install Metamask");
    }
  }

  async function handleAccountCreate() {
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const newWallet = ethers.Wallet.createRandom().connect(providers);
    // const newWallet = new ethers.Wallet(await ethers.Wallet.createRandom());

    const privateKey = newWallet.privateKey;

    // await providers.send("eth_requestAccounts", []);
    await window.ethereum.request({
      method: "eth_accounts",
      params: [{ data: { privateKey } }],
    });

    // const connector = new WalletConnect({
    //   bridge: "https://relay.walletconnect.org", // Required
    // });
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // WalletConnect bridge URL
    });

    // Create a new session
    const session = await connector.createSession();

    // Generate a QR code or deep link for the user to scan with MetaMask
    console.log("QR code:", session);

    const signer = await new ethers.Wallet(privateKey, providers);
    const address = await signer.getAddress();

    setProvider(providers);
    setAccount(address);
    setIsConnected(true);
    console.log("Metamask connected: ", address);
    console.log("Privatekey: ", privateKey);
    console.log("New Account: ", newWallet);
    // console.log(newWallet.privateKey);
    // setProvider(newWallet);
  }

  return (
    <div className="flex flex-col items-center pt-12">
      {isConnected ? (
        <Connected account={account}></Connected>
      ) : (
        <div>
          <Login connectToMetamask={connectToMetamask}></Login>
          <button
            className="btn btn-primary mt-4"
            onClick={handleAccountCreate}
          >
            Create an account
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
