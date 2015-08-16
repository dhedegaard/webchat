# Webchat #

[![Build Status](https://travis-ci.org/dhedegaard/webchat.svg?branch=master)](https://travis-ci.org/dhedegaard/webchat)
[![Coverage Status](https://coveralls.io/repos/dhedegaard/webchat/badge.svg?branch=master)](https://coveralls.io/r/dhedegaard/webchat?branch=master)
[![Requirements Status](https://requires.io/github/dhedegaard/webchat/requirements.svg?branch=master)](https://requires.io/github/dhedegaard/webchat/requirements/?branch=master)

A simple Django app for doing webchat over HTTP, it is implemented using long
polling over AJAX using XHR.

## How to get it running.

You can either use `docker`, if you run using the default `Dockerfile` you will
run the Django debug server.

You can also run it using docker-compose, this setup is using postgres,
postfix and uwsgi for a complete setup.

A simple `docker-compose build` and `docker-compose run` will sufficem then
simply forward through nginx, apache or similar.

The third option is setting up a virtualenv and installing the packages in
`requirements.txt` and `requirements-prod.txt`.

## TODO

Future development might involve:
- Using websockets
- More structure on the javascript, for instance using backbone.js
- Test coverage on javascript
