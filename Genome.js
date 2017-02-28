
var newGenome=function(){
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

var copyGenome=function(genome){
	var genome2 = newGenome();
	for (g in genome.genes){
	genome2.genes.pus(copyGene(genome.genes[g]))}

	genome2.maxneuron = genome.maxneuron;
	genome2.mutationRates['connections'] = genome.mutationRates['connections'];
	genome2.mutationRates['link'] = genome.mutationRates['link'];
	genome2.mutationRates['bias'] = genome.mutationRates['bias'];
	genome2.mutationRates['node'] = genome.mutationRates['node'];
	genome2.mutationRates['enable'] = genome.mutationRates['enable'];
	genome2.mutationRates['disable'] = genome.mutationRates['disable'];

	return genome2;
}
function basicGenome(){
	var genome = newGenome()
	var innovation = 1

	genome.maxneuron = config.Inputs;
	mutate(genome);

	return genome
}
