
const modtask = () => {};
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
    ['chain.importProcessor', 'chain', {
      verbose: modtask.verbose
    }],
    ['//inline/rel:json?loadById', { id: esConfigId }],
    chain => chain(['es.connect', chain.get('outcome').data]),
    chain => {
      var i = 0 ;
      chain([
        ['log', 'processing'],
        chain => {
          if (i >= ids.length) return chain(['outcome', { success: true }]);
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
    },
    chain => {
      console.log(chain.get('outcome').data);
    }
  ]);
};
