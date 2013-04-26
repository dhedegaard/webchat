#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Contains some helper methods.
"""
import os

import jinja2

from webchat.settings import TEMPLATE_DIRS


def render_jinja2_template(template, **env):
    """
    This method renders then template by the template filename with the
    environment specified.

    :param template: The filename of the template.
    :param env: The environment to send to the render method.

    Returns the text rendered, or None if no valid template was found.
    """
    # Iterate on django template paths in the order of the tuple.
    for template_dir in TEMPLATE_DIRS:
        template_path = os.path.join(template_dir, template)
        if os.path.isfile(template_path):
            # Create the template.
            with open(template_path, 'r') as f:
                template = jinja2.Template(f.read())

            # Render template with the environment.
            return template.render(**env)

    return None