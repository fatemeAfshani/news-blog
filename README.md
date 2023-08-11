# News Blog Application

A testing app where Admin Users, after signing up or signing in, can create news, categories, tags, and videos.
They also have the ability to update or delete news and videos as needed,
and readers can watch videos and read news.


Platform Features:
* Advanced search capabilities based on categories, tags, names, and more.
* Readers can like news articles and access sections highlighting the most viewed, most liked, latest, and hottest news.

## Prerequisites
* node.js
* npm
* docker
* docker-compose


## Usage

Follow these steps to begin:

1: Install project dependencies using:

```bash
yarn install
```

2: Initialize your database within a container:
```bash
yarn run dev:db
```
3: Execute the initial migration command for the app:
```bash
npx prisma migrate dev
```

4: Launch the app:
```bash
yarn run start
```



## Documentation
Once the app is running, find detailed documentation at http://localhost:3001/api#/.

### Note for Video Uploads
For uploading and streaming videos, please use Postman instead of the Swagger API documentation.

### Note about Video Streaming
Please note that partial video streaming is currently undergoing development and is not functional.


## Built With
* [typescript](https://www.typescriptlang.org/) - Programming language
* [nest.js](https://docs.nestjs.com/) - a framework for building efficient, scalable Node.js server-side applications
* [postgresql](https://www.postgresql.org/) - Relational database
* [prisma](https://www.prisma.io/) -  Next-generation Node.js and TypeScript ORM



