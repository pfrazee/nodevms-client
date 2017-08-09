const EventEmitter = require('events')
const WebSocketClient = require('rpc-websockets').Client

const RPC_CLIENT = Symbol('rpc-client')
const RPC_OPTS = Symbol('rpc-opts')
const DEFAULT_TIMEOUT = 5e3

class NodeVMSClient extends EventEmitter {
  constructor (opts) {
    super()
    this.url = null
    this.backendInfo = null
    this[RPC_OPTS] = opts || {}
  }

  async connect (url, opts) {
    if (this[RPC_CLIENT]) {
      throw new Error('Already connected')
    }

    if (opts && opts.user) {
      url += '?user=' + opts.user
    }
    var rpcClient = this[RPC_CLIENT] = new WebSocketClient(url)
    runHandshake(this)

    // re-emit some events
    rpcClient.on('open', this.emit.bind(this, 'open'))
    rpcClient.on('error', this.emit.bind(this, 'error'))
    rpcClient.on('close', this.emit.bind(this, 'close'))

    await new Promise((resolve, reject) => {
      this.on('ready', resolve)
      this.on('error', reject)
    })
  }

  close () {
    if (this[RPC_CLIENT]) {
      this[RPC_CLIENT].close()
      this[RPC_CLIENT] = null
    }
  }
}
module.exports = NodeVMSClient

async function runHandshake (client) {
  try {
    // wait for the socket to open
    await new Promise((resolve, reject) => {
      client[RPC_CLIENT].on('open', resolve)
      client[RPC_CLIENT].on('error', reject)
    })

    // call handshake() and populate the client
    client.backendInfo = await client[RPC_CLIENT].call('handshake')
    client.backendInfo.methods.forEach(methodName => {
      addRPCMethod(client, methodName)
    })

    // ready to use
    client.emit('ready')
  } catch (e) {
    client.emit('error', e)
  }
}

function addRPCMethod (client, methodName) {
  const timeout = client[RPC_OPTS].timeout || DEFAULT_TIMEOUT
  client[methodName] = (...args) => client[RPC_CLIENT].call(methodName, args, timeout)
}