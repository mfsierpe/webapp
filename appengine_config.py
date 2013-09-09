# This file is part of VertNet: https://github.com/VertNet/webapp
#
# VertNet is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# VertNet is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with VertNet.  If not, see: http://www.gnu.org/licenses
import json
import logging
import os
import sys

def fix_path():
	sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
	sys.path.append(os.path.join(os.path.dirname(__file__), 'vertnet'))

fix_path()

IS_DEV = 'Development' in os.environ['SERVER_SOFTWARE']

def get_auth():
    """Return auth file as a JSON object."""
    path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'auth.txt')
    logging.info(path)
    auth = json.loads(open(path, "r").read())
    return auth

# Set namespace:
def namespace_manager_default_namespace_for_request():
    if IS_DEV:
    	return ''
    else:
    	return 'index-2013-08-08'

engineauth = {
    # Login uri. The user will be returned here if an error occures.
    'login_uri': '/', # default 'login/'
    # The user is sent here after successfull authentication.
    'success_uri': '/',
    'secret_key': 'CHANGE_TO_A_SECRET_KEY',
    # Comment out the following lines to use default
    # User and UserProfile models.
    #'user_model': 'models.CustomUser',
}

auth = get_auth()

if IS_DEV:
    # GitHub settings for Development
    provider = auth['dev']
else:
    # GitHub settings for Production
    provider = auth['prod']

engineauth['provider.github'] = provider

def webapp_add_wsgi_middleware(app):
    from engineauth import middleware
    return middleware.AuthMiddleware(app)
