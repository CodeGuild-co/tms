var graph = {
    render: function() {
        var nodeList = $("#node-list");
        var edgeList = $("#edge-list");
        for (var state in machine.states) {
            if (!machine.states.hasOwnProperty(state)) continue;
            var isHalting = machine.halting_states.indexOf(state) !== -1;
            var nodeSummary = state;
            if (isHalting) {
                nodeSummary = nodeSummary + ", HALT!";
            }
            nodeList.append($("<li></li>").text(nodeSummary));

            for (var edge in machine.states[state]) {
                var details = machine.states[state][edge];
                var edgeSummary = state + "->" + details['state'] + " " + edge + "," + details.write + "," + details.move;
                edgeList.append($("<li></li>").text(edgeSummary));
            }

        }
    }
};

$(document).ready(function() {

});
