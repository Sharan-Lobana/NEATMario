var http = require("http");
var sleep = require("sleep");
var robot = require("robotjs");
var url = require("url");

http.createServer(function (request, response) {
	var path = url.parse(request.url).pathname;
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Hello World\n');
}).listen(8002);


console.log('Server running at http://127.0.0.1:8002/');

var Config = {
//the global variables defined here
BoxRadius :6,
InputSize:169, //BoxRadius*2+1)*(BoxRadius*2+1),
Inputs :2,//InputSize+1,
Outputs :1,
ButtonNames : [
		"A",
		"Up",
		"Down",
		"Left",
		"Right",
	],
Population :500,
DeltaDisjoint :2.0,
DeltaWeights :0.4,
DeltaThreshold :1.0,
StaleSpecies :15,
MutateConnectionsChance :0.25,
PerturbChance :0.90,
CrossoverChance :0.75,
LinkMutationChance :2.0,
NodeMutationChance :0.50,
BiasMutationChance :0.40,
StepSize :0.1,
DisableMutationChance :0.4,
EnableMutationChance :0.2,
TimeoutConstant :20,
MaxNodes :1000
};

var gXOff = 0, gYOff = 0;
var InputsArray = [];

Config.sigmoid = function(x){
	return 1/(1+math.exp(-4.9*x))
}

//Gene module==============
var Gene = function(){
	var into = 0;
	var out = 0;
  var	weight = 0.0;
	var enabled = true;
	var innovation = 0;

	return{
		'into':into,
		'out':out,
		'weight':weight,
		'enabled':enabled,
		'innovation':innovation,
	}
};


function copyGene(gene){
  gene2 = new Gene();
	gene2.into = gene.into;
	gene2.out = gene.out;
	gene2.weight = gene.weight;
	gene2.enabled = gene.enabled;
	gene2.innovation = gene.innovation;
	return gene2;
}

function disjoint(genes1, genes2){
	var i1 = {};
	var gene ={};
	for (i in genes1){
	  	gene = genes1[i];
		i1[gene.innovation] = true;
	}

	var i2 = {};
	for (i in genes2){
	  	gene = genes2[i];
		i2[gene.innovation] = true;
	}

	var disjointGenes = 0;
	for (i in genes1){
	  gene = genes1[i];
		if (!i2[gene.innovation]){
			disjointGenes = disjointGenes+1;
		}
	}

	for (i in genes2){
	  gene = genes2[i];
		if (!i1[gene.innovation]){
			disjointGenes = disjointGenes+1;
		}
	}

	var n = Math.max(genes1.length,genes2.length);
	return disjointGenes / n;
}

function weights(genes1, genes2){

	var i2 = {};
	var gene={};

	for (i in genes2){
		gene = genes2[i];
		i2[gene.innovation] = gene;
	}

	var sum = 0;
	var coincident = 0;
	var gene2={};

	for (i in genes1){
		gene = genes1[i];

		if (i2[gene.innovation] != null){
		  	gene2 = i2[gene.innovation];
			sum = sum + Math.abs(gene.weight - gene2.weight);
			coincident = coincident + 1;
		}
	}
	return sum / coincident;
}

function checkForCycle(genes) {
	//Check if the given gene list contains a cycle
	var edges = [];
	for(var i in genes) {
		edges.push([genes[i].into,genes[i].out]);
	}
	var sorted;
	try {
		sorted = tsort(edges);
		}
	catch(e) {
		return true;
	}
	return false;
}
//Genome module
var Genome = function(){
	var genes = [];
	var fitness = 0;
	var adjustedFitness = 0;
	var network = {};
	var globalRank = 0;
	var mutationRates = {};
	mutationRates['connections'] = Config.MutateConnectionsChance;
	mutationRates['link'] = Config.LinkMutationChance;
	mutationRates['bias'] = Config.BiasMutationChance;
	mutationRates['node'] = Config.NodeMutationChance;
	mutationRates['enable'] = Config.EnableMutationChance;
	mutationRates['disable'] = Config.DisableMutationChance;
	mutationRates['step'] = Config.StepSize;

	return{
		'genes':genes,
		'fitness':fitness,
		'adjustedFitness':adjustedFitness,
		'network':network,
		'globalRank':globalRank,
		'mutationRates':mutationRates,
	}
};

function copyGenome(genome){
	var genome2 = new Genome();

	for (g =0; g<genome.genes.length;g++){
		genome2.genes.push(copyGene(genome.genes[g]));
	}

	genome2.mutationRates['connections'] = genome.mutationRates['connections'];
	genome2.mutationRates['link'] = genome.mutationRates['link'];
	genome2.mutationRates['bias'] = genome.mutationRates['bias'];
	genome2.mutationRates['node'] = genome.mutationRates['node'];
	genome2.mutationRates['enable'] = genome.mutationRates['enable'];
	genome2.mutationRates['disable'] = genome.mutationRates['disable'];
	return genome2;
}

