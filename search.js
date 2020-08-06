
const modtask = () => {};
modtask.verbose = {
  logConnectionAttemp: false,
  logQuery: false
};

modtask.generic = (queryObject, cb) => {
  const { esConfigId, JSONStrId } = queryObject;
  let genericJSON = {};
  modtask.doChain([
    ['chain.importProcessor', 'chain', {
      verbose: modtask.verbose
    }],
    ['//inline/rel:json?loadById', { id: JSONStrId }],
    chain => {
      genericJSON = chain.get('outcome').data;
      chain(['//inline/rel:json?loadById', { id: esConfigId }]);
    },
    chain => {
      const esConfig = chain.get('outcome').data;
      const url = `http://${esConfig.hosts[0]}/_search?pretty`;
      modtask.ldmod('features/v2/http').universalHTTP().sendRequest({
          url,
          method: 'POST',
          body: JSON.stringify(genericJSON)
      }, function(outcome) {
          const data = outcome.responseText;
          console.log(data);
      });
  }
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
    ['chain.importProcessor', 'chain', {
      verbose: modtask.verbose
    }],
    ['//inline/rel:json?loadById', { id: esConfigId }],
    chain => chain(['es.connect', chain.get('outcome').data]),
    ['es.searchById', {
      index, type, ids
    }],
    chain => {
      console.log(chain.get('outcome').data.hits.hits);
    }
  ]);
};
