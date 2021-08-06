
const modtask = () => {};
const proxyLib = require('izy-proxy').basePath;

modtask.verbose = {
  logConnectionAttemp: false,
  logQuery: false
};

modtask.generic = (queryObject, cb) => {
  let { esConfigId, JSONStrId, index } = queryObject;
  let genericJSON = {};
  if (!index)
    index = '';
  else
    index += '/';
  modtask.doChain([
    [`//inline/${proxyLib}/json?loadById`, { id: esConfigId }],
    chain => {
      esConfig = chain.get('outcome').data;
      chain(['chain.importProcessor', 'chain', {
          verbose: modtask.verbose,
          esConfig
      }]);
    },
    [`//inline/${proxyLib}/json?loadById`, { id: JSONStrId }],
    chain => {
      genericJSON = chain.get('outcome').data;
      let url = `http://${esConfig.hosts[0]}/${index}_search`;
      chain(['es.http', {
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(genericJSON)
      }]);
    },
    chain => chain(['outcome', { success: true, data: JSON.parse(chain.get('outcome').data).hits.hits }])
  ]);
}

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
      let url = `http://${esConfig.hosts[0]}/${index}/_search`;
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
    },
    chain => chain(['outcome', { success: true, data: JSON.parse(chain.get('outcome').data).hits.hits }])
  ]);
};
