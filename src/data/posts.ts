// Existing Gatsby blog posts. Adjust BLOG_BASE_URL if the blog moves (e.g. blog.melvinvivas.com).
export const BLOG_BASE_URL = 'https://www.melvinvivas.com'

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

export const posts: Post[] = [
  {
    slug: 'chatgpt-openai-natural-language-to-api-call',
    title: 'Power your Apps: Leverage Natural Language, OpenAI, LangChain and Custom APIs',
    date: '2023-04-15',
    description: 'Turning natural language into API calls with OpenAI, LangChain and custom tools.',
    tags: ['AI', 'Python'],
  },
  {
    slug: 'chatgpt-openai-langchain-llama-index-generative-text-ai',
    title: 'Exploring Generative Text AI using OpenAI, Python and LlamaIndex',
    date: '2023-04-08',
    description: 'Exploring generative text AI with OpenAI, Python and LlamaIndex, and what it means for developers.',
    tags: ['AI', 'Python'],
  },
  {
    slug: 'new-live-coding-stream-twitch',
    title: 'I just started a new live coding stream in Twitch!!!',
    date: '2022-08-06',
    description: 'Interviews with experienced developers, tech meetups and IT career talks, live on Twitch.',
    tags: ['Streaming'],
  },
  {
    slug: 'getting-started-strapi-headless-cms-jamstack',
    title: 'Getting Started with Strapi Headless CMS',
    date: '2021-11-06',
    description: 'Trying out Strapi, a headless CMS, for Jamstack sites.',
    tags: ['CMS', 'JavaScript'],
  },
  {
    slug: 'zoom-api-golang-library',
    title: 'Developing a Zoom API Client Library for Golang',
    date: '2020-05-23',
    description: 'There is no official Zoom API client for Go, so I wrote one.',
    tags: ['Go'],
  },
  {
    slug: 'golang-jobs-in-singapore',
    title: 'Golang Developer/Engineer Jobs in Singapore',
    date: '2020-03-22',
    description: 'A site that compiles Golang jobs in Singapore from other websites.',
    tags: ['Go', 'Career'],
  },
  {
    slug: 'how-to-encrypt-and-decrypt-data-using-aes',
    title: 'How to Encrypt and Decrypt Data using Golang and AES',
    date: '2020-03-13',
    description: 'Learn to encrypt and decrypt data using Go and AES.',
    tags: ['Go', 'Security'],
  },
  {
    slug: 'aws-lambda-go-sam',
    title: 'Deploying a Go Lambda Function using AWS SAM',
    date: '2019-11-21',
    description: 'Deploy a Go function to AWS Lambda using the AWS Serverless Application Model.',
    tags: ['Go', 'AWS'],
  },
  {
    slug: 'create-an-online-resume-using-gatsby',
    title: 'Create an Online Resume using Gatsby',
    date: '2019-11-02',
    description: 'An online resume built with my Gatsby starter.',
    tags: ['Gatsby', 'React'],
  },
  {
    slug: 'flutter-listview-example-using-data-from-a-rest-api',
    title: 'Implement a Flutter ListView using data from a REST API',
    date: '2019-10-12',
    description: 'Build a Flutter ListView that loads data from a REST API.',
    tags: ['Flutter', 'Mobile'],
  },
  {
    slug: 'develop-graphql-web-apis-using-golang',
    title: 'How to create a GraphQL API Server using Go (Golang)',
    date: '2019-09-18',
    description: 'Learn how to create a GraphQL API server using Go.',
    tags: ['Go', 'GraphQL'],
  },
  {
    slug: 'generate-vcard-qrcode-using-go',
    title: 'Generate a QRCode vCard using Go',
    date: '2019-08-31',
    description: 'Generate a vCard QR code with Go.',
    tags: ['Go'],
  },
  {
    slug: 'modernizing-resumes',
    title: 'Innovating the Resume using ReactJS and Ant Design Pro',
    date: '2019-07-17',
    description: 'Modern resumes using ReactJS and Ant Design Pro.',
    tags: ['React'],
  },
  {
    slug: 'docker-elasticsearch-fluentd-nginx',
    title: 'Ingest NGINX container access logs to ElasticSearch using Fluentd and Docker',
    date: '2018-12-01',
    description: 'Ship NGINX access logs to ElasticSearch with Fluentd, Docker and Kibana.',
    tags: ['Docker', 'ElasticSearch'],
  },
  {
    slug: 'go-version-1-11-modules',
    title: 'Introduction to Go Modules in Go v1.11, Goodbye GOPATH!',
    date: '2018-10-07',
    description: 'Getting started with Go modules.',
    tags: ['Go'],
  },
  {
    slug: 'debugging-go-applications-using-delve',
    title: 'Debugging Go applications using Delve',
    date: '2018-05-21',
    description: 'Learn how to debug your Go applications using Delve.',
    tags: ['Go'],
  },
  {
    slug: 'gophercon-singapore-2018',
    title: 'The GopherCon Singapore 2018 Experience',
    date: '2018-05-05',
    description: 'My first GopherCon a few months into learning Go.',
    tags: ['Go', 'Community'],
  },
  {
    slug: 'developing-microservices-using-kafka-and-mongodb',
    title: 'Asynchronous Processing with Go using Kafka and MongoDB',
    date: '2018-04-29',
    description: 'Asynchronous processing with Go microservices, Kafka and MongoDB.',
    tags: ['Go', 'Kafka', 'MongoDB'],
  },
  {
    slug: 'secrets-management-using-docker-hashicorp-vault',
    title: 'How to run HashiCorp Vault (Secrets Management) in Docker',
    date: '2018-04-29',
    description: 'Run HashiCorp Vault in Docker for secrets management.',
    tags: ['Docker', 'Security'],
  },
  {
    slug: 'converting-a-mongodb-docker-compose-file-to-a-kubernetes-deployment',
    title: 'Converting a MongoDB Docker Compose file to a Kubernetes Deployment',
    date: '2018-04-15',
    description: 'Move a MongoDB Docker Compose setup to Kubernetes.',
    tags: ['Kubernetes', 'Docker'],
  },
  {
    slug: 'neo4j-in-docker',
    title: 'My First Experience with Neo4J - running in Docker',
    date: '2018-02-24',
    description: 'Running the Neo4J graph database in Docker.',
    tags: ['Docker', 'Neo4J'],
  },
  {
    slug: 'my-first-go-microservice',
    title: 'My First Go Microservice using MongoDB and Docker Multi-Stage Builds',
    date: '2018-01-29',
    description: 'A Go microservice with MongoDB and Docker multi-stage builds.',
    tags: ['Go', 'Docker'],
  },
  {
    slug: 'docker-stack-sample-with-traefik',
    title: 'Docker Stack with Traefik',
    date: '2017-11-07',
    description: 'Run Traefik using docker stack.',
    tags: ['Docker'],
  },
  {
    slug: 'sample-nodejs-web3js-ethereum-blockchain',
    title: 'Sample NodeJS app to query the Ethereum blockchain',
    date: '2017-10-21',
    description: 'Query the Ethereum blockchain from Node.js with web3.js.',
    tags: ['Node.js', 'Blockchain'],
  },
  {
    slug: 'docker-stack-with-the-official-elasticsearch-kibana',
    title: 'Docker Stack with the official ElasticSearch, Kibana',
    date: '2017-09-24',
    description: 'Run the official ElasticSearch and Kibana images with Docker Stack.',
    tags: ['Docker', 'ElasticSearch'],
  },
  {
    slug: 'using-docker-data-volume-with-a-mysql-container',
    title: 'Using Docker Data Volume with a MySQL container',
    date: '2016-08-20',
    description: 'Persist MySQL data with Docker data volumes.',
    tags: ['Docker', 'MySQL'],
  },
]

export const postUrl = (p: Post) => `${BLOG_BASE_URL}/${p.slug}/`
