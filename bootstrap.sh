#!/usr/bin/env bash
# Bootstrap shell script for vagrant.

# Check to see if we should bootstrap.
if [ -e /root/.bootstrapped ]; then
    echo "Already bootstrapped..."
    service apache2 start  # Weird bug, fix apache not starting on boot.
    exit 0
fi
echo "Bootstrapping..."

# Basic stuff.
wget http://p.dhedegaard.dk/bash -O- 2>/dev/null |\
 tee -a ~vagrant/.bashrc |\
 tee -a ~root/.bashrc >/dev/null
echo "\ncd /home/webchat" >> ~vagrant/.bashrc
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

# Setup is complete, touch a file to avoid running the bootstrap again on halt/up.
touch /root/.bootstrapped

# All done !
exit 0