function basicGenome(){
	var genome = new Genome();
	pool.highestHiddenNeuronID = Config.Inputs;

	//Populate the genes list of genome
	//Each input is connected to each output
	for(var i = 0; i <= Config.Inputs; i++) {
		for(var j = 0; j < Config.Outputs; j++) {
			var gene = new Gene();
			gene.into = i;
			gene.out = Config.MaxNodes + j;
			gene.weight = Math.random()*4-2;
			gene.innovation = i*Config.Outputs + j;
			genome.genes.push(gene);
		}
	}

	mutate(genome);
	return genome;
}



function crossover(g1, g2){
	// Make sure g1 is the highers fitness genome
	if (g2.fitness > g1.fitness){
		var tempg = g1;
		g1 = g2;
		g2 = tempg;
	}

	var child = new Genome();

	var innovations2 = {};
	var gene={};

	for (i=0;i<g2.genes.length;i++){
		gene = g2.genes[i];
		innovations2[gene.innovation] = gene;
	}

	var gene1={};
	var gene2={};

	for (i=0;i<g1.genes.length;i++){

	  	gene1 = g1.genes[i];
		gene2 = innovations2[gene1.innovation];
		if (gene2 != null && (Math.random() < 0.5) && gene2.enabled){
			child.genes.push(copyGene(gene2));
		}else{
			child.genes.push(copyGene(gene1));
		}
	}

	for (mutation in g1.mutationRates){
		child.mutationRates[mutation] = g1.mutationRates[mutation];
	}

	return child;
}

//TODO:Check this function returns list of valid neurons
function randomNeuron(genes, nonInput){
	var neurons = {};

	//Consider candidature of input neurons only if nonInput is false
	if (!nonInput){
		for (var i=0;i<=Config.Inputs;i++){
			neurons[i] = true;
		}
	}

	//Consider output neurons for candidature always
	for (var o=0;o<Config.Outputs;o++){
		neurons[Config.MaxNodes+o] = true;
	}


	for (var i in genes){
		if ((!nonInput) || (genes[i].into > Config.Inputs)){
			neurons[genes[i].into] = true
		}
		if ((!nonInput) || (genes[i].out > Config.Inputs)){
			neurons[genes[i].out] = true;
		}
	}

	var count = 0;
	for(var i in neurons)
	{
		count += 1;
	}

	var n = Math.floor(Math.random()*count);

	for(var i in neurons) {
		if(n==0) {
			//Will return neuron id
			return parseInt(i);
		}
		n = n-1;
	}
}


function containsLink(genes, link){
	var gene={};
	for (i=0;i<genes.length;i++){
	  		gene = genes[i];
			if ((gene.into == link.into) && (gene.out == link.out)){
				return true;
			}
		}
	return false;
}
// mutates the weight of genes
function pointMutate(genome){
	var step = genome.mutationRates['step'];
	var gene={};

	for (i=0;i<genome.genes.length;i++){

		gene = genome.genes[i];

		if (Math.random() < Config.PerturbChance){
			gene.weight = gene.weight + (Math.random()*2-1)*step;
		}else{
			gene.weight = Math.random()*4-2;
		}
	}
}


//Create a new connection between two random nodes selected out of which one can't be any input node
//TODO: make sure linkMutate doesn't introduce a cycle

