
const modtask = () => {};
const proxyLib = require('izy-proxy').basePath;

modtask.verbose = {
  logConnectionAttemp: false,
  logQuery: false
};

modtask.byId = (queryObject, cb) => {
  const { index, type, esConfigId, ignoreNotFound } = queryObject;
  let { ids } = queryObject;
  if (ids.indexOf('-') >= 0) {
    ids = ids.split('-');
  } else {
    ids = [ids];
  }
  modtask.doChain([
    ['chain.importProcessor', modtask.ldmod('kernel/path').rel('chain'), {
      verbose: modtask.verbose
    }],
    [`//inline/${proxyLib}/json?loadById`, { id: esConfigId }],
    chain => chain(['es.connect', chain.get('outcome').data]),
    chain => {
      var i = 0 ;
      chain([
        ['log', 'processing'],
        chain => {
          if (i >= ids.length) return chain(['outcome', { success: true, data: JSON.stringify(ids, null, 2) }]);
          let idToDelete =  ids[i++];
          chain([
            ['log', 'item (' + i + ') ' + idToDelete],
            ['es.delete', {
              ignoreNotFound: ignoreNotFound == 'true',
              index, type,
              id: idToDelete
            }]
          ]);
        },
        ['replay']
      ])
    }
  ]);
};
