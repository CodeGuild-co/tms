var editor = {
    load_file: function() {
        var name = $('.ui.dropdown.examples').dropdown('get value');
        if (name) {
            var item = $('.ui.dropdown.examples').dropdown('get item', name);
            var url = "/example/" + name + "/";
            $("#editor-container").addClass("loading").removeClass("error");
            var xhr = $.getJSON(url);
            xhr.done(function(example) {
                editor.cm.setValue(example.code);
                $("#start-state").val(example.start_state);
                $("#start-tape").val(example.start_tape);
                messages.success("File loaded!", true);
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
    },

    view_code: function() {
        $("#editor-container").removeClass("hidden");
        $("#graph-container").addClass("hidden");
        $("#editor-header").text("Code");
    },

    view_graph: function() {
        $("#editor-container").addClass("hidden");
        $("#graph-container").removeClass("hidden");
        $("#editor-header").text("Graph");
    },

    compile: function() {
        machine.compile(editor.cm.getValue(), document.getElementById("start-state").value, document.getElementById("start-tape").value);
        graph.render();
    },
};

$(document).ready(function() {
  
    editor.cm = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: "text/html",
        lineNumbers: true
    });

    editor.cm.setSize($("#editor-container").width(), $("#editor-container").height() * 0.95); // TODO: Make the code editor properly fit the div.

    $('.ui.dropdown.examples').dropdown({
        onChange: function() {
            editor.load_file();
        }
    });

    $('.action.compile').click(editor.compile);
    $("#view-code-button").click(editor.view_code);
    $("#view-graph-button").click(editor.view_graph);

    editor.compile();
});
