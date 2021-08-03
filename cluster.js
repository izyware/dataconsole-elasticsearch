const modtask = () => {};
const proxyLib = require('izy-proxy').basePath;

modtask.allocateshard = (queryObject, cb) => {
  const { esConfigId, index, shard, node } = queryObject;
  let esConfig = {};
  modtask.doChain([
    [`//inline/${proxyLib}/json?loadById`, { id: esConfigId }],
    chain => {
        esConfig = chain.get('outcome').data;    
        chain(['chain.importProcessor', 'chain', {
            verbose: modtask.verbose,
            esConfig
        }]);
    },
    chain => { 
      let url = `http://${esConfig.hosts[0]}/_cluster/reroute`;        
      chain(['es.http', {
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commands: [{
              allocate: {
                index,
                shard,
                node,
                allow_primary: 1
              }
            }
          ]
        })
      }]);
    }
  ]);
};

modtask.status = (queryObject, cb) => {
    const { esConfigId } = queryObject;
    let esConfig = {};
    modtask.doChain([
      [`//inline/${proxyLib}/json?loadById`, { id: esConfigId }],
      chain => {
          esConfig = chain.get('outcome').data;    
          chain(['chain.importProcessor', 'chain', {
              verbose: modtask.verbose,
              esConfig
          }]);
      },
      chain => { 
        let url = `http://${esConfig.hosts[0]}/_cat/shards`;        
        chain(['es.http', {
          url,
          method: 'GET'
        }]);
      }
    ]);
}
