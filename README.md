# Izy DataConsole Elastic Search Feature

For command line access use:

    npm run status queryObject.esConfigId xxxx-xxxx queryObject.options _nodes/stats/breaker
    npm run searchGeneric queryObject.esConfigId xxxx-xxxx queryObject.JSONStrId xxxx
    npm run searchById queryObject.esConfigId xxxx-xxxx queryObject.index indexname queryObject.type indextype queryObject.ids 1-2-3
    npm run deleteById queryObject.esConfigId xxxx-xxxx queryObject.index indexname queryObject.type indextype queryObject.ignoreNotFound true queryObject.ids 1-2-3

# External Resources
* [github]
* [npmjs]

# Changelog
## V1
* add support for http[s] esConfig.hosts entries
* format output for automatin interface
* fix deep dependency bug. Improve output
* add status
* add searchGeneric
* add ignoreNotFound to deleteById
* support bulk for deleteById
[npmjs]: https://www.npmjs.com/package/izyware-dataconsole-elasticsearch
[github]: https://github.com/izyware/dataconsole-elasticsearch
