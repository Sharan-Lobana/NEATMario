// var Species = require('./Species');
// var Genome = require('./Genome');
// var Config = require('./config');


var Pool = function(){

	var species = [];
	var generation = 0;
	var innovation = (Config.Inputs+1) * Config.Outputs; //Next available innovation number
	var currentSpecies =1;
	var currentGenome = 1;
	var currentFrame = 0;
	var maxFitness = 0;
	var shouldStop = false;
	var nextNeuronID = 0;
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
			'nextNeuronID':nextNeuronID,
			'NodeMutationList':NodeMutationList,
			'LinkMutationList':LinkMutationList	
		}

};

function initializePool(){
	pool = new Pool();
 
	for (i =0;i<Config.Population;i++){	
		var basic = basicGenome();
		addToSpecies(basic,pool);
	}
	console.log("\ninitializePool is executed");
	return pool;
}

//innovation is the next available innovation number
function newInnovation(pool){
	pool.innovation = pool.innovation + 1;
	console.log("\nnewInnovation is executed");
	return pool.innovation-1;	//innovation - 1 is available
}

function rankGlobally(pool){	
	var global1 = [];

	for (var s = 1 in pool.species){
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
	console.log("\nrankGlobally is executed");
}

// module.exports = Pool;