
const modtask = () => {};
const proxyLib = require('izy-proxy').basePath;

modtask.verbose = {
  logConnectionAttemp: false,
  logQuery: false
};

modtask.byId = (queryObject, cb) => {
  const { index, type, esConfigId } = queryObject;
  let { ids } = queryObject;
  if (ids.indexOf('-') >= 0) {
    ids = ids.split('-');
  } else {
    ids = [ids];
  }
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
      let url = `http://${esConfig.hosts[0]}/${index}/_delete_by_query`;
      chain(['es.http', {
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: {
            ids: {
              type,
              values: ids
            }
          }
        })
      }]);
    }
  ]);
};
