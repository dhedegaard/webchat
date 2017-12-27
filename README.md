# Webchat #

[![Build Status](https://travis-ci.org/dhedegaard/webchat.svg?branch=master)](https://travis-ci.org/dhedegaard/webchat)
[![Coverage Status](https://coveralls.io/repos/dhedegaard/webchat/badge.svg?branch=master)](https://coveralls.io/r/dhedegaard/webchat?branch=master)
[![Requirements Status](https://requires.io/github/dhedegaard/webchat/requirements.svg?branch=master)](https://requires.io/github/dhedegaard/webchat/requirements/?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b378ae9e1faa460999054d27a399750a)](https://www.codacy.com/app/dhedegaard/webchat)

A simple Django app for doing webchat over HTTP, the frontend is implemented in React using Typescript, and uses the fetch API for long polling.

## For running the Django part of the project

Make sure you've got a recent python (3.4+, 2.7 not supported by Django 2.0+) installed, with `pip` and `virtualenv`

Usually for developing, I do something like:

```
$ virtualenv venv
$ source venv/bin/activate
(venv) $ pip install -r requirements.txt
(venv) $ python manage.py runserver
```

For production usage you'll wanna look into using uwsgi, gunicorn or a similar WSGI-based application server.

## For building and developing the typescript web app

Make sure you have a recent version of NodeJS installed, with npm and/or yarn.

For setting up the environment and installing the needed packages with yarn, feel free to substitue with npm:

```
$ cd webapp
$ yarn
````

For development there's a `watch` script, call it like:

```
$ yarn watch
```

For building a minified production bundle:

```
$ yarn start
```

The frontend uses a few polyfills for supporting IE10+, these include babel-polyfill for `Promise` and whatwg-fetch for `fetch`.