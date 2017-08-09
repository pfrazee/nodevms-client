# NodeVMS Client

RPC client library for [NodeVMS](https://npm.im/nodevms).

```js
const NodeVMSClient = require('nodevms-client')

// example usage
var rpc = new NodeVMSClient()
await rpc.connect('ws://localhost:5555')
await rpc.ping()
rpc.close()

// can also use 'ready' event
var rpc = new NodeVMSClient()
rpc.connect('ws://localhost:5555')
rpc.on('ready', async () => {
  await rpc.ping()
})

// opts:
var rpc = new NodeVMSClient({
  timeout: Number, ms (default 5000)
})
rpc.connect(url, {
  user: String, the user to authenticate as (default null)
})
```