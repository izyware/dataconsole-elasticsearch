const modtask = () => {};
const proxyLib = require('izy-proxy').basePath;

modtask.all = (queryObject, cb) => {
    const commands = [
        '****** You may also try *********',
        'circuit breaker status: _nodes/stats/breaker?pretty',
        'list all indices: _cat/indices',
        '*********************************',
        ''
    ];
    const { esConfigId } = queryObject;
    let cmd = queryObject.options || ''; // `_nodes/stats/breaker?pretty`;
    modtask.doChain([
        [`//inline/${proxyLib}/json?loadById`, { id: esConfigId }],
        chain => {
            const esConfig = chain.get('outcome').data;
            let serviceEndPoint = esConfig.hosts[0];
            if (serviceEndPoint.indexOf('http') != 0) {
                serviceEndPoint = `http://` + serviceEndPoint;
            }
            const url = `${serviceEndPoint}/${cmd}`;
            console.log(url);
            chain(['net.httprequest', { url }]);
        },
        chain => {
            var result = chain.get('outcome');
            var data = result.responseText;
            data = commands.join('\n') + data;
            chain(['outcome', { success: true, data }]);
        }
    ]);
}
