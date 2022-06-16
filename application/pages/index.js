import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  ThirdwebNftMedia,
  ChainId,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import styles from "../styles/Theme.module.css";

export default function Home() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract } = useContract(
    "0xC4EE6D5B10D4d37648777570F4c0e09974B1559b"
  );

  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);

  console.log(nfts);

  useEffect(() => {
    (async () => {
      if (!contract) return;
      setNfts(await contract?.nft.query.all());
      setLoading(false);
    })();
  }, [contract]);

  async function mintNft() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isWrongNetwork) {
      switchNetwork(ChainId.Goerli);
      return;
    }

    await contract?.nft.mint.to(address, {
      name: "Yellow Star",
      image:
        "https://gateway.ipfscdn.io/ipfs/QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png",
    });

    alert(`🚀 Successfully Minted NFT!`);
  }

  return (
    <div className={styles.container}>
      {address ? (
        <>
          <a onClick={disconnectWallet} className={styles.secondaryButton}>
            Disconnect Wallet
          </a>
          <p>Your address: {address}</p>
        </>
      ) : (
        <a onClick={connectWithMetamask} className={styles.secondaryButton}>
          Connect Wallet
        </a>
      )}

      {!loading ? (
        <div className={styles.nftBoxGrid}>
          {nfts?.map((nft) => (
            <div className={styles.nftBox} key={nft.metadata.id.toString()}>
              <ThirdwebNftMedia
                metadata={nft.metadata}
                className={styles.nftMedia}
              />
              <h3>{nft.metadata.name}</h3>
              <p>Owner: {nft.owner.slice(0, 6)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading NFTs...</p>
      )}

      <button
        onClick={mintNft}
        className={`${styles.mainButton} ${styles.spacerTop}`}
      >
        Mint NFT
      </button>
    </div>
  );
}
