# Data Ingestion, Processing, and Indexing For Searching Change History

As MINT evolves, the need to ingest and process data becomes essential. While this enables immediate feature needs for
searching change history, this is a wide foundational component of our server ecosystem which has wide-reaching impacts
on future backend capabilities such as data analysis, anomaly detection, data visualization, autocomplete, and more.

The search change history functionality will enable users to keep track of changes made to their data, understand the
context of those changes, and identify any potential issues. To support this functionality, we have decided to use
OpenSearch for indexing and searching, Logstash for data ingestion, and OpenSearch-Dashboards for visualization and
analysis. In the immediate term we will index data from audit.change_table in the database.


## Considered Alternatives

- Search Provider:
  - OpenSearch
  - Elasticsearch


- Data Ingestion:
  - Debezium
  - Logstash
  - StateTrace


- Visualization and Analysis:
  - OpenSearch-Dashboards
  - Kibana


# Decision Outcome

Chosen Alternative: OpenSearch, Logstash, and OpenSearch-Dashboards.

- OpenSearch
  - Fully open-source and community-driven search engine that is compatible with the Elasticsearch API. It
  has better licensing terms and better support in AWS, which aligns with our existing infrastructure.


- Logstash
  - A powerful data ingestion tool that can process and transform data from various sources before sending it
  to OpenSearch. It integrates well with OpenSearch and provides a flexible plugin system to support a wide range of data
  formats and sources.


- OpenSearch-Dashboards
  - A data visualization and analysis platform designed to work with OpenSearch. It provides
  similar functionality to Kibana but is better suited for use with OpenSearch.


## Pros and Cons of the Alternatives


### Search Provider: OpenSearch vs Elasticsearch

#### OpenSearch

##### <i>Pros</i>
+ Open-source and community-driven
+ Compatible with Elasticsearch API
+ Better licensing terms (Apache 2.0)
+ Native support in AWS

##### <i>Cons</i>
- Less mature and not as widely adopted as Elasticsearch
- Limited support for plugins and integrations compared to Elasticsearch

#### Elasticsearch

##### <i>Pros</i>
+ Mature, widely used, and well-supported search engine
+ Highly scalable and performant
+ Rich ecosystem of plugins and integrations

##### <i>Cons</i>
- Licensing issues with recent versions (switched from Apache 2.0 to SSPL)


### Data Ingestion: Debezium vs Logstash vs StateTrace

#### Debezium

##### <i>Pros</i>
+ Designed for capturing database changes and streaming them to other systems
+ Strong support for CDC (Change Data Capture)

##### <i>Cons</i>
- More focused on database change events, not as versatile as Logstash
- Less straightforward integration with OpenSearch

#### Logstash

##### <i>Pros</i>
+ Flexible and powerful data ingestion tool
+ Seamless integration with OpenSearch
+ Supports a wide range of data sources and formats
+ Extensible plugin system

##### <i>Cons</i>
- Can be resource-intensive depending on the workload

#### StateTrace

##### <i>Pros</i>
+ Designed for tracking state changes in distributed systems

##### <i>Cons</i>
- Not as mature as other alternatives
- Less focused on data ingestion and processing
- Limited integration options with OpenSearch


### Visualization and Analysis: OpenSearch-Dashboards vs Kibana

#### OpenSearch-Dashboards

- Designed to work with OpenSearch
- Similar functionality to Kibana

#### Kibana

##### <i>Pros</i>
+ Mature and widely used visualization platform
+ Rich ecosystem of plugins and integrations

##### <i>Cons</i>
- Licensing issues with recent versions (switched from Apache 2.0 to SSPL)
- Not specifically designed for use with OpenSearch

Using OpenSearch, Logstash, and OpenSearch-Dashboards provides a powerful and flexible solution for data ingestion,
indexing, searching, visualization, and analysis of change history data. This combination allows for seamless
integration, high scalability, and a rich ecosystem of plugins and integrations to support various data sources and
formats. By choosing these alternatives, we can better align with our existing infrastructure and avoid potential
licensing issues.

Update: 1/26/2023 - Decision was made to decommission and pause work on Opensearch/Logstash implementation.
