/*global $, _ */
$(function() {
    "use strict";
    // make sure AJAX-requests send the CSRF cookie, or the requests will be rejected.
    var csrftoken = $('input[type=hidden][name=csrfmiddlewaretoken]').val();

    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
    });

    var btn_send = $('button[id=btn_send]');
    var username = $('input#username');
    var input = $('input#input');
    var textarea = $('div#chat');
    var now = moment();
    var in_unload = false;

    $(window).bind('beforeunload', function() {
        in_unload = true;
    });


    // handle enter in the input field to click the "Send" button.
    input.keypress(function(event) {
        if (event.which === 13) {
            event.preventDefault();
            btn_send.click();
            return false;
        }
        return true;
    });

    // Click handler for send button.
    btn_send.click(function(event) {
        event.preventDefault();

        var message = input.val();
        if (message.length === 0) {
            return false;
        }

        var _username = username.val();
        if (_username.length === 0) {
            _username = username.attr('placeholder');
        }

        // attempt to save username in cookie, if any.
        save_username(_username);

        btn_send.addClass('disabled');
        $.post('/send', {
            'message': message,
            'username': _username
        }, function(data) {
            if (data !== 'OK') {
                add_error(data);
            }
            input.val('');
            input.focus();
        }).fail(function(data) {
            var is_json;
            var json;
            try {
                json = $.parseJSON(data.responseText);
                is_json = true;
            } catch (e) {
                is_json = false;
            }

            if (is_json) {
                add_json_error(data, json);
            } else {
                // Show the response text as plaintext.
                var status = data.status;
                var statusText = data.statusText;

                // If we've hit a 400 (Bad Request), show the responseText.
                if (status === 400) {
                    statusText += ": " + data.responseText;
                }
                add_error(status + " " + statusText);
            }
        }).always(function() {
            btn_send.removeClass('disabled');
        });
        return false;
    });

    var save_username = function(_username) {
        if ($.cookie('username') !== _username) {
            $.cookie('username', _username, {expires: 365});
        }
    };

    var date_to_string = function(date) {
        if (now.year() === date.year()) {
            if (now.month() === date.month() && now.date() === date.date()) {
                return date.format('HH:mm');
            } else {
                return date.format('MM-DD HH:mm');
            }
        } else {
            return date.format('YYYY-MM-DD HH:mm');
        }
    };

    // Renders JSON to HTML, that can be appended to the existing messages.
    var render_messages = function(messages) {
        // Convert date objects to string repressentations.
        _.each(messages, function(message) {
            message.formatted_timestamp = date_to_string(message.timestamp);
        });

        // Render the template using underscore.
        return _.template(
            '<% _.each(messages, function(message) { %>' +
                '<span class="time">[<%= message.formatted_timestamp %>] </span>' +
                '<span class="username"><%= message.username %>:</span> ' +
                '<span class="message"><%= message.message %></span><br />' +
                '<% }); %>')({
            messages: messages
        });
    };

    var append_textarea = function(html) {
        textarea.append(html);
        textarea.scrollTop(textarea[0].scrollHeight);
    };

    var add_messages = function(messages) {
        if (in_unload)
            return;
        var rendered_messages = render_messages(messages);
        append_textarea(rendered_messages);
    };

    var add_error = function(data) {
        if (in_unload)
            return;
        var line = '<span class="error"><span class="bold">Error</span>:<br /><pre>' +
            data + '</pre></span>';
        append_textarea(line);
    };

    var add_json_error = function(data, json) {
        append_textarea(_.template(
            '<span class=error"><span class="bold">Error</span>:<br /><pre>' +
            '<%_.forEach(json, function(value, key) {%>' +
                '<%=key%>: <%=value%>\n' +
            '<%})%>' +
            '</pre></<span>', {json: json}));
    };

    /* The last highest ID of a message, this is to avoid returning the same messages
     * more than once.
     */
    var lastid = -1;

    /* Contains the current number of failed requests (for get_new_messages) in a row. */
    var failed_requests_in_a_row = 0;

    var remove_spinner = function() {
        if (textarea.hasClass('spinner'))
            textarea.removeClass('spinner');
    };

    /* Gets new messages from the server by initiating an AJAX POST-request.
     * If any new message(s) was found, some JSON in returned.
     * If no new message(s) was found, "OK" is returned.
     *
     * After 3 failed requests in a row, the loop is stopped.
     */
    var get_new_messages = function() {
        if (failed_requests_in_a_row >= 3) {
            add_error("Reached the max number of failed requests in a row.<br />" +
                      "Click <a href=\"javascript:$.retry_get_new_messages();\">Here</a> to try again!");
            return;
        }
        $.post('/get_new', {
            id: lastid
        }, function(result) {
            failed_requests_in_a_row = 0;
            // this is caused by long polling timeout.
            if (result === 'OK') {
                remove_spinner();
                if (lastid === -1) {
                    lastid = 0;
                }
                return;
            }

            var messages = result.messages;

            /* Convert ISO timestamps to javascript Date objects. */
            _.each(messages, function(message) {
                message.timestamp = moment(message.timestamp);
            });

            /* Try to parse and interpret the resulting json. */
            try {
                lastid = result.lastid;
                add_messages(result.messages);
                remove_spinner();
            } catch (e) {
                add_error(e);
            }
        }).fail(function(data) {
            /* Seems to happen on hibernate, the request will restart. */
            if (data.status === 0) {
                return;
            }

            /* A fail has happened, increment the counter. */
            failed_requests_in_a_row += 1;

            /* Format the error string into something readable, instead of [Object object]. */
            var failed_string = data.status + ": " + data.statusText;
            add_error(failed_string);
        }).always(function() {
            /* Get new messages even when the previous request failed. */
            setTimeout(get_new_messages, 100);
        });
    };

    /* Called by the user, if he/she wants to try and get new messages again
     * after the limit (failed_requests_in_a_row) has been exceeded.
     */
    $.retry_get_new_messages = function() {
        failed_requests_in_a_row = 0;
        setTimeout(get_new_messages, 100);
    };

    setTimeout(get_new_messages, 100);
    input.focus();

    // handle username
    if ($.cookie('username') !== undefined) {
        $('#username').val($.cookie('username'));
    }
});
