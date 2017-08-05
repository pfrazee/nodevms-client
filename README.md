# NodeVMS Client

RPC client library for [NodeVMS](https://npm.im/nodevms).

```js
const NodeVMSClient = require('nodevms-client')

// example usage
var rpc = new NodeVMSClient('ws://localhost:5555')
await rpc.isReadyPromise
await rpc.ping()

// can also use 'ready' event
var rpc = new NodeVMSClient('ws://localhost:5555')
rpc.on('ready', async () => {
  await rpc.ping()
})

// opts:
var rpc = new NodeVMSClient('ws://localhost:5555', {
  timeout: Number, ms (default 5000),
  user: String, the user to authenticate as (default null)
})
```