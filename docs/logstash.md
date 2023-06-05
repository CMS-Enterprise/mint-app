# Logstash

[Logstash](https://www.elastic.co/guide/en/logstash/current/index.html)

## mint-logstash Image

Uses `opensearchproject/logstash-oss-with-opensearch-output-plugin:8.6.1` as base.  
This image is based on the OSS version of Logstash and includes the Opensearch plugin installed already.  
We use `logstash_entrypoint.sh` to update the Logstash configuration by way of environment variable `LOGSTASH_CONF_BASE64`, which is a BASE64 encoded string of the environment's (DEV, TEST, IMPL, PROD) `logstash.conf`.  
`LOGSTASH_CONF_BASE64` is set in the ECS task definition.


## Documentation discovery

- https://www.elastic.co/guide/en/logstash/current/docker-config.html
    - Logstash official documentation
 
- https://github.com/opensearch-project/logstash-output-opensearch
    - Logstash -> Opensearch output plugin Github Repository
 
- https://opensearch.org/docs/latest/tools/logstash/index/
    - Opensearch documentation that references using Logstash
 
- https://hub.docker.com/r/opensearchproject/logstash-oss-with-opensearch-output-plugin
    - OpensearchProject hosts Logstash image with Opensearch plugin installed
 
- https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-logstash.html
    - AWS documentation that references Logstash and using it with Opensearch Service
    