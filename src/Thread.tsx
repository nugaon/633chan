import { Bee, Utils } from '@ethersphere/bee-js'
import { HexString } from '@ethersphere/bee-js/dist/types/utils/hex'
import { keccak256Hash } from 'mantaray-js/dist/utils'
import { useState } from 'react'
import { useEffect } from 'react'
import Comment from './Comment'
import PublicPirateDb from './services/PublicPirateDb'
import { VERSION_HASH } from './Utility'

interface Props {
  contentHash: HexString // -> PublicPirateDb get users
  bee: Bee
  userPublicKey?: Uint8Array
}

export default function Thread({ contentHash, bee, userPublicKey }: Props) {
  const [comment, setComment] = useState('')
  const publicPirateDb = new PublicPirateDb(bee, Utils.hexToBytes<32>(contentHash), VERSION_HASH)

  const initComment = () => {
    if (!userPublicKey) {
      return
    }
    const getTopic = (): HexString => {
      const bytes = keccak256Hash(new Uint8Array([...Utils.hexToBytes<32>(contentHash), ...userPublicKey]))

      return Utils.bytesToHex(bytes, 64)
    }
    // const comment
  }

  //async init
  useEffect(() => {
    // get print message
    initComment()
    // init Children Thread elements
  }, [])

  return (
    <div>
      <Comment comment={comment} />
    </div>
  )
}
