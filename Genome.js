var Config  = require('./config');
var Pool = require('./Pool');
var Genes = require('./Gene');


var Genome = function(){
	var genes = {};
	var fitness = 0;
	var adjustedFitness = 0;
	var network = {};
	var maxneuron = 0;
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
		'maxneuron':maxneuron,
		'globalRank':globalRank,
		'mutationRates':mutationRates,
	}
};

function copyGenome(genome){
	var genome2 = new Genome();

	for (g =0; g<genome.genes.length;g++){

		genome2.genes.push(copyGene(genome.genes[g]));
	}

	genome2.maxneuron = genome.maxneuron;
	genome2.mutationRates['connections'] = genome.mutationRates['connections'];
	genome2.mutationRates['link'] = genome.mutationRates['link'];
	genome2.mutationRates['bias'] = genome.mutationRates['bias'];
	genome2.mutationRates['node'] = genome.mutationRates['node'];
	genome2.mutationRates['enable'] = genome.mutationRates['enable'];
	genome2.mutationRates['disable'] = genome.mutationRates['disable'];
	console.log("copyGenome");
	return genome2;
}

function basicGenome(genome){
	var genome2 = new Genome();
	var innovation = 1;
	genome.maxneuron = Inputs;
	genome.mutate(genome2);
	console.log("basicGenome");
	return genome2;
}



function crossover(g1, g2){
	// Make sure g1 is the higher fitness genome
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
		if (gene2 != null && (2*Math.random()) == 1 && gene2.enabled){
			child.genes.push(copyGene(gene2));
		}else{
			child.genes.push(copyGene(gene1));
		}
	}

	child.maxneuron = Math.max(g1.maxneuron,g2.maxneuron);

	for (mutation in g1.mutationRates){
		child.mutationRates[mutation] = g1.mutationRates[mutation];
	}
	console.log("crossover");
	return child;
}

function randomNeuron(genes, nonInput){ 		//check this function
	var neurons = {};

	if (!nonInput){
		for (var i=1;i<=Config.Inputs;i++){
			neurons[i] = true;
		}
	}
	for (var o=1;o<=Config.Outputs;o++){
		neurons[MaxNodes+o] = true;
	}
	for (var i in genes){
		if ((!nonInput) || (genes[i].into > Config.Inputs)){
						
			neurons[genes[i].into] = true}
		if ((!nonInput) || (genes[i].out > Config.Inputs)){
			
			neurons[genes[i].out] = true;
		}
	}

	var count = 0;
	for (i =0;i<neurons.length;i++){
		count = count + 1;
	}

	var n = Math.floor(Math.random()*(count-1))+1;

	for (var k =0;k<neurons.length;k++){
		n = n-1;
		if (n == 0)
			return k;
	}

	console.log("randomNeuron");
}


function containsLink(genes, link){
	var gene={};
	for (i=0;i<genes.length;i++){
	  		gene = genes[i];
			if ((gene.into == link.into) && (gene.out == link.out)){
				return true;
			}
		}
	
}

function pointMutate(genome){
	var step = genome.mutationRates['step'];
	var gene={};

	for (i=0;i<genome.genes.length;i++){

		gene = genome.genes[i];

		if (Math.random() < Config.PerturbChance){
			gene.weight = gene.weight + Math.random() * step*2 - step;
		}else{
			gene.weight = Math.random()*4-2;
		}		
	}
}

function linkMutate(genome, forceBias){
	var neuron1 = randomNeuron(genome.genes, false);
	var neuron2 = randomNeuron(genome.genes, true);

	var newLink = new Gene();
	if (neuron1 <= Config.Inputs && neuron2 <= Config.Inputs){
		//Both input nodes
		return; 
	}
	if (neuron2 <= Inputs) {
		// Swap output and input
		var temp = neuron1;
		neuron1 = neuron2;
		neuron2 = temp;
	}

	newLink.into = neuron1;
	newLink.out = neuron2;
	if (forceBias) {
		newLink.into = Inputs
	}
	
	if (containsLink(genome.genes, newLink) ){
		return;
	}

	newLink.innovation = newInnovation();
	newLink.weight = Math.random()*4-2;

	genome.genes.push(newLink);
}

function nodeMutate(genome){

	if (genome.genes.length == 0){
		return;
	}
	
    genome.maxneuron = genome.maxneuron + 1;

	var gene = genome.genes[Math.floor(Math.random()*(genome.genes.length-1)+1)];

	if (!gene.enabled ){
		return;
	}
	
	gene.enabled = false;

	var gene1 = copyGene(gene);
	gene1.out = genome.maxneuron;
	gene1.weight = 1.0;
	gene1.innovation = newInnovation();
	gene1.enabled = true;
	genome.genes.push(gene1);

	var gene2 = copyGene(gene);
	gene2.into = genome.maxneuron;
	gene2.innovation = newInnovation();
	gene2.enabled = true;
	genome.genes.push(gene2);
}

function enableDisableMutate(genome, enable){
	var candidates = {};
	var gene={};
	for (var key in genome.genes){
		 gene = genome.genes[key];
		if(gene.enabled == !enable){
			candidates.push(gene);
		}
	}
		
	if (candidates.length == 0){
		return;
	}
	
    gene = candidates[Math.floor((Math.random() * (candidates.length-1)) + 1)];
	gene.enabled = !gene.enabled;
}

function mutate(genome){

	for (mutation in genome.mutationRates){
		var rate = genome.mutationRates[mutation];
		if (Math.floor(Math.random()+1) == 1){
			genome.mutationRates[mutation] = 0.95*rate;}
		else{
			genme.mutationRates[mutation] = 1.05263*rate;}
	}

	if (Math.random() < genome.mutationRates['connections'] ){
		Genome.pointMutate(genome);
	}

	var p = genome.mutationRates['link'];

	while(p > 0){
		if (Math.random() < p ){
			Genome.linkMutate(genome, false);
		}
		p = p - 1;
	}

	p = genome.mutationRates['bias'];
	while(p > 0 ){
		if (Math.random() < p) {
			Genome.linkMutate(genome, true);
		}
		p = p - 1;
	}

	p = genome.mutationRates['node'];
	while (p > 0 ){
		if (Math.random()<p) {
			Genome.nodeMutate(genome);
		}
		p = p - 1;
	}

	p = genome.mutationRates['enable'];
	while (p > 0 ){
		if (Math.random() < p ){
			Genome.enableDisableMutate(genome, true);
		}
		p = p - 1;
	}

	p = genome.mutationRates['disable'];
	while (p > 0){
		if (Math.random() < p ){
			Genome.enableDisableMutate(genome, false);
		}
		p = p - 1;
	}
}

module.exports = Genome;
