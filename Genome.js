// var Config  = require('./config');
// var Pool = require('./Pool');
// var Genes = require('./Gene');


var Genome = function(){
	var genes = [];
	var fitness = 0;
	var adjustedFitness = 0;
	var network = {};
	//var nextNeuronID = 0;
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
		//'nextNeuronID':nextNeuronID,
		'globalRank':globalRank,
		'mutationRates':mutationRates,
	}
};

function copyGenome(genome){
	var genome2 = new Genome();

	for (g =0; g<genome.genes.length;g++){

		genome2.genes.push(copyGene(genome.genes[g]));
	}

	//genome2.nextNeuronID = genome.nextNeuronID;
	genome2.mutationRates['connections'] = genome.mutationRates['connections'];
	genome2.mutationRates['link'] = genome.mutationRates['link'];
	genome2.mutationRates['bias'] = genome.mutationRates['bias'];
	genome2.mutationRates['node'] = genome.mutationRates['node'];
	genome2.mutationRates['enable'] = genome.mutationRates['enable'];
	genome2.mutationRates['disable'] = genome.mutationRates['disable'];
	console.log("\ncopyGenome is executed");
	return genome2;
}

function basicGenome(){
	var genome = new Genome();
	pool.nextNeuronID = Config.Inputs;//genome.nextNeuronID = Config.Inputs;

	//Populate the genes list of genome
	//Each input is connected to each output
	for(var i = 0; i <= Config.Inputs; i++) {
		for(var j = 0; j < Config.Outputs; j++) {
			var gene = new Gene();
			gene.into = i;
			gene.out = Config.MaxNodes + j;
			gene.weight = Math.random()*4-2;
			gene.innovation = i*Config.Outputs + j;
			console.log("basicGenome: Current innovation number "+gene.innovation);
			genome.genes.push(gene);
		}
	}
	mutate(genome);
	console.log("\nBasicGenome is executed");
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

	//child.nextNeuronID = Math.max(g1.nextNeuronID,g2.nextNeuronID);

	for (mutation in g1.mutationRates){
		child.mutationRates[mutation] = g1.mutationRates[mutation];
	}
	console.log("\ncrossover is executed");
	return child;
}
function randomNeuron(genes, nonInput){ 		//check this function
	var neurons = {};

	if (!nonInput){
		for (var i=0;i<Config.Inputs;i++){
			neurons[i] = true;
		}
	}
	for (var o=0;o<Config.Outputs;o++){
		neurons[Config.MaxNodes+o] = true;
	}
	for (var i in genes){
		if ((!nonInput) || (genes[i].into > Config.Inputs)){

			neurons[genes[i].into] = true}
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
			return parseInt(i);
			console.log("Random neuron returned "+ i);
		}

		n = n-1;
	}

	// console.log("randomNeuron");
}


function containsLink(genes, link){
	var gene={};
	for (i=0;i<genes.length;i++){
	  		gene = genes[i];
			if ((gene.into == link.into) && (gene.out == link.out)){
				console.log("\ncontainsLink is executed: Contains link");
				return true;
			}
		}
		console.log("\ncontainsLink is executed: Does not contain link");
	return false;
}
// mutates the weight of genes
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
	console.log("\npointMutate is executed");
}

//Create a new connection between two random nodes selected out of which one can't be any input node 
//TODO: make sure linkMutate doesn't introduce a cycle
function linkMutate(genome, forceBias){
	var neuron1 = randomNeuron(genome.genes, false);
	var neuron2 = randomNeuron(genome.genes, true);

	var newLink = new Gene();
	if (neuron1 <= Config.Inputs && neuron2 <= Config.Inputs){
		//Both input nodes
		return;
	}
	if (neuron2 <= Config.Inputs) {
		// Swap output and input
		var temp = neuron1;
		neuron1 = neuron2;
		neuron2 = temp;
	}
	if(neuron1 == neuron2)
		return;
	if(neuron1 && neuron2){
	newLink.into = neuron1;
	newLink.out = neuron2;
	}
	if (forceBias) {
		newLink.into = Config.Inputs;
	}
	console.log("Linkmutate: "+"neuron1: "+neuron1+" neuron2: "+neuron2);
	if (containsLink(genome.genes, newLink) ){
		return;
	}

	var flag = false;
	if(pool.LinkMutationList){
		for(var i in pool.LinkMutationList){
			var linkMutation = pool.LinkMutationList[i];
			if(newLink.into == linkMutation['newLink_into'] && newLink.out == linkMutation['newLink_out']){
				newLink.innovation = linkMutation['newLink_innovation'];
				console.log("\n\n\nLinkmutate: Innovation already exists. "+" Innovation number of newLink = "+newLink.innovation);
				flag = true;
				break;
			}
		}
	}
	if(!flag){
		newLink.innovation = newInnovation(pool);
		console.log("\n\n\nNew innovation called for LinkMutate: Innovation number of newLink = "+newLink.innovation);
	}

	newLink.weight = Math.random()*4-2;
	console.log("LinkMutate: Genes List length before pushing newLink:"+genome.genes.length);
	genome.genes.push(newLink);
	console.log("LinkMutate: Genes List length after pushing newLink:"+genome.genes.length);
	console.log("\n\nNew link created with in: "+newLink.into+" and out: "+newLink.out);

	if(!flag){
		var linkMutation = {};
		linkMutation['newLink_into'] = newLink.into;
		linkMutation['newLink_out'] = newLink.out;
		linkMutation['newLink_innovation'] = newLink.innovation;
		pool.LinkMutationList.push(linkMutation);
		console.log("\n\nLinkMutations Pushed");
	}
}

