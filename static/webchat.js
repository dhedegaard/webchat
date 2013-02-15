$(function() {
    "use strict";
    // make sure AJAX-requests send the CSRF cookie, or the requests will be rejected.
    var csrftoken = $.cookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
    });

    var btn_send = $('button[id=btn_send]');
    var username = $('input#username');
    var input = $('input#input');
    var textarea = $('div#chat');
    var lastid = -1;

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

        // attempt to save username if any.
        save_username(_username);

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
            add_error(data);
        });
        return false;
    });

    var save_username = function(_username) {
        if ($.cookie('username') !== _username) {
            $.cookie('username', _username, {expires: 365});
        }
    };

    var add_message = function(message) {
        var line = '<span class="time">[' + message.time + ']</span> ' +
            '<span class="username">' + message.username + '</span>: ' +
            '<span class="message">' + message.message + '</span><br />';
        textarea.append(line);
        textarea.scrollTop(textarea[0].scrollHeight);
        if (message.id > lastid) {
            lastid = message.id;
        }
    };

    var add_error = function(data) {
        var line = '<span class="error">Error:<br /><pre>' + data + '</pre></span>';
        textarea.append(line);
        textarea.scrollTop(textarea[0].scrollHeight);
    };

    var get_new_messages = function() {
        $.post('/get_new', {
            'id': lastid
        }, function(msgs) {
            // this is caused by long polling timeout.
            if (msgs === 'OK') {
                return;
            }

            try {
                for (var i in msgs) {
                    if (msgs[i] !== undefined) {
                        add_message(msgs[i]);
                    }
                }
            } catch (e) {
                add_error(e);
            }
        }).fail(function(data) {
               add_error(data);
        }).always(function() {
            get_new_messages();
        });
    };

    setTimeout(get_new_messages, 100);
    input.focus();

    // handle username
    if ($.cookie('username') !== undefined) {
        $('#username').val($.cookie('username'));
    }
});