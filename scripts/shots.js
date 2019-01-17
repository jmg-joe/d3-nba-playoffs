d3.csv("../data/playoff_shots.csv", function(data){


    var shots = d3.select("svg")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "shot")
        .attr("transform",  function(d){
            return translateCoordsOnSvg(d)
        })

        .on("mouseenter", function (d) {
            addPlayerDescription(this, d)
        })
        .on("mouseleave", function (d) {
           removePlayerDescription(d)
        })
        .on("click", function (d) {
            triggerPlayerModal(d)
        })
            
    appendShotsToSVG(shots, 4);

    var players = d3.nest()
        .key(function(d){ return d.PLAYER_NAME; })
        .rollup(function(a){ return a.length; })
        .sortKeys(d3.ascending)
        .entries(data)

    var playoffGames = d3.nest()
           .key(function(d){ return d.GAME_ID })
           .entries(data)

    players.unshift({"key": "ALL", "value": d3.sum(players, function(d) {return d.value;})});
    var selector = d3.select("#selector");
    var gameSelector = d3.select('#gameSelector');
    selector
        .selectAll("option")
        .data(players)
        .enter()
        .append("option")
           .text(function(d){ return d.key + ": " + d.value + " shots" })
           .property('value', function(d){ return d.key })

    selector   
        .on("change", function(d){
            d3.selectAll(".shot")
                .attr("opacity", "1.0");
            var value = selector.property("value");
            if (value != "ALL"){
                d3.selectAll(".shot")
                    .filter(function(d){ return d.PLAYER_NAME != value; })
                    .attr("opacity", "0.1");
            }

        })

    gameSelector
        .selectAll("option")
        .data(playoffGames)
        .enter()
        .append("option")
            .text(function(d){ return d.key + ' ' + d.values[0].HTM + ' vs. ' + d.values[0].VTM})
            .property('value', function(d){ return d.key })
    
    gameSelector
        .on("change", function(){
            d3.selectAll(".shot")
                .attr("opacity", "1.0");
            var value = gameSelector.property("value")
            console.log(value);
            if (value != "ALL"){
                d3.selectAll(".shot")
                    .filter(function(d){ return d.GAME_ID != value; })
                    .attr("opacity", "0.1")
            }
        })
})

// put shots data onto svg canvas
function appendShotsToSVG(obj, radius){
    obj.append("circle")
    .attr("r", radius)
    .attr("fill", function(d){
        if (d.EVENT_TYPE == "Made Shot") {
            return "green"
        } else {
            return "red"
        }
    });
}

// transform data based on svg on DOM
function translateCoordsOnSvg(d) {
    return "translate(" + ((1.5 * d.LOC_Y) + 50) + "," + ((1.5 * d.LOC_X) + 370) + ")";
}


//event listeners start
function addPlayerDescription(obj,d){
    d3.select(obj).raise()
            .append("text")
            .attr("class", "playername")
            .text(d.PLAYER_NAME)
}

function removePlayerDescription(){
    d3.selectAll("text.playername").remove()
}


function triggerPlayerModal(d){
    $('#myModal').modal();
    d3.select(".modal-header")
        .text(d.PLAYER_NAME)
    d3.select(".modal-body").append("p").text("test")
}
//event listeners end



function work(d){
    d3.selectAll(".shot")
                .attr("opacity", "1.0");
            var value = selector.property("value");
            if (value != "ALL"){
                d3.selectAll(".shot")
                    .filter(function(d){ return d.PLAYER_NAME != value; })
                    .attr("opacity", "0.1");
            }
}