// creates a new node in between two connected nodes
function nodeMutate(genome){

	if (genome.genes.length == 0){
		return;
	}


	var gene = genome.genes[Math.floor(Math.random()*(genome.genes.length))];
	console.log("\n\nNodeMuate called: Gene list length: "+genome.genes.length);
	//console.log(gene);
	if (!gene.enabled ){
		console.log("\n\nSelected gene wasn't enabled. So returned.");
		return;
	}

	// Disabling existing gene between two nodes
	gene.enabled = false;

	var gene1 = copyGene(gene);
	var gene2 = copyGene(gene);
	var flag = false;
	
	if(pool.NodeMutationList){
		for(var i in pool.NodeMutationList){
			var nodeMutation = pool.NodeMutationList[i];
			if(gene.into == nodeMutation['gene_into'] && gene.out == nodeMutation['gene_out']){
				pool.nextNeuronID = nodeMutation['nextneuronID'];//genome.nextNeuronID = nodeMutation['nextneuronID'];
				gene1.innovation = nodeMutation['gene1_innovation'];
				gene2.innovation = nodeMutation['gene2_innovation'];
				console.log("\n\n\nNodemutate: Innovation already exists. "+"Innovation of gene 1: "+gene1.innovation
					+"Innovation of gene 2: "+gene2.innovation+"nextNeuronID: "+pool.nextNeuronID/*genome.nextNeuronID*/);
				flag = true;
				break;
			}
		}
	}
	if(!flag){
		pool.nextNeuronID += 1;//genome.nextNeuronID = genome.nextNeuronID + 1;
		gene1.innovation = newInnovation(pool);
		console.log("\n\n\nNew innovation called for nodemutate: "+gene1.innovation);
		gene2.innovation = newInnovation(pool);
		console.log("\n\n\nNew innovation called for nodemutate second link: "+gene2.innovation);
	}
	
	// Creating a link (gene) between input node and new node with weight 1.0
	//var gene1 = copyGene(gene);
	gene1.out = pool.nextNeuronID;//genome.nextNeuronID;
	gene1.weight = 1.0;
	
	
	gene1.enabled = true;
	genome.genes.push(gene1);
	// Creating a link (gene) between new node and output node with weight = weight of original gene
	//var gene2 = copyGene(gene);
	gene2.into = pool.nextNeuronID;//genome.nextNeuronID;
	
	
	gene2.enabled = true;
	genome.genes.push(gene2);

	if(!flag){
		var nodeMutation = {};
		nodeMutation['gene_into'] = gene.into;
		nodeMutation['gene_out'] = gene.out;
		nodeMutation['nextneuronID'] = pool.nextNeuronID;//genome.nextNeuronID;
		nodeMutation['gene1_innovation'] = gene1.innovation;
		nodeMutation['gene2_innovation'] = gene2.innovation;
		pool.NodeMutationList.push(nodeMutation);
		console.log("\n\nNodeMutations Pushed");
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
	// if(gene.enabled && !genome.network.neurons[gene.out]) {
	// 	var newNeuron = new Neuron();
	// 	newNeuron.incoming.push(gene);
	// 	genome.network.neurons[gene.out] = newNeuron;
	// }
	// if(gene.enabled && !genome.network.neurons[gene.into]) {
	// 	genome.network.neurons[gene.into] = new Neuron();
	// }
	console.log("\nenableDisableMutate is executed");
}

function mutate(genome){

	for (mutation in genome.mutationRates){
		var rate = genome.mutationRates[mutation];
		if (Math.random() > 0.5){
			genome.mutationRates[mutation] = 0.95*rate;}
		else{
			genome.mutationRates[mutation] = 1.05263*rate;}
	}

	if (Math.random() < genome.mutationRates['connections'] ){
		//Change the weight of each gene of genome
		//with probability PertubChance and intialize it to new value
		//with probability 1-PertubChance
		pointMutate(genome);	
	}

	var p = genome.mutationRates['link'];

	if(p >= 1.0 || Math.random() < p)
		linkMutate(genome, false);
	

	p = genome.mutationRates['bias'];
	if(p >= 1.0 || Math.random() < p)
		linkMutate(genome, true);

	p = genome.mutationRates['node'];
	if(p >= 1.0 || Math.random() < p)
		nodeMutate(genome);

	p = genome.mutationRates['enable'];
	if(p >= 1.0 || Math.random() < p)
		enableDisableMutate(genome, true);


	p = genome.mutationRates['disable'];
	if(p >= 1.0 || Math.random() < p)
		enableDisableMutate(genome, false);
	console.log("\nmutate is executed");
}

// module.exports = Genome;
