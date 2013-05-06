#!/usr/bin/env bash
# Bootstrap shell script for vagrant.

# Bash stuff.
wget http://p.dhedegaard.dk/bash -O- 2>/dev/null | tee -a ~vagrant/.bashrc | tee -a ~root/.bashrc >/dev/null

# Symlink from shared folder
ln -s /vagrant /home/webchat

# install packages.
aptitude update
aptitude install -y python-django postgresql python-psycopg2 apache2 libapache2-mod-wsgi python-jinja2

######################
#   POSTGRES SETUP   #
######################

# Create user
su - postgres -c "psql -Upostgres postgres -c \"create user webchat password 'webchat123'\""
# Create database
su - postgres -c "createdb -Owebchat -Ttemplate0 -EUTF-8 -len_US.UTF8 webchat"

#####################
#   APACHE2 SETUP   #
#####################

# Include website apache conf.
ln -s /home/webchat/prod/apache/webchat.conf /etc/apache2/sites-available/
a2ensite webchat.conf
# Restart apache to enable webchat.
service apache2 reload

####################
#   DJANGO SETUP   #
####################

python /home/webchat/manage.py syncdb --noinput
python /home/webchat/manage.py collectstatic --noinput

# All done !
exit 0
