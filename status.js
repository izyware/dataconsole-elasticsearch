const modtask = () => {};
modtask.all = (queryObject, cb) => {
    const { esConfigId } = queryObject;
    modtask.doChain([
        ['chain.importProcessor', 'chain', {
        verbose: modtask.verbose
        }],
        ['//inline/rel:json?loadById', { id: esConfigId }],
        chain => {
            const esConfig = chain.get('outcome').data;
            const url = `http://${esConfig.hosts[0]}/_nodes/stats/breaker?pretty`;
            modtask.ldmod('features/v2/http').universalHTTP().sendRequest({
                url
            }, function(outcome) {
                const data = outcome.responseText;
                console.log(data);
            });
        }
    ]);
}
