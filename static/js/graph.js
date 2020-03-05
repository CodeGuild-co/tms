var options;

options = {
  edges: {
    width: 5
  },
};



var graph = {
    render: function() {
        //var nodeList = $("#node-list");//

        var input = "";
        for (var state in machine.states) {
            if (!machine.states.hasOwnProperty(state)) continue;
            var isHalting = machine.halting_states.indexOf(state) !== -1;
            var nodeSummary = state;
            if (isHalting) {
                nodeSummary = nodeSummary + ", HALT!";
            }
            //nodeList.append($("<li></li>").text(nodeSummary));//



            for (var edge in machine.states[state]) {
                var details = machine.states[state][edge];
                input += state + "->" + details['state'] + '[label="' + edge + " " + details.write + " " + details.move + '"];';
                //edgeList.append($("<li></li>").text(edgeSummary));//

            }


        }

        // This is what always has to be at the beginning of the DOT language
        var beginning = "digraph{node[shape=circle,color=blue,fontcolor=white,fontsize=20];edge[length=400,color=black,fontcolor=black,fontsize=20];";

        // This is what has to be at the end of the DOT langauge if there is a HALT state
        var end = "halt[fontcolor=white,color=red]}";

        // This variable stores final DOT code - right now it's what always has be at the beginning of DOT code plus the input
        var finalDOT = beginning + input; // CHANGE INPUT VARIABLE TO WHATEVER YOU NAMED THE VARIABLE

        // If the input has a HALT state:
        if (input.includes("halt"))
        {
        	// Add the optional end code to the DOT code to make the HALT node red
        	finalDOT += end;
        }
        else
        {
        	// Add the semicolon at the end
        	finalDOT += "}";
        }

        // Parse the DOT language
        var data = vis.parseDOTNetwork(finalDOT);

        // Get the container for the graph
        var container = document.getElementById('mynetwork'); // CHANGE 'MYNETWORK' TO THE ID OF THE DIV THAT WILL STORE THE GRAPH IMAGE

        // Draw the network graph in the container
        var network = new vis.Network(container, data);

        network.setOptions(options);
    }
};

$(document).ready(function() {

});