function linkMutate(genome, forceBias){
	//neuron1 can be an input neuron
	var neuron1 = randomNeuron(genome.genes, false);
	//neuron2 shouldn't be an input neuron
	var neuron2 = randomNeuron(genome.genes, true);
	// console.log("LinkMutate Called :==: Neuron1: "+neuron1+", Neuron2: "+neuron2);
	var newLink = new Gene();

	if(neuron1 && neuron2){
	newLink.into = neuron1;
	newLink.out = neuron2;
	}
	if (forceBias) {
		newLink.into = Config.Inputs;
	}

	if(newLink.into == newLink.out) {
		// console.log("Two neurons for linkmutate are same.");
		// console.log("\n\n");
		return;
	}


	if (containsLink(genome.genes, newLink) ){
		// console.log("\n\n");
		// console.log("The link is already contained in genes");
		return;
	}

	var flag = false;
	//Search if similar structural innovation has taken place before
	if(pool.LinkMutationList.length != 0){
		for(var i in pool.LinkMutationList){
			var linkMutation = pool.LinkMutationList[i];
			if(newLink.into == linkMutation['newLink_into'] && newLink.out == linkMutation['newLink_out']){
				newLink.innovation = linkMutation['newLink_innovation'];
				//Structural innovation found, set flag to true
				flag = true;
				break;
			}
		}
	}

	//If similar structural innovation has not taken place before
	//then initialize a newInnovation number and store this innovation
	if(!flag){
		newLink.innovation = newInnovation(pool);
		var linkMutation = {};
		linkMutation['newLink_into'] = newLink.into;
		linkMutation['newLink_out'] = newLink.out;
		linkMutation['newLink_innovation'] = newLink.innovation;
		pool.LinkMutationList.push(linkMutation);
	}

	//Add the newlink to genes
	genome.genes.push(newLink);

	var leadsToCycle = checkForCycle(genome.genes);

	//If this leads to cycle then revert the linkMutation
	if(leadsToCycle) {
		// console.log("LinkMuatation led to cycle");
		//if newinnovation was called
		if(!flag) {
			pool.LinkMutationList.pop();
			previousInnovation(pool);
		}
		//Pop the latest gene added to genome
		genome.genes.pop();

	}
}

// creates a new node in between two connected nodes
function nodeMutate(genome){

	if (genome.genes.length == 0){
		return;
	}

	var gene = genome.genes[Math.floor(Math.random()*(genome.genes.length))];

	if (!gene.enabled ){
		// console.log("Selected Gene wasn't enabled in nodeMutate");
		// console.log("\n\n");
		return;
	}

	// Disabling existing gene between two nodes
	gene.enabled = false;
	var gene1 = copyGene(gene);
	var gene2 = copyGene(gene);
	var flag = false;

	if(pool.NodeMutationList.length != 0){
		for(var i in pool.NodeMutationList){
			var nodeMutation = pool.NodeMutationList[i];
			if(gene.into == nodeMutation['gene_into'] && gene.out == nodeMutation['gene_out']){
				gene1.out = nodeMutation['newHiddenNeuronID'];
				gene2.into = nodeMutation['newHiddenNeuronID'];
				gene1.innovation = nodeMutation['gene1_innovation'];
				gene2.innovation = nodeMutation['gene2_innovation'];
				flag = true;
				break;
			}
		}
	}
	if(!flag){
		pool.highestHiddenNeuronID += 1;
		gene1.out = pool.highestHiddenNeuronID;
		gene2.into = pool.highestHiddenNeuronID;
		gene1.innovation = newInnovation(pool);
		gene2.innovation = newInnovation(pool);
		var nodeMutation = {};
		nodeMutation['gene_into'] = gene.into;
		nodeMutation['gene_out'] = gene.out;
		nodeMutation['newHiddenNeuronID'] = pool.highestHiddenNeuronID;//genome.highestHiddenNeuronID;
		nodeMutation['gene1_innovation'] = gene1.innovation;
		nodeMutation['gene2_innovation'] = gene2.innovation;
		pool.NodeMutationList.push(nodeMutation);
	}

	gene1.weight = 1.0;
	gene1.enabled = true;
	genome.genes.push(gene1);
	gene2.enabled = true;
	genome.genes.push(gene2);

	var leadsToCycle = checkForCycle(genome.genes);
	if(leadsToCycle) {
		if(!flag) {
			previousInnovation(pool);
			previousInnovation(pool);
			pool.highestHiddenNeuronID -= 1;
			pool.NodeMutationList.pop();
		}
		// console.log("Node mutation led to cycle.");
		gene.enabled = true;
		genome.genes.pop();
		genome.genes.pop();
	}
}


// if enable = true, then enables disabled genes
function enableDisableMutate(genome, enable){
	var candidates = [];
	var gene={};
	for (var i in genome.genes){
		 gene = genome.genes[i];

		if(gene.enabled == !enable){
			candidates.push(gene);
		}
	}

	if (candidates.length == 0){
		return;
	}

  gene = candidates[Math.floor(Math.random()*candidates.length)];
	gene.enabled = !gene.enabled;

	var leadsToCycle = checkForCycle(genome.genes);

	if(leadsToCycle) {
		gene.enabled = !gene.enabled;
		console.log("Enable Disable Mutation lead to cycle");
	}

}

