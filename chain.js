
const modtask = (chainItem, cb, $chain) => {
  if (!modtask.__chainProcessorConfig) modtask.__chainProcessorConfig = {};
  const verbose =  modtask.__chainProcessorConfig.verbose || {};
  const esConfig = modtask.__chainProcessorConfig.esConfig || {}
  const adapterservice =  esConfig.adapterservice || null;
  const adapterconfig =  esConfig.adapterconfig || null;
  var i = 0;
  var params = {};
  params.action = modtask.extractPrefix(chainItem[i++]);
  switch (params.action) {
    case 'http':
      if (verbose.adapter) console.log('Using adapter ', adapterservice, adapterconfig);
      var httparams = chainItem[i++];
      $chain.newChainForProcessor(modtask, cb, {}, [
        adapterservice ? [adapterservice + '?httprequest', { httparams, config: adapterconfig }] : ['net.httprequest', httparams],
        function(chain) {
          var result = chain.get('outcome');
          if (adapterservice) result = result.data;
          var data = result.responseText;
          var outcome = {};
          if (result.status != 200) {
            outcome =  { reason: result.status + '(non 200): ' + data };
          } else {
            outcome = { success: true, data: data };
          }
          $chain.set('outcome', outcome);
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
