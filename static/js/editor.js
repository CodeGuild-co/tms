var editor = {
    load_file: function() {
        var name = $('.ui.dropdown.examples').dropdown('get value');
        if (name) {
            var item = $('.ui.dropdown.examples').dropdown('get item', name);
            window.location.href = "/example/" + name + "/";
            var url;
            if (item.is(".custom")) {
                url = "/load/" + name + "/";
            } else {
                url = "/example/" + name + "/";
            }
            $("#editor-container").addClass("loading").removeClass("error");
            var xhr = $.getJSON(url);
            xhr.done(function(example) {
                editor.monaco.setValue(example.code);
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
                window.location.hash = "name=" + encodeURIComponent(name);
            });
            return xhr;
            
        }
    },

    save: function() {
        var code = editor.monaco.getValue(),
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
        machine.compile(editor.monaco.getValue(), document.getElementById("start-state").value, document.getElementById("start-tape").value);
        graph.render();
    },
};

$(document).ready(function() {
    require.config({ paths: { 'vs': '/static/js/monaco/vs' }});
  
  	require(['vs/editor/editor.main'], function() {
      editor.monaco = monaco.editor.create(document.getElementById("code-editor"), {
        minimap: {
          enabled: false
        }
      });
  	});

    $('.ui.dropdown.examples').dropdown({
        onChange: function() {
            editor.load_file();
        }
    });

    $('.action.compile').click(editor.compile);
    $("#view-code-button").click(editor.view_code);
    $("#view-graph-button").click(editor.view_graph);


    /*
    */
    editor.compile();
});
