d3.csv("../data/playoff_shots.csv", function(data){
    var shots = d3.select("svg")
        .selectAll("g")
            .data(data)
            .enter()
            .append("g")
                .attr("class", "shot")
                    .attr("transform", function(d){
                        return "translate(" + ((1.5 * d.LOC_Y) + 50) + "," + ((1.5 * d.LOC_X) + 370) + ")";
                    })
            .on("mouseenter", function(d){
                d3.select(this).raise()
                    .append("text")
                    .attr("class", "playername")
                    .text(d.PLAYER_NAME)
                console.log('enter')
            })
            .on("mouseleave", function(d){
                d3.selectAll("text.playername").remove();
                console.log('leave')
            })
            .on("click", function(d){
                console.log('click')
                $('#myModal').modal();
                d3.select(".modal-header")
                    .text(d.PLAYER_NAME)
                d3.select(".modal-body").append("p").text("hello")
            })
            
    shots.append("circle")
        .attr("r", 4)
           .attr("fill", function(d){
               if (d.EVENT_TYPE == "Made Shot" ) {
                    return "green"
                
               }else{
                   return "red"
               }
               
           })
    var players = d3.nest()
        .key(function(d){ return d.PLAYER_NAME; })
        .rollup(function(a){ return a.length; })
        .sortKeys(d3.ascending)
        .entries(data)

    players.unshift({"key": "ALL", "value": d3.sum(players, function(d) {return d.value;})})    
    var selector = d3.select("#selector")
    selector
        .selectAll("option")
        .data(players)
        .enter()
        .append("option")
           .text(function(d){ return d.key + ": " + d.value + " shots" })
           .property('value', function(d){ return d.key })

    selector   
        .on("change", function(){
            d3.selectAll(".shot")
                .attr("opacity", "1.0");
            var value = selector.property("value");
            console.log(value);
            if (value != "ALL"){
                d3.selectAll(".shot")
                    .filter(function(d){ return d.PLAYER_NAME != value; })
                    .attr("opacity", "0.1");
            }

        })
    console.log(players);
})