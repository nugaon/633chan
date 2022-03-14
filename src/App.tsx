import ContentView from './ContentView'
import './App.css'
import { useEffect } from 'react'
import { useState } from 'react'
import Thread from './Thread'

function App() {
  const [contentHash, setContentHash] = useState(window.location.hash.slice(1))

  useEffect(() => {
    const valami = () => {
      console.log('hashchange1', window.location.hash)
      setContentHash(window.location.hash.slice(1))
    }
    window.addEventListener('hashchange', valami)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h2>633chan</h2>
        <ContentView contentHash={contentHash} />
      </header>
      <div className="633chan-body">
        <Thread />
      </div>
    </div>
  )
}

export default App
