
const modtask = (chainItem, cb, $chain) => {
  if (!modtask.__chainProcessorConfig) modtask.__chainProcessorConfig = {};
  const verbose =  modtask.__chainProcessorConfig.verbose || {};
  const adapterservice =  modtask.__chainProcessorConfig.adapterservice || null;
  const adapterconfig =  modtask.__chainProcessorConfig.adapterconfig || null;
  var i = 0;
  var params = {};
  params.action = modtask.extractPrefix(chainItem[i++]);
  switch (params.action) {
    case 'http':
      if (!adapterservice) return $chain.chainReturnCB({ reason: 'please define adapterservice' });
      if (verbose.adapter || true) console.log('Using adapter ', adapterservice, adapterconfig);
      $chain.newChainForProcessor(modtask, cb, {}, [
        [adapterservice + '?httprequest', { httparams: chainItem[i++], config: adapterconfig }],
        function(chain) {
          $chain.set('outcome', chain.get('outcome').data);
          cb();
        }
      ]);
      return true;
    case 'disconnect':
      if (!modtask.connected) return $chain.chainReturnCB({ reason: 'not connected' });
      cb();
      return true;
    case 'connect':
      if (modtask.connected) return $chain.chainReturnCB({ reason: 'already connected' });
			const elasticsearch = require('elasticsearch');
			const config = chainItem[i++] || {};
			if (verbose.logConnectionAttemp) console.log('Connecting to ', config);
      modtask.connection = new elasticsearch.Client(config);
      modtask.connected = true;
      $chain.set('outcome', { success: true });
      cb();
      return true;
    case 'searchById':
    case 'searchGeneric':
    case 'delete':
      if (!modtask.connected) return $chain.chainReturnCB({ reason: 'not connected' });
      var query = chainItem[i++] || {};
      var start = (new Date()).getTime();
      if (verbose.logQuery) console.log(`${params.action}:start`, query);

      var fn = {
        searchGeneric: 'search',
        searchById: 'search',
        delete: 'delete'
      }

      var q = {
        searchGeneric: query.genericJSON,
        searchById: {
          index: query.index,
          body: {
            query: {
              ids: {
                type : query.type,
                values : query.ids
              }
            }
          },
        },
        delete: {
          index: query.index,
          type: query.type,
          id: query.id
        }
      };
      modtask.connection[fn[params.action]](q[params.action], (err, data) => {
        if (verbose.logQuery) console.log(`${params.action}:finish`, (new Date()).getTime() - start);
        if (err) {
          if (err.status == 404 && query.ignoreNotFound) {
            if (verbose.logQuery) console.log(`${params.action}:ignoreNotFound`);
          } else {
            return $chain.chainReturnCB({reason: err.message});
          }
        }
        $chain.set('outcome', { success: true, data });
        cb();
      });
      return true;
  }
  return false;
}

modtask.extractPrefix = function(str) {
  var all = ['es.'];
  for(var i=0; i < all.length; ++i) {
    var prefix = all[i];
    if (str.indexOf(prefix) == 0) {
      return str.substr(prefix.length);
    }
  }
  return str;
}
