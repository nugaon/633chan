import { Bee, Utils, Reference } from '@ethersphere/bee-js'
import Wallet from 'ethereumjs-wallet'
import { Bytes } from 'mantaray-js'

/** Handled by the gateway proxy or swarm-extension */
const STAMP_ID = '0000000000000000000000000000000000000000000000000000000000000000'

interface DbRecord {
  hexPublicKeys: string[]
}

function isPirateDbElement(value: unknown): value is DbRecord {
  return value !== null && typeof value === 'object' && Object.keys(value)[0] === 'hexPublicKeys'
}

function assertPirateDbElement(value: unknown): asserts value is DbRecord {
  if (!isPirateDbElement(value)) {
    throw new Error('PublicPirateDb record is not valid')
  }
}

function deserialiseDbRecord(value: Uint8Array): DbRecord {
  try {
    const valueString = new TextDecoder().decode(value)
    const valueObject = JSON.parse(valueString)
    assertPirateDbElement(valueObject)

    return valueObject
  } catch (e) {
    throw new Error('fetched PublicPirateDb record is not valid')
  }
}

function serializeDbRecord(updateElement: DbRecord): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(updateElement))
}

function mergeRecords(e1: DbRecord, e2: DbRecord): DbRecord {
  const e1PublicKeys = e1.hexPublicKeys.filter(e => !e2.hexPublicKeys.includes(e))

  return { hexPublicKeys: [...e2.hexPublicKeys, ...e1PublicKeys] }
}

export default class PublicPirateDb {
  private wallet: Wallet
  constructor(private bee: Bee, private privateKey: Bytes<32>, private topic: Bytes<32>) {
    this.wallet = new Wallet(Buffer.from(privateKey))
  }

  public async broadcastPublicKey(publicKeys: Uint8Array[]): Promise<Reference> {
    const myUpdate = this.buildUpdate(publicKeys)
    const lastUpdate = await this.getLatestRecord()
    const update = mergeRecords(myUpdate, lastUpdate)
    const feedWriter = this.bee.makeFeedWriter('sequence', this.topic, this.privateKey)
    const { reference } = await this.bee.uploadData(STAMP_ID, serializeDbRecord(update))
    console.log('uploaded swarm reference of the message', reference)

    return feedWriter.upload(STAMP_ID, reference)
  }

  public async getLatestRecord(): Promise<DbRecord> {
    const feedReader = this.bee.makeFeedReader('sequence', this.topic, this.privateKey)
    const feedUpdate = await feedReader.download()
    const data = await this.bee.downloadData(feedUpdate.reference)

    return deserialiseDbRecord(data)
  }

  private buildUpdate(publicKeys: Uint8Array[]): DbRecord {
    const hexPublicKeys = publicKeys.map(publicKey => Utils.bytesToHex(publicKey, 64))

    return { hexPublicKeys }
  }
}