function mutate(genome){

	for (mutation in genome.mutationRates){
		var rate = genome.mutationRates[mutation];
		//Increase or decrease the mutationrates with 50% probability
		if (Math.random() > 0.5){
			genome.mutationRates[mutation] = 0.95*rate;}
		else{
			genome.mutationRates[mutation] = 1.05263*rate;}
	}

	if (Math.random() < genome.mutationRates['connections'] ){

		//Change weight of each gene of genome with probability PerturbChance
		//or intialize it to new value with probability 1-PerturbChance
		pointMutate(genome);
	}

	var p = genome.mutationRates['link'];

	var counter = 1.0;
	while(counter < p || Math.random() < (p-counter+1)) {
		linkMutate(genome, false);
		counter += 1;
	}

	counter = 1.0;
	p = genome.mutationRates['bias'];
	while(counter < p || Math.random() < (p-counter+1)) {
		linkMutate(genome, true);
		counter += 1;
	}

	counter = 1.0;
	p = genome.mutationRates['node'];
	while(counter < p || Math.random() < (p-counter+1)) {
		nodeMutate(genome);
		counter += 1;
	}

	counter = 1.0;
	p = genome.mutationRates['enable'];
	while(counter < p || Math.random() < (p-counter+1)) {
		enableDisableMutate(genome, true);
		counter += 1;
	}

	counter = 1.0;
	p = genome.mutationRates['disable'];
	while(counter < p || Math.random() < (p-counter+1)) {
		enableDisableMutate(genome, false);
		counter += 1;
	}
}


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
    var efrom = v[0], to = v[1];
    if (!nodes[efrom]) nodes[efrom] = new Node(efrom);
    if (!nodes[to]) nodes[to]     = new Node(to);
    nodes[efrom].afters.push(to);
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
	return 2/(1+Math.exp(-5*val)) - 1 ;
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
		neurons:{},
		Inputs: Config.Inputs,
		Outputs: Config.Outputs,
		maxNumNeurons: Config.MaxNodes,
	}
}

