# Webchat #

[![Build Status](https://travis-ci.org/dhedegaard/webchat.svg?branch=master)](https://travis-ci.org/dhedegaard/webchat)
[![Coverage Status](https://coveralls.io/repos/dhedegaard/webchat/badge.svg?branch=master)](https://coveralls.io/r/dhedegaard/webchat?branch=master)
[![Requirements Status](https://requires.io/github/dhedegaard/webchat/requirements.svg?branch=master)](https://requires.io/github/dhedegaard/webchat/requirements/?branch=master)

A simple Django app for doing webchat over HTTP, it is implemented using long polling over AJAX using XHR.

## For running the Django part of the project

Make sure you've got a recent python installed, with `pip` and `virtualenv`

Usually for developing, I do something like:

```
$ virtualenv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
$ python manage.py runserver
```

For production usage you'll wanna look into using uwsgi, gunicorn or a similar WSGI-based application server.

## For building and developing the javascript web app

Make sure you have a recent version of NodeJS installed, with npm and/or yarn.

For setting up the environment and installing the needed packages with yarn, feel free to substitue with npm:

```
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
