import './App.css'
import { useEffect } from 'react'
import { useState } from 'react'
import Thread from './Thread'
import { Bee, Utils } from '@ethersphere/bee-js'
import Wallet from 'ethereumjs-wallet'

function App() {
  const [contentHash, setContentHash] = useState(window.location.hash.slice(1))
  const [bee, setBee] = useState(new Bee('http://localhost:1633'))
  const [loadingThreadId, setLoadingThreadId] = useState<[number, number]>([0, 0])
  const [wallet, setWallet] = useState(Wallet.generate())

  useEffect(() => {
    const valami = () => {
      console.log('hashchange1', window.location.hash)
      setContentHash(window.location.hash.slice(1))
    }
    window.addEventListener('hashchange', valami)

    // key init
    const setStringKey = (key: string) => {
      const keyBytes = Utils.hexToBytes(key)
      setByteKey(keyBytes)
    }

    /** bytes represent hex keys */
    const setByteKey = (keyBytes: Uint8Array) => {
      const wallet = new Wallet(Buffer.from(keyBytes))
      setWallet(wallet)
    }

    const windowPrivKey = window.localStorage.getItem('private_key')

    if (windowPrivKey) {
      setStringKey(windowPrivKey)
    } else {
      const key = wallet.getPrivateKey()
      window.localStorage.setItem('private_key', Utils.bytesToHex(key))
      setByteKey(key)
    }
  }, [])

  const initChildrenDoneFn = (level: number, orderNo: number) => {
    console.log(`level ${level} with orderNo ${orderNo} has been inited its children!`)
    //TODO: fetch other threads
  }

  const initDoneFn = (level: number, orderNo: number) => {
    console.log(`level ${level} with orderNo ${orderNo} has been inited!`)
    //TODO: register threads for init their children later
  }

  return (
    <div className="App">
      <h2>633chan</h2>
      <div className="633chan-body">
        <Thread
          bee={bee}
          contentHash={contentHash}
          level={0}
          orderNo={0}
          loadingThreadId={loadingThreadId}
          initChildrenDoneFn={initChildrenDoneFn}
          initDoneFn={initDoneFn}
          wallet={wallet}
        />
      </div>
    </div>
  )
}

export default App
