var editor = {
    load_file: function() {
        var name = $('.ui.dropdown.examples').dropdown('get value');
        if (name) {
            var item = $('.ui.dropdown.examples').dropdown('get item', name);
            var url;
            if (item.is(".custom")) {
                url = "/load/" + name + "/";
            } else {
                url = "/example/" + name + "/";
            }
            $("#editor-container").addClass("loading").removeClass("error");
            var xhr = $.get(url);
            xhr.done(function(example) {
                //console.log(example)
                editor.cm.setValue(example);
                messages.success("File loaded!", true);
            });
            xhr.fail(function() {
                messages.error("Couldn't load that code, sorry :(");
                $("#editor-container").addClass("error");
            });
            xhr.always(function() {
                $("#editor-container").removeClass("loading");
                window.location.hash = "name=" + encodeURIComponent(name);
            });
            return xhr;
            
        }
    },

    save: function() {
        var code = editor.cm.getValue(),
            url = "/save/";
        $(".save").addClass("loading").removeClass("error");
        var xhr = $.ajax(url, {
            type: 'POST',
            data: JSON.stringify({code: code}),
            contentType: 'application/json',
        });
        xhr.done(function(data) {
            window.location.hash = "name=" + encodeURIComponent(data.name);
            var item = $('.ui.dropdown.examples').dropdown('get item', data.name);
            if (!item || !item.is(".custom")) {
                editor.add_custom(data.name);
                $(".ui.dropdown.examples .menu .custom.disabled").remove();
            }
            messages.success("File saved!", true);
        });
        xhr.fail(function() {
            messages.error("Couldn't save your code, sorry :(");
            $(".save").addClass("error");
        });
        xhr.always(function() {
            $(".save").removeClass("loading");
        });
        return xhr;
    },

    add_custom: function(name, menu) {
        if (menu === undefined) {
            menu = $(".ui.dropdown.examples .menu");
        }
        var div = $("<div class='item custom'></div>");
        div.text(name);
        div.attr("data-value", name);
        menu.append(div);
        return div;
    },

    list_custom: function() {
        $("#editor-container").addClass("loading").removeClass("error");
        var xhr = $.get("/load/");
        xhr.done(function(data) {
            if (data.names === null) {
                $(".user .login").show();
                $(".user .logout").hide();
            } else {
                $(".user .login").hide();
                $(".user .logout").show();
                if (data.names.length) {
                    $(".ui.dropdown.examples .menu .custom").remove();
                }
            }
            var menu = $(".ui.dropdown.examples .menu");
            $.each(data.names, function(i, name) {
                editor.add_custom(name, menu);
            });
            $(".ui.dropdown.examples").dropdown('refresh');
        });
        xhr.fail(function() {
            messages.error("Couldn't load that code, sorry :(");
            $("#editor-container").addClass("error");
        });
        xhr.always(function() {
            $("#editor-container").removeClass("loading");
        });
        return xhr;
    },

    compile: function() {
        machine.compile(editor.cm.getValue(), document.getElementById("start_state").value);
    },
};

$(document).ready(function() {
    editor.cm = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: "text/html",
        lineNumbers: true
    });

    $('.ui.dropdown.examples').dropdown({
        onChange: function() {
            editor.load_file();
        }
    });

    $('.action.compile').click(editor.compile);
    $('.action.save').click(editor.save);

    function parse_hash() {
        var pairs = window.location.hash.substring(1).split("&"),
            obj = {},
            pair,
            i;
        for (i in pairs) {
            if (pairs[i] === "") continue;
            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return obj;
    }

    var p = editor.list_custom();
    var hash = parse_hash();
    if (hash.name) {
        p.done(function() {
            $('.ui.dropdown.examples').dropdown('set selected', hash.name);
            $('.ui.dropdown.examples').dropdown('refresh');
            editor.load_file();
        });
    }
    editor.compile();
});
