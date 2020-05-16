
const modtask = () => {};
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
    ['chain.importProcessor', 'chain', {
      verbose: modtask.verbose
    }],
    ['//inline/?loadConfigJSONFromID', { id: esConfigId }],
    chain => chain(['es.connect', chain.get('outcome').data]),
    ['es.query', {
      index, type, ids
    }],
    chain => {
      console.log(chain.get('outcome').data.hits.hits);
    }
  ]);
};

modtask.loadConfigJSONFromID = (queryObject, cb) => {
  const { id } = queryObject;
  try {
    cb({ success: true, data: JSON.parse(require('fs').readFileSync(`${id}`)) })
  } catch(e) {
    cb({ reason: e.message });
  }
}
