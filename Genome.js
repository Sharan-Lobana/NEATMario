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
	mutationRates['connections'] = config.MutateConnectionsChance;
	mutationRates['link'] = config.LinkMutationChance;
	mutationRates['bias'] = config.BiasMutationChance;
	mutationRates['node'] = config.NodeMutationChance;
	mutationRates['enable'] = config.EnableMutationChance;
	mutationRates['disable'] = config.DisableMutationChance;
	mutationRates['step'] = config.StepSize;

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

	genome2.maxneuron = Genome.maxneuron;
	genome2.mutationRates['connections'] = Genome.mutationRates['connections'];
	genome2.mutationRates['link'] = Genome.mutationRates['link'];
	genome2.mutationRates['bias'] = Genome.mutationRates['bias'];
	genome2.mutationRates['node'] = Genome.mutationRates['node'];
	genome2.mutationRates['enable'] = Genome.mutationRates['enable'];
	genome2.mutationRates['disable'] = Genome.mutationRates['disable'];

	return genome2;
}

function basicGenome(){
	var genome = new Genome();
	var innovation = 1;
	genome.maxneuron = Config.Inputs;
	Gemome.mutate(genome);

	return genome;
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

	for (i=0;i<g2.genes.length;i++){
		var gene = g2.genes[i];
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

	return child;
}

function randomNeuron(genes, nonInput){ 		//check this function
	var neurons = {};

	if (!nonInput){
		for (i=1,i<=Config.Inputs,i++){
			neurons[i] = true;
		}
	}
	for (o=1,o<=Config.Outputs,o++){
		neurons[MaxNodes+o] = true;
	}
	for (i in genes){
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

	var n = Math.floor(Math.random())*(count-1)+1;

	for (k =0;k<neurons.length;k++){
		n = n-1;
		if (n == 0)
			return k;
	}

	return 0;
}


function containsLink(genes, link){
	var gene={};
	for (i=0;i<genes.length;i++){
	  		gene = genes[i];
			if (gene.into == link.into && gene.out == link.out){
				return true;
			}
		}
}

function pointMutate(genome){
	var step = genome.mutationRates['step'];

	for (i=0;i<genome.genes.length;i++){

		var gene = genome.genes[i];

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
	if (neuron1 <= Config.Inputs and neuron2 <= Config.Inputs) {then}
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

	newLink.innovation = Pool.newInnovation();
	newLink.weight = Math.random()*4-2;

	genome.genes.push(newLink);
}

function nodeMutate(genome){
	if (genome.genes.length == 0){
		return;
	}
	

	genome.maxneuron = genome.maxneuron + 1;

	var gene = genome.genes[Math.random(1,genome.genes.length)];

	if (!gene.enabled ){
		return;
	}
	
	gene.enabled = false;

	var gene1 = Gene.copyGene(gene);
	gene1.out = genome.maxneuron;
	gene1.weight = 1.0;
	gene1.innovation = Pool.newInnovation();
	gene1.enabled = true;
	genome.genes.push(gene1);

	var gene2 = copyGene(gene);
	gene2.into = genome.maxneuron;
	gene2.innovation = Pool.newInnovation();
	gene2.enabled = true;
	genome.genes.push(gene2);
}

function enableDisableMutate(genome, enable){
	var candidates = {};
	for (var key in genome.genes){
		var gene = genome.genes[key];
		if(gene.enabled == !enable){
			candidates.push(gene);
		}
	}
		
	if (candidates.length == 0){
		return;
	}
	
	var gene = candidates[Math.floor((Math.random() * candidates.length) + 1)];
	gene.enabled = !gene.enabled;
}

function mutate(genome){

	for (mutation in genome.mutationRates){
		if (Math.random(1,2) == 1){
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
		if (not i1[gene.innovation]){
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

module.exports = Genome;
