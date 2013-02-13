$(function() {
    var csrftoken = $.cookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
    });

    var btn_send = $('input[type=button][name=btn_send]');
    var input = $('input[type=text]');
    var textarea = $('div#chat');
    var lastid = -1;

    input.keypress(function(event) {
        if (event.which === 13) {
            event.preventDefault();
            btn_send.click();
            return false;
        }
        return true;
    });

    btn_send.click(function(event) {
        event.preventDefault();

        var message = input.val();
        if (message.length === 0) {
            return false;
        }

        $.post('/send', {
            'message': message
        }, function(data) {
            if (data !== 'OK') {
                alert('Data not ok:\n\n' + data);
            }
            input.val('');
            input.focus();
        })
        return false;
    });

    var add_message = function(message) {
        var line = '<span class="time">[' + message['time'] + ']</span>: <span class="message">' + message['message'] + '</span><br />';
        textarea.append(line);
        textarea.scrollTop(textarea[0].scrollHeight);
        if (message['id'] > lastid) {
            lastid = message['id'];
        }
    };

    (function() {
        var get_all_messages = function() {
            $.post('/get_all', {}, function(msgs) {
                for (var i in msgs) {
                    add_message(msgs[i]);
                }
            })
        };
        get_all_messages();
    })();

    var get_new_messages = function() {
        $.post('/get_new', {
            'id': lastid
        }, function(msgs) {
            if (msgs !== 'OK') {
                for (var i in msgs) {
                    add_message(msgs[i]);
                }
            }
            setTimeout(get_new_messages, 100);
        });
    }

    setTimeout(get_new_messages, 100);
});