var generateNetwork = function(genome) {
	var network = new Network();

	// Adding input layer and bias Neuron
	for(var i = 0; i <= Config.Inputs; i++)
		network.neurons[i] = new Neuron();

	// Adding output layer

	for(var i = 0; i < network.Outputs; i++)
		network.neurons[network.maxNumNeurons + i] = new Neuron();

	// genome.genes.sort(geneComparison());

	for(var i = 0; i < genome.genes.length; i++) {
		var gene = genome.genes[i];
		if(gene.enabled) {

			// If gene is enabled but there is no output neuron
			if(!network.neurons[gene.out])
				network.neurons[gene.out] = new Neuron();
			// Incoming of the neuron is set to this gene
			network.neurons[gene.out].incoming.push(gene);
			// If gene is enable but there is no input neuron

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
	if(inputs.length -1 != network.Inputs) {

		console.error("\n\n\nIncorrect number of inputs for neural network\n\n\n");

		for(o = [],i = 0; i < network.Outputs; i++) o.push[0];
		return o;	//return
	}

	//Initialize the inputs
	for(var i = 0; i <= network.Inputs; i++) {
		network.neurons[i].value = inputs[i];
	}


	var edges = [];
	for(var i = 0; i < genome.genes.length; i++) {
		if(genome.genes[i].enabled)
		edges.push([genome.genes[i].into,genome.genes[i].out]);
	}
	var sorted;
	try {
    sorted = tsort(edges);
	  }
	catch(e) {
			console.log("\n\nNetwork contained a cycle which was found during eval.");
			for(i in genome.genes){
				console.log(genome.genes[i].into+" "+genome.genes[i].out+"\n");
			}
			console.log("\n==================\n");
	    console.log(e.message);
			// sleep.sleep(1000);
			process.exit();
	  }

	// genome.genes.sort(geneComparison());
	var sum,ind;
	//Compute the feedforward network
	for(var i in sorted) {
		sum = 0;
		ind = sorted[i];
  	if(ind >= network.Inputs) {
    	var neuron = network.neurons[ind];
  		if(!neuron){
  			continue;
  		}
			for(var j = 0; j < neuron.incoming.length; j++) {
				var incoming = neuron.incoming[j];	//Pick a connection
				var other = network.neurons[incoming.into];	//Find other end of the connection
		//Multiply other end of the connection to weight of the connection and add to sum
				sum = sum + incoming.weight * other.value;
			}

			if(neuron.incoming.length > 0) {
				network.neurons[ind].value = sigmoid(sum);
			}
    }
	}

	var o = [];	//Output list
  //Populate the output list
	for(var i = network.maxNumNeurons; i < network.maxNumNeurons + network.Outputs; i++) {
			o.push(network.neurons[i].value)
		}
	return o;
}

var Species = function(){

	var topFitness =  0;
	var staleness = 0;
	var genomes = [];
	var averageFitness = 0;

    return {
        'topFitness':topFitness,
        'staleness':staleness,
        'genomes':genomes,
        'averageFitness':averageFitness
    };

};

function calculateAverageFitness(species){
      var total = 0 ;
        for (g =0 ;g<species.genomes.length;g++){
            var genome = species.genomes[g];
            total = total + genome.globalRank;
        }

        species.averageFitness = total / species.genomes.length;
}


function totalAverageFitness(pool){
       var total = 0;
        for(var s=0; s < pool.species.length;s++){
            var species = pool.species[s];
            total = total + species.averageFitness;
        }
        return total;
}

function cullSpecies(cutToOne,pool){

    for(s=0; s<pool.species.length;s++){
        var species = pool.species[s];

        species.genomes.sort( function (a,b){
            return (a.fitness > b.fitness);
        });

        var remaining = Math.ceil(species.genomes.length/2);

        if (cutToOne){
            remaining = 1;
        }

        while (species.genomes.length > remaining){
            species.genomes.pop();
        }
    }
}


function breedChild(species){
    var child = {};
    if (Math.random() < Config.CrossoverChance){
        var g1 = species.genomes[Math.floor(Math.random()* species.genomes.length)];
        var g2 = species.genomes[Math.floor(Math.random()* species.genomes.length)];
        child = crossover(g1, g2);
    }else{
        var g = species.genomes[Math.floor(Math.random()* species.genomes.length)];
        child = copyGenome(g);
    }

    mutate(child);                  //check :
    return child;
}

function removeStaleSpecies(pool){

    var survived = [];


    for (s =0;s<pool.species.length;s++ ){
        var species = pool.species[s];

        species.genomes.sort(function (a,b){
            return (a.fitness > b.fitness);
        });

        if (species.genomes[0].fitness > species.topFitness) {
            species.topFitness = species.genomes[0].fitness;
            species.staleness = 0;
        } else{
            species.staleness = species.staleness + 1;
        }

        if (species.staleness < Config.StaleSpecies || species.topFitness >= pool.maxFitness ){
            survived.push(species);
        }
    }

    if(survived.length > 1)
    pool.species = survived;
}

function removeWeakSpecies(pool){

    var survived = [];
    var sum = totalAverageFitness(pool);

    for (var s =0;s<pool.species.length; s++ ){
        var species = pool.species[s];
        var breed = Math.floor((species.averageFitness / sum) * Config.Population);
        if (breed >= 1 ){
            survived.push(species);
        }
    }
    if(survived.length > 1)
    pool.species = survived;
}

function addToSpecies(child,pool){

    var foundSpecies = false;

    for (var s in pool.species){
        var species = pool.species[s];
        if (!foundSpecies && sameSpecies(child, species.genomes[0])){
            species.genomes.push(child);
            foundSpecies = true;
        }
    }

    if (!foundSpecies ){
        var childSpecies = new Species();

        childSpecies.genomes.push(child);
        pool.species.push(childSpecies);
    }
}

function sameSpecies(genome1, genome2){
    var dd = Config.DeltaDisjoint*disjoint(genome1.genes, genome2.genes);
    var dw = Config.DeltaWeights*weights(genome1.genes, genome2.genes);
    return dd + dw < Config.DeltaThreshold;
}

// var Species = require('./Species');
// var Genome = require('./Genome');
// var Config = require('./config');


var Pool = function(){

	var species = [];
	var generation = 0;

	var innovation = (Config.Inputs+1) * Config.Outputs; //Next available innovation number

	var currentSpecies =0;
	var currentGenome = 0;
	var currentFrame = 0;
	var maxFitness = 0;
	var shouldStop = false;
	var highestHiddenNeuronID = 0;
	//var innovationsSoFar = [];	//TODO: store the innovations;
	var NodeMutationList = [];
	var LinkMutationList = [];



	return {'species':species,
			'generation':generation,
			'innovation':innovation,
			'currentSpecies':currentSpecies,
			'currentGenome':currentGenome,
			'currentFrame':currentFrame,
			'maxFitness':maxFitness,
			'shouldStop':shouldStop,
			'highestHiddenNeuronID':highestHiddenNeuronID,
			'NodeMutationList':NodeMutationList,
			'LinkMutationList':LinkMutationList
		}

};

function initializePool(){
	pool = new Pool();

	for (var i =0;i<Config.Population;i++){
		var basic = basicGenome();	//Comeback
		addToSpecies(basic,pool);
	}
	return pool;
}


//innovation is the next available innovation number
function newInnovation(pool){
	pool.innovation = pool.innovation + 1;
	return pool.innovation-1;	//innovation - 1 is available
}

function previousInnovation(pool) {
	pool.innovation = pool.innovation - 1;
}

function rankGlobally(pool){
	var global1 = [];
	for (var s in pool.species){
		var species = pool.species[s];
		for (var g in species.genomes ){
			global1.push(species.genomes[g]);
		}
	}

	global1.sort(
		function (a,b){
		return (a.fitness < b.fitness);
		}
	);

	for(var g =0 ; g<global1.length ; g++ ){
		global1[g].globalRank = g;
	}
}

var xor = [[3,2,0],[3,1,0],[1,1,0],[1,2,0],[2,1,1],[2,2,1],[2,0,1]];
var xorindex = -1;
// addfa
var getInputs = function(){
	xorindex = (xorindex + 1)%xor.length;
	// winston.info("\ngetInputs is executed");
	return xor[xorindex];
}

var Utility = function(){
	return {

	controller: {A: false, Left: false, Right: false, Up: false, Down: false},

	}

}
// 1d
 var newGeneration = function(pool){
	cullSpecies(false,pool); // Cull the bottom half of each species
	rankGlobally(pool);
	removeStaleSpecies(pool);
	rankGlobally(pool);
	for (var s in pool.species){
		var species = pool.species[s];
		calculateAverageFitness(species);
	}
	removeWeakSpecies(pool);
	var sum = totalAverageFitness(pool);
	var children = [];
	for (var s in pool.species){
		var species = pool.species[s];
		var breed = Math.floor((species.averageFitness / sum) * Config.Population) - 1;
		for (var i = 0; i < breed; i++) {
			children.push(breedChild(species));
		}
	}
	cullSpecies(true,pool) // Cull all but the top member of each species
	while (children.length + pool.species.length < Config.Population) {


		var index = Math.floor((Math.random()*pool.species.length));
    // console.error("Pool Species Length: "+pool.species.length+" Index: "+index);
		var species = pool.species[index];
    if(!species)
    {
      console.log("Species is null");
      continue;
    }
		children.push(breedChild(species));
	}

	for (var c in children) {
		var child = children[c];
		addToSpecies(child,pool);
	}

	pool.generation += 1;
}

var clearJoypad = function(utility){
	for(var i in utility.controller) {
		utility.controller[i] = False;
	}
}


/*var initializeRun = function(pool,utility){
	// savestate.load(Filename);
	var rightmost = 0;

	pool.currentFrame = 0;
	var timeout = Config.TimeoutConstant;
	clearJoypad(utility);

	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	generateNetwork(genome);
	evaluateCurrent(pool);

}*/

// 4
var evaluateCurrent = function(pool){
	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	var sqerror = 0.0;
	var misclassifications = xor.length;
	for(var index = 0; index < xor.length; index ++)
	{
	var inputs = getInputs();  // getInputs() must be modified, <Adapter>.getInputs() must be present where Adapter.js is the file responsible for getting inputs
	var trueOutput = inputs[2];
	var localInputs = inputs.slice(0,2);
	var predOutput = evaluateNetwork(genome,genome.network, localInputs);  // inputs is only used here
	sqerror += Math.pow(predOutput-trueOutput,2);
	if(Math.abs(predOutput - trueOutput) < 0.5)
		misclassifications -= 1;
	}
	genome.fitness = (xor.length-misclassifications*0.8)/(xor.length+(sqerror*misclassifications)/xor.length);

	// Utility.controller = controller;

	// if (controller["P1 Left"] && controller["P1 Right"]) {
	// 	controller["P1 Left"] = false;
	// 	controller["P1 Right"] = false;
	// }
	// if (controller["P1 Up"] && controller["P1 Down"]) {
	// 	controller["P1 Up"] = false;
	// 	controller["P1 Down"] = false;
	// }

	// for (var b in Config.ButtonNames) {
	// 	if(controller["P1 " + Config.ButtonNames[b]] == true){
	// 		Robot.keyToggle(Config.ButtonNames[b], 'down');
	// 	}
	// }
	// //joypad.set(controller);


	console.log(
		"\n\nGeneration: "+pool.generation+
		"\nSpecies: "+ pool.currentSpecies+
		"\nGenome: "+ pool.currentGenome+
		"\nSquareError: "+sqerror+
		"\nMisclassifications: "+misclassifications+
		"\nGenes Length: "+pool.species[pool.currentSpecies].genomes[pool.currentGenome].genes.length+
    "\n\n"
	);

	return misclassifications;
}

var	pool = initializePool();
	// initializeRun();

// 5
var nextGenome = function(pool){
	pool.currentGenome += 1;
	if (pool.currentGenome >= pool.species[pool.currentSpecies].genomes.length) {
		pool.currentGenome = 0;
		pool.currentSpecies += 1;
		if (pool.currentSpecies >= pool.species.length) {
			newGeneration(pool);
			pool.currentSpecies = 0;
		}
	}
}
// 6
var fitnessAlreadyMeasured = function(pool){
	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];

	return genome.fitness != 0;
}

function findMarioPosition() {

var
}
// 7
var startUtility = function(pool){
	// DataStorage.writeToFile("temp.pool");

var mycounter = 1;
while (!pool.shouldStop ) {
		mycounter += 1;
		var species = pool.species[pool.currentSpecies];
		var genome = species.genomes[pool.currentGenome];
		// console.warn(
    //   "Current Species: "+pool.currentSpecies+
    //   "\nCurrent genome: "+pool.currentGenome);
		/*if (forms.ischecked(showNetwork)) {
			displayGenome(genome);
		}*/


		// if (pool.currentFrame % 2 == 0) {
		generateNetwork(genome);
		var misclassifications = evaluateCurrent(pool);
		// }
		if(misclassifications < 2 || pool.generation > 500) {

			console.log("")
			console.log("\n\n\nTHE POOL SHOULD STOP\n\n\n");
			console.log(
				"\n\nGeneration: "+pool.generation+
				"\nSpecies: "+ pool.currentSpecies+
				"\nGenome: "+ pool.currentGenome+
				"\nMisclassifications: "+misclassifications+
		    "\n\n"
			);

			pool.shouldStop = !0;
		}

		//joypad.set(controller);
		// for (var b in Config.ButtonNames) {
		// 	if(Utility.controller["P1 " + Config.ButtonNames[b]] == true){
		// 		Robot.keyToggle(Config.ButtonNames[b], 'down');
		// 	}
		// }

		//getPositions();
		// var timeout;
		// if (Config.onLevelEnd) {    // rightmost gives the last frame of the level
		// 	timeout = Config.TimeoutConstant;
		// }

		// timeout = timeout - 1;

		// var timeoutBonus = pool.currentFrame / 4;
		// if (timeout + timeoutBonus <= 0) {
		// 	var fitness = rightmost - pool.currentFrame / 2;  // rightmost gives the last frame of the level
		// 	if (Config.onLevelEnd) {
		// 		fitness += 1000;
		// 	}
		// 	if (fitness == 0) {
		// 		fitness = -1;
		// 	}
		// 	genome.fitness = fitness;

		if (genome.fitness > pool.maxFitness) {
			pool.maxFitness = genome.fitness;
			//forms.settext(maxFitnessLabel, "Max Fitness: " .. Math.floor(pool.maxFitness));
			// DataStorage.writeToFile("Backup" + "_" + pool.generation + "_" + /*forms.gettext(saveLoadFile)*/ Config.filename);
		}

			// console.writeline("Generation: " + pool.generation + " Species: " + pool.currentSpecies + " Genome: " +
			// 	pool.currentGenome + " Fitness: " + fitness);
			//pool.currentSpecies = 0;
			//pool.currentGenome = 0;
			while (fitnessAlreadyMeasured(pool)) {
				nextGenome(pool);
			}
			// initializeRun();
		// }

		var measured = 0;
		var total = 0;

		for (var key in pool.species) {
			var species = pool.species[key];
			for (var k in species.genomes) {
				var genome = species.genomes[k];
				total = total + 1;
				if (genome.fitness != 0) {
					measured = measured + 1;
				}
			}
		}
		pool.currentFrame += 1;
	}
}

function InitializeInputArray() {
	InputsArray = [];
	for(var i = 0; i < 15; i++) {
		var row = [];
		for(var j = 0; j < 15; j++) {
			row.push(0);
		}
		InputsArray.push(row);
	}
}

InitializeInputArray();
// startUtility(pool);

//Datastorage

// var config = require('./config');
// var datastorage = {
// 		writeToFile:null,
// 		loadefromFile:null,



//  };

//  datastorage.writeToFile = function(fileName,pool){

//      	var jsonGenomes = {};
//      	jsonGenomes.generation = pool.generation;
// 	    jsonGenomes.maxFitness = pool.maxFitness;
//      	jsonGenomes.speciesLength = pool.species.length;

//      	for(var key in pool.species){

//        	    var species = pool.species[key];
//        	    jsonGenomes.species = species;
//             jsonGenomes.topFitness = species.topFitness;
//             jsonGenomes.staleness = species.staleness;
//              jsonGenomes.genomes = species.genomes ;

//         	for(var k in species.genomes){
//     	       	var genome = species.genomes[k];
//     	       	jsongenomes.genome = genome;
//                 jsonGenomes.fitness = genome.fitness;
//                 jsonGenomes.highestHiddenNeuronID = genome.highestHiddenNeuronID;

//             for(var l in genome.mutationRates){
//     			jsongenomes.mutationRates = l + genome.mutationRates[l];
//     		}

//             jsonGenomes.geneslength = genome.genes.length;

//             for (var a in genome.gene){
//                 var gene = genome.gene;
//                 jsonGenomes.into = gene.into + " ";
//                 jsonGenomes.out = gene.out + " ";
//                 jsonGenomes.weight = gene.weight + "";
//                 jsonGenomes.innovation = gene.innovation + " ";
//                 if(gene.enabled)
//                 jsonGenomes.geneenabled = 1 ;
//                 else
//                 jsonGenomes.geneenabled = 0;
//        }
//      }
//    }

//    var filename = config.StorageDir+'/'+datetime.now()+'_'+pool.generation+'_'+pool.maxFitness+'.json';
//    fs.writeFileSync(filename,JSON.stringify(jsonGenomes));
// }


//  datastorage.loadefromFile = function(fileName){

//  	var jsonGenomes = JSON.parse(fs.readFileSync(fileName));
//  	var pool = new Pool();
//  	pool.species.length = jsonGenomes.speciesLength;

//  	pool.maxFitness = jsonGenomes.maxFitness;
//  	pool.generation = jsonGenomes.generation;
//  	for( var b=0; b<jsonGenomes.speciesLength ;b++){
//  		var species = new Species();
//  		species.topFitness = jsonGenomes.fitness;
//  		species.staleness = jsonGenomes.staleness;
//         species.genome.length = jsonGenomes.genomeLength;

//         for(var c=0; c< jsonGenomes.genomeLength;c++){
//         	var genome = new genome();
//         	genome.highestHiddenNeuronID = jsonGenomes.highestHiddenNeuronID;
//         	genome.fitness = jsonGenomes.fitness;
//         	genome.genes.length = jsonGenomes.geneslength;
//             for(var d =0; d< jsonGenomes.geneslength;d++){
//             	var gene = new gene();
//             	gene.into = jsonGenomes.into;
//             	gene.out = jsonGenomes.out;
//             	gene.innovation = jsonGenomes.innovation;
//             	gene.weight = jsonGenomes.weight;
//             	if(jsonGenomes.geneenabled ){
// 					gene.enabled = true
//             	}
// 				else{
// 					gene.enabled = false
// 				}
//             }

//         }

//  	}


//  }
// module.exports = datastorage;

// var screenSize = robot.getScreenSize();
//
// var globalX = 0;
// var globalY = 0;
// var gameXoffset = 0;
// var gameYoffset = 0;
//
// var Scanner = {};
//
// // Check if the given position is outside the Screen
// Scanner.isOutOfBound = function (pos) {
//   if ( pos[X] < 0 || pos[Y] < 0 ||
//      pos[X] >= screenSize.width ||
//      pos[Y] >= screenSize.height) {
//
//     return true;
//   }
//
//   return false;
// }
//
// // Limits the x/y values of position to fit the screen
// Scanner.makeInBounds = function (pos) {
//
//   if (pos[X] < 0) {
//     pos[X] = 0;
//   }
//
//   if (pos[X] >= screenSize.width) {
//     pos[X] = screenSize.width - 1;
//   }
//
//   if (pos[Y] < 0) {
//     pos[Y] = 0;
//   }
//
//   if (pos[Y] >= screenSize.height) {
//     pos[Y] = screenSize.height - 1;
//   }
//
//   return pos;
// }
//
// Scanner.matchColor(color, colorLower, colorUpper) {
// 	var colorSub;
// 	for(var i = 0; i < 5; i+=2) {
// 		colorSub = color.substr(i,2);
// 		if(colorSub.localeCompare(colorLower.substr(i,2)) == -1 ||
// 			colorSub.localeCompare(colorUpper.substr(i,2)) == 1) {
//
// 				return false;
// 			}
// 	}
//
// 	return true;
// }
//
// //Pass the color limits in string of hex representation format
// Scanner.scanUntil = function (start, delta, colorLower, colorUpper, iterLimit) {
//   var color, colorString, current, iterations = 0;
//   current = Scanner.makeInBounds([start[X], start[Y]]);
//
//   if (delta[X] == 0 && delta[Y] == 0) {
//     return null;
//   }
//
//   while (!Scanner.isOutOfBound(current)) {
//     // Check current pixel
//     color = robot.getPixelColor(current[X], current[Y]);
// 		colorString = color.toString();
//     if (Scanner.matchColor(colorString, colorUpper, colorLower)) {
//       return current;
//     }
//
//     current[X] += delta[X];
//     current[Y] += delta[Y];
//     iterations++;
//
//     if (iterations > iterLimit) {
//       return null;
//     }
//   }
//   return null;
// };
//
// function InitializeGlobalOffset() {
//
// }
