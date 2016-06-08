var json1 = [ { "Object": "Sym1", "parent": "d3d.o", "value": 0 },
              { "Object": "Sym2", "parent": "d3d.o", "value": 1 },
	      { "Object": "Sym3", "parent": "d3d.o", "value": 2 },
	      { "Object": "Sym4", "parent": "d3d.o", "value": 2 },
	      { "Object": "Sym1", "parent": "ttf.o", "value": 0 },
	      { "Object": "Sym2", "parent": "ttf.o", "value": 0 },
	      { "Object": "Sym3", "parent": "ttf.o", "value": 0 },
	      { "Object": "Sym1", "parent": "alx.o", "value": 0 },
	      { "Object": "Sym2", "parent": "alx.o", "value": 1 },
	      { "Object": "Sym3", "parent": "alx.o", "value": 2 },
	      { "Object": "Sym1", "parent": "klf.o", "value": 0 },
	      { "Object": "Sym2", "parent": "klf.o", "value": 1 },
	      { "Object": "Sym3", "parent": "klf.o", "value": 2 },
	      { "Object": "Sym4", "parent": "klf.o", "value": 2 },
    ];


var calls = [ { source: 0, target: 1}, {source: 1, target: 2} ];

blockSize = 64;

function nodeXFunction (obj) { if(obj.index) return 32 + ((obj.index - 1) * blockSize);
			       console.log("Object: "+obj+" has no index"); return 0; }
function nodeYFunction (obj) {
    var y = (obj.row - 1) * blockSize;
    console.log("NY: "+obj.Object+" returning "+y+" for row "+obj.row)
    return y; }

function nodeTranslationFunction (obj) { var x = nodeXFunction(obj);
					 var y = nodeYFunction(obj);
					 return "translate ("+x+" "+y+")"; }

function nodeDrawCallback(_this, thing)
{
    group = thing.append('g');
    group.attr( "transform", nodeTranslationFunction );
    group.append('rect').attr('x', 0)
        .attr('y', 0)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', _this.config.blockSize)
        .attr('height', _this.config.blockSize)
        .style('fill', function(obj) {
            return _this.config.colors[obj.color % _this.config.colors.length] || _this.config.colors[0];
        })
        .attr('class', 'relationshipGraph-block')
        .on('mouseover', _this.tip ? _this.tip.show : noop)
        .on('mouseout', _this.tip ? _this.tip.hide : noop)
        .on('click', function(obj) {
            _this.tip.hide();
            _this.config.onClick(obj);
        });
    group.append('text').attr('x', 0).attr('y', (_this.config.blockSize)/2).attr("fill", "#000").text(function(obj) { return obj.Object; });
    group.attr('class', 'relationshipGraph-node');


}

function initGraph()
{
    return d3.select('#graph').relationshipGraph({
        'showTooltips': true,
        'maxChildCount': 3,
	'showKeys': false,
	'blockSize': 32,
	'nodeDrawCallback': nodeDrawCallback,
	'thresholds': [1, 2, 3], // This is the threshold used for each colour
	onClick: function(obj) { // This is called when a symbol is clicked
	},
	colors: ['red', 'green', 'blue'],
    });
}

var graph = initGraph();


graph.data(json1);

var interval = null;

function data1() {
    if (interval != null) {
        clearInterval(interval);
    }
    graph.data(json1);
    document.querySelector('h1').innerHTML = 'Package View';
}

function random() {
    graph = initGraph();
    var getData = function () {
        var json = [ { "Object": "Sym3", "parent": "ttf.o", "value": 2 } ];

        for (var j = 0; j < 35; j++) {
            var obj = {
                'parent': 'parent' + Math.floor(Math.random() * 6),
                'value': 1000000000 * Math.floor(Math.random() * 3)
            };

            json.push(obj);
        }

        graph.data(json);
    };

    getData();

    if (interval === null) {
        interval = setInterval(getData, 1000);
    }

    document.querySelector('h1').innerHTML = 'Random Data';
}

// Thing to add all the callers
var data = [ "A", "B", "C", "D" ];

var group = d3.select(".callsIn")
    .selectAll("rect")
    .data(data)
    .enter().append("g");

group.append("rect").attr("width", function(d) { return "100"; })
    .attr("height", function(d) { return 32; })
    .attr("x", 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("y", function(d, index) { return index*40; })
    .style("fill", "#000000");

group.append("text")
    .attr("x", 10)
    .attr("y", function(d, index) { return index*40+20; })
    .style("fill", "#ffffff")
    .text(function(d) { return "Package "+d });

// And the same for calls out
var data = [ "E", "F", "G", "H" ];

var group = d3.select(".callsOut")
    .selectAll("rect")
    .data(data)
    .enter().append("g");

group.append("rect").attr("width", function(d) { return "100"; })
    .attr("height", function(d) { return 32; })
    .attr("x", 0)
    .attr("y", function(d, index) { return index*40; })
    .attr("rx", 4)
    .attr("ry", 4)

    .style("fill", "#000000");

group.append("text")
    .attr("x", 10)
    .attr("y", function(d, index) { return index*40+20; })
    .style("fill", "#ffffff")
    .text(function(d) { return "Package "+d });
