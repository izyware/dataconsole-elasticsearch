
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
          if (!outcome.success) return $chain.chainReturnCB(outcome);
          $chain.set('outcome', outcome);
          cb();
        }
      ]);
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
