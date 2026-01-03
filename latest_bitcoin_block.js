const RpcAgent = require('bcrpc'); // Change './index' to 'bcrpc' if running outside of bcrpc directory
agent = new RpcAgent({port: 18332, user: 'username', pass: 'password'});

// Using Callbacks
agent.getBlockCount(function (err, blockCount) {
  if (err)
    throw Error(JSON.stringify(err));
  console.log(blockCount.result);
  agent.getBlockHash(blockCount.result, function (err, hash) {
    if (err)
      throw Error(JSON.stringify(err));
    console.log(hash.result);
  })
});

// Using Promises
agent.getBlockCount()
.then((blockCount) => {
  console.log(blockCount);
  return agent.getBlockHash(blockCount);
})
.then((hash) => {
  console.log(hash);
})
.catch((err) => {
  console.error(err);
  return err;
});