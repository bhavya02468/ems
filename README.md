# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

# Nodejs Base Backend

Nodejs project structure

## Install

###Install current stable version of nodejs

curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh

sudo bash nodesource_setup.sh

sudo apt-get install nodejs

Nodejs current version check

nodejs -v

###Install redis server

wget http://download.redis.io/redis-stable.tar.gz

tar xvzf redis-stable.tar.gz

cd redis-stable

sudo apt-get install make

sudo apt-get install gcc

sudo apt-get install tcl

sudo apt-get install build-essential

sudo apt-get update

if there is another error like "fatal error: jemalloc/jemalloc.h: No such file or directory"

just run "make distclean"

make

make test

https://askubuntu.com/questions/868848/how-to-install-redis-on-ubuntu-16-04
https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04

###Install mongodb

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

sudo apt-get update

sudo apt-get install -y mongodb-org

sudo service mongod start

sudo service mongod stop

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

## Env setup
create .env file in root folder

add this line in .env file for env set

NODE_ENV="local"

##Database connection
default database info (mongodb)

db name - demo

db port - 27017 (default mongodb port)

db user - demo

db pass - demo

##Redis server
it is use for token store

default redis server setup

server: 'localhost',

port: 6379, (default redis port)


### Important for uploading media
*Ist Method Go to multer node_modules -> node_modules/multer/lib/make-middleware.js

var path = require('path');
* Include this on top of the file where modules are imported
* Then in the file object, also add the key `extension: path.extname(filename)`
**

*2nd Method,
var path = require('path');
Now add  path.extname(filename) while creating file name **


### Set language locale and remove carier info

1. Go to node_modules/authy-client/dist/src/client.js
  ** In function startPhoneVerification(), add locale: 'en' in the body object otherwise default locale is set according to country code

  ** this.rpc.postAsync({}) ---> After the response of the function comment out the code "carrier" and "is_cellphone" as it didn't work for some countries
So need to comment out as it send message but throws error

# Db
*** 18.191.236.200 -> Production Database
* Admin User
use admin
db.createUser(
   {
     user: "username",
     pwd: "password",
     roles: ["root"],
   }
)

#apidoc
sudo npm install apidoc -g

#swagger
download dist folder from github

#video
install sudo apt install ffmpeg -> for thumbnail install npm package as well as ffmpeg

#Increase limit for request via node modules
Go to raw-body folder -> index.js

var limit = bytes.parse(opts.limit)

In the above line increase the limit
