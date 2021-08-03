# Izy DataConsole Elastic Search Feature
This package simplifies access to automating tasks related to elastic search. 


## Search and Record Manipulation

For command line access use:

    npm run status queryObject.esConfigId xxxx-xxxx queryObject.options _nodes/stats/breaker
    npm run searchGeneric queryObject.esConfigId xxxx-xxxx queryObject.JSONStrId xxxx
    npm run searchById queryObject.esConfigId xxxx-xxxx queryObject.index indexname queryObject.type indextype queryObject.ids 1-2-3
    npm run deleteById queryObject.esConfigId xxxx-xxxx queryObject.index indexname queryObject.type indextype queryObject.ignoreNotFound true queryObject.ids 1-2-3
    
    
## clusters, nodes, and shards
Each ElasticSearch index is made up of logical grouping of one or more physical shards, where each shard is actually a self-contained index. The shards can be distributed across multiple nodes (servers) and a collection nodes make up a cluster. There are two types of shards: primaries and replicas. Each document in an index belongs to one primary shard. A replica shard is a copy of a primary shard.

    cluster < node(s) < shard(s)

When the cluster size and configuration changes, load balancer will kick in that should automatically migrate shards to nodes. The exact behavior will be defined by cluster and shard allocation settings.

    npm run cluster.status queryObject.esConfigId xxxx-xxxx

If you find UNASSIGNED shards (reason may be NODE_LEFT, ALLOCATION_FAILED, etc.) you have will need to manually reassign a shard to a node using allocateshard:

    npm run cluster.allocateshard queryObject.esConfigId xxxx-xxxx queryObject.index index queryObject.node node queryObject.shard shard

# External Resources
* [github]
* [npmjs]

# Changelog
## V1
* implement cluster management commands
* add support for http adapter plug-in
* utilize the latest izy-proxy feature updgrades
* add support for http[s] esConfig.hosts entries
* format output for automatin interface
* fix deep dependency bug. Improve output
* add status
* add searchGeneric
* add ignoreNotFound to deleteById
* support bulk for deleteById


[npmjs]: https://www.npmjs.com/package/izyware-dataconsole-elasticsearch
[github]: https://github.com/izyware/dataconsole-elasticsearch