# Izy DataConsole Elastic Search Feature

For command line access use:

    npm run status queryObject.esConfigId xxxx-xxxx
    npm run searchGeneric queryObject.esConfigId xxxx-xxxx queryObject.JSONStrId xxxx
    npm run searchById queryObject.esConfigId xxxx-xxxx queryObject.index indexname queryObject.type indextype queryObject.ids 1-2-3
    npm run deleteById queryObject.esConfigId xxxx-xxxx queryObject.index indexname queryObject.type indextype queryObject.ignoreNotFound true queryObject.ids 1-2-3



# Changelog


# V1
* add status
* add searchGeneric
* add ignoreNotFound to deleteById
* support bulk for deleteById

