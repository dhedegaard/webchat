FROM node:10 as frontend
WORKDIR /app

COPY package.json ./
RUN npm install

COPY webapp ./webapp
COPY tsconfig.json tslint.json webpack.config.js ./
RUN npm start

FROM python:3.6

COPY . ./
COPY --from=frontend /app/webchat/static/* webchat/static/
RUN pip install -r requirements.txt -r requirements.prod.txt

ENV PORT 8080
EXPOSE ${PORT}

RUN python manage.py test && \
  python manage.py collectstatic -c --noinput

CMD python manage.py migrate && \
  gunicorn webchat.wsgi -w 10
