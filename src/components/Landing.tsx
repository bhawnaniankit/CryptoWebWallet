import Button from '../ui/Button'
import nacl from "tweetnacl"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair, PublicKey } from "@solana/web3.js";
import DropDown from './DropDown';
//@ts-ignore
const generateNewMnemonic = () => {
  const generatedMnemonic = generateMnemonic();
  return generatedMnemonic
}

interface walletInterface {
  publickey: string,
  privatekey: Uint8Array,
  path: string
}

export interface account {
  index: number,
  seed: string,
  blockchain: string,
  wallets: walletInterface[]
}

const Landing = () => {
  let num = 0
  const [mnemonic, setMnemonic] = useState<string>("");
  const [blockchain, setBlockchain] = useState<string>("");
  const [accounts, setAccounts] = useState<account[]>([])
  const [currentAccount, setCurrentAccount] = useState<number>(0);
  const navigate = useNavigate();

  const addWallet = (seed: string, blockchainCode: string, index: number) => {
    const path = `m/44'/${blockchainCode}'/${++index}'/0'`
    const derivedSeed = derivePath(path, seed).key
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    const keypair = Keypair.fromSecretKey(secret);
    console.log(keypair);
    return {
      publickey: keypair.publicKey.toBase58(),
      privatekey: secret,
      path: path
    }
  }
  const addAccount = () => {
    const mnemonic = generateNewMnemonic();
    setMnemonic(mnemonic)
  }
  useEffect(() => {
    const accountss = localStorage.getItem("accounts");
    if (accountss) {
      setAccounts(JSON.parse(accountss).value)
    }
  }, [])


  if (accounts.length != 0) {
    return <div className=' text-white h-full bg-black my-4 font-mono flex-col flex items-center'>
      <div className='w-[75vw]'>
        <div className='my-4 font-mono'><DropDown title='Accounts' accounts={accounts} setFn={setCurrentAccount} /></div>
        <h1 className='text-white my-4 font-mono text-4xl font-bold'>Wallets</h1>
        <div className=''>
          {
            accounts[currentAccount].wallets.map((wall) => {
              return <div className=' border border-gray-700 shadow rounded-lg p-4' key={wall.publickey}>
                <div className='text-3xl font-bold my-2'>{`Wallet ${++num}`}</div>

                <div className='bg-gray-900 rounded-lg p-4 mx-0'>
                  <div className='text-2xl mb-1'>Public Key</div>
                  <div className='text-gray-400 mb-3 text-sm'>{wall.publickey}</div>
                  <div className='text-2xl mb-1'>Private Key</div>
                  <div className='text-gray-400 mb-1 blur-sm hover:blur-none text-sm'>{54655645444545465456454}</div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  }
  if (accounts.length === 0 && !validateMnemonic(mnemonic) && !blockchain) {
    return (
      <div className='h-full bg-black font-mono flex justify-center items-center'>
        <div className=' flex flex-col justify-between py-4 h-full text-white w-[70vw]'>
          <div>
            <h1 className=' text-4xl mb-1'>We support multiple blockchain</h1>
            <span className=' text-gray-300'>Choose one to get started</span>
            <div className='flex gap-2 mt-2'>
              <Button title='Solana' onclick={(_e) => { setBlockchain("501") }} />
              <Button title='Ethereum' onclick={(_e) => { setBlockchain("60") }} />
            </div>
          </div>
          <div>
            <hr className='border-gray-700' />
          </div>
        </div>
      </div>
    )
  }
  if (blockchain && !validateMnemonic(mnemonic) && accounts.length === 0) {
    return <div className='h-full bg-black font-mono flex justify-center items-center'>
      <Button title="Generate Mnemonic" onclick={addAccount}
      />
    </div>
  }

  if (validateMnemonic(mnemonic) && blockchain && accounts.length === 0) {
    return <div className='flex justify-center flex-col items-center gap-3 bg-black font-mono '>
      <h1 className=' text-white text-2xl font-bold py-3'>The Secret Phrase:</h1>
      <div className='w-[75vw] grid grid-cols-3 gap-2'>
        {mnemonic.split(" ").map((word) => <div key={word} className=' bg-white text-center px-3 py-2 text-black rounded-md'>{word}</div>)}
      </div>
      <Button title='Go to Wallet' onclick={async (_e) => {
        const seed = await mnemonicToSeed(mnemonic)
        const newAccount: account = {
          index: 0,
          seed: seed.toString("hex"),
          wallets: [],
          blockchain: blockchain
        }

        const newWallet = addWallet(newAccount.seed, newAccount.blockchain, newAccount.index)
        newAccount.wallets.push(newWallet)
        setAccounts((oldAccounts) => {
          const newValue = [...oldAccounts, newAccount]
          localStorage.setItem("accounts", JSON.stringify({ value: newValue }))
          return newValue
        });
      }} />
    </div>
  }
}

export default Landing
