import {
  useContract,
  ThirdwebNftMedia,
  useNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import styles from "../styles/Theme.module.css";

const contractAddress = "0xe0F5f8Bb09627B0A886D4CBd300Ba36cd9E522c6";

export default function Home() {
  // Read the contract from the blockchain
  const { contract } = useContract(contractAddress);

  // Read the NFTs from the contract
  const { data: nfts, isLoading: loading } = useNFTs(contract);

  return (
    <div className={styles.container}>
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

      <Web3Button
        colorMode="dark"
        accentColor="#F213A4"
        contractAddress={contractAddress}
        action={(contract) =>
          contract.erc721.mint({
            name: "Yellow Star",
            image:
              "https://gateway.ipfscdn.io/ipfs/QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png",
          })
        }
        onSuccess={() => alert(`🚀 Successfully Minted NFT!`)}
      >
        Mint NFT
      </Web3Button>
    </div>
  );
}
