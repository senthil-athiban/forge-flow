import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js"
import bs58 from 'bs58'

// TODO: create dApp and send sol over wallet
export const sendSol = async (to: string, amount: any) => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const address = process.env.PRIVATE_KEY!;
    const keypair = Keypair.fromSecretKey(bs58.decode(address))
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: new PublicKey(to),
            lamports: parseInt(amount) * LAMPORTS_PER_SOL
        })
    )
    await sendAndConfirmTransaction(connection, transaction, [keypair]);
    console.log('loggin transaction : ', transaction);
}