function tsort(edges) {
  var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
      sorted  = [], // sorted list of IDs ( returned value )
      visited = {}; // hash: id of already visited node => true

  var Node = function(id) {
    this.id = id;
    this.afters = [];
  }

  // 1. build data structures
  edges.forEach(function(v) {
    var from = v[0], to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to]     = new Node(to);
    nodes[from].afters.push(to);
  });

  // 2. topological sort
  Object.keys(nodes).forEach(function visit(idstr, ancestors) {
    var node = nodes[idstr],
        id   = node.id;

    // if already exists, do nothing
    if (visited[idstr]) return;

    if (!Array.isArray(ancestors)) ancestors = [];

    ancestors.push(id);

    visited[idstr] = true;

    node.afters.forEach(function(afterID) {
      if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
        throw new Error('closed chain : ' +  afterID + ' is in ' + id);

      visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
    });

    sorted.unshift(id);
  });

  return sorted;
}

var sigmoid = function(val) {
	return 2/(exp(-2*val)) - 1.0;
}

//Utility comparison function for sorting genes
function geneComparison() {
	return function(a,b) {
		return a.out < b.out;
	}
}

var Neuron = function() {
	return {
	incoming : [],
	value : 1.0
	}
}

var Network = function() {
	return {
		neurons:[],
		numInputs: config.numInputs,
		numOutputs: config.numOutputs,
		maxNumNeurons: config.maxNumNeurons,
	}
}

var generateNetwork = function(genome) {
	var network = new Network();
	for(var i = 0; i < config.numInputs; i++)
		network.neurons.push(new Neuron());

	for(var i = 0; i < network.numOutputs; i++)
		network.neurons[network.maxNumNeurons + i] = new Neuron();

	genome.genes.sort(geneComparison());

	for(var i = 0; i < genome.genes.length; i++) {
		var gene = genome.genes[i];
		if(gene.enabled) {
			if(!network.neurons[gene.out])
				network.neurons[gene.out] = new Neuron();

			network.neurons[gene.out].incoming.push(gene);

			if(!network.neurons[gene.into])
				network.neurons[gene.into] = new Neuron();
		}
	}

	genome.network = network;
}

//inputs is list of inputs
//network is network object
var evaluateNetwork = function(genome,network,inputs) {
	inputs.push(1);	//Push the bias
	if(inputs.length != network.numInputs) {
		console.log("Incorrect number of inputs for neural network");
		for(o = [],i = 0; i < network.numOutputs; i++) o.push[0];
		return o;	//return
	}

	//Initialize the inputs
	for(var i = 0; i < network.numInputs; i++) {
		network.neurons[i].value = inputs[i];
	}

	var edges = [];
	for(var i = 0; i < genome.genes.length; i++) {
		edges.push([genome.genes[i].into,genome.genes[i].out]);
	}
	var sorted;
	try {
    sorted = tsort(edges);
    console.log(sorted);
	  }
	catch (e) {
	    console.log(e.message);
	  }

	var sum = 0;
  var ind;
  
	//Evaluate the hidden and output layer neurons
	for(var i in sorted) {
    ind = sorted[i];
    if(ind >= network.numInputs) {
      var neuron = network.neurons[ind];
  		for(var j = 0; j < neuron.incoming.length; j++) {
  			var incoming = neuron.incoming[j];	//Pick a connection
  			var other = network.neurons[incoming.into];	//Find other end of the connection
  			//Multiply other end of the connection to weight of the connection and add to sum
  			sum = sum + incoming.weight * other.value;
  		}

  		if(neuron.incoming.length > 0) {
  			network.neurons[i].value = sigmoid(sum);
  		}
    }
	}

	var o = [];	//Output list
  //Populate the output list
	for(var i = network.maxNumNeurons; i < network.maxNumNeurons + network.numOutputs; i++) {
			o.push(network.neurons[i].value)
		}
	return o;
}
