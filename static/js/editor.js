var editor;

$(document).ready(function() {

    function load_file() {
        var name = $('.ui.dropdown.examples').dropdown('get value');
        if (name) {
            var item = $('.ui.dropdown.examples').dropdown('get item', name);
            var url;
            if (item.is(".custom")) {
                url = "/load/" + name + "/";
            } else {
                url = "/examples/" + name + "/";
            }
            $("#editor-container").addClass("loading").removeClass("error");
            var xhr = $.get(url);
            xhr.done(function(example) {
                editor.setValue(example.code);
                messages.success("File loaded!", true);
            });
            xhr.fail(function() {
                messages.error("Couldn't load that code, sorry :(");
                $("#editor-container").addClass("error");
            });
            xhr.always(function() {
                $("#editor-container").removeClass("loading");
                var hash = "name=" + name;
                window.location.hash = hash;
            });
            return xhr;
        }
    }

	function save() {
		var code = editor.getValue(),
            url = "/save/";
        $(".save").addClass("loading").removeClass("error");
        var xhr = $.ajax(url, {
            type: 'POST',
            data: JSON.stringify({code: code}),
            contentType: 'application/json',
        });
        xhr.done(function(data) {
            window.location.hash = "name=" + encodeURIComponent(data.name);
            hash = {
                name: data.name
            }
            //$(".ui.dropdown.examples .menu .custom").remove();
            var item = $('.ui.dropdown.examples').dropdown('get item', data.name);
            if (!item || !item.is(".custom")) {
                add_custom(data.name);
            }
            messages.success("File saved!", true);
            messages.info("Bookmark this page to come back to your work later", true);
        });
        xhr.fail(function() {
            messages.error("Couldn't save your code, sorry :(");
            $(".save").addClass("error");
        });
        xhr.always(function() {
            $(".save").removeClass("loading");
        });
        return xhr;
	}

    function add_custom(name, menu) {
        if (menu === undefined) {
            menu = $(".ui.dropdown.examples .menu");
        }
        var div = $("<div class='item custom'></div>");
        div.text(name);
        div.attr("data-value", name);
        menu.append(div);
        return div;
    }

    function list_custom() {
        $("#editor-container").addClass("loading").removeClass("error");
        var xhr = $.get("/load/");
        xhr.done(function(data) {
            if (data.names === null) {
                $(".user .login").show();
                $(".user .logout").hide();
                // Show "None yet" in list
            } else {
                $(".user .login").hide();
                $(".user .logout").show();
                // get sign out button to sign out
            }
            $(".ui.dropdown.examples .menu .custom").remove();
            var menu = $(".ui.dropdown.examples .menu");
            $.each(data.names, function(i, name) {
                add_custom(name, menu);
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
    }

    function compile() {
        machine.compile(editor.getValue());
    }

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

    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: "text/html",
        lineNumbers: true
    });

    $('.ui.dropdown.examples').dropdown({
        onChange: function() {
            load_file();
        }
    });

    $('.action.compile').click(compile);
    $('.action.save').click(save);

    var hash = parse_hash();
    var p = list_custom();
    if (hash.name) {
        p.done(function() {
            $('.ui.dropdown.examples').dropdown('set selected', hash.name);
            $('.ui.dropdown.examples').dropdown('refresh');
        });
    }
    compile();
});
