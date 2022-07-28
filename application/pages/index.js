import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  ThirdwebNftMedia,
  ChainId,
  useNFTs,
  useMintNFT,
} from "@thirdweb-dev/react";
import styles from "../styles/Theme.module.css";

export default function Home() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // Read the contract from the blockchain
  const { contract } = useContract(
    "0xe0F5f8Bb09627B0A886D4CBd300Ba36cd9E522c6"
  );

  // Read the NFTs from the contract
  const { data: nfts, isLoading: loading } = useNFTs(contract?.nft);

  // Function to mint a new NFT
  const { mutate: mintNft, isLoading: minting } = useMintNFT(contract?.nft);

  async function mintAnNft() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isWrongNetwork) {
      switchNetwork(ChainId.Goerli);
      return;
    }

    mintNft(
      {
        metadata: {
          name: "Yellow Star",
          image:
            "https://gateway.ipfscdn.io/ipfs/QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png",
        },
        to: address,
      },
      {
        onSuccess(data) {
          alert(`🚀 Successfully Minted NFT!`);
        },
      }
    );
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
        onClick={mintAnNft}
        className={`${styles.mainButton} ${styles.spacerTop}`}
      >
        {minting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}
