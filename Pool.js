// var Species = require('./Species');
// var Genome = require('./Genome');
// var Config = require('./config');


var Pool = function(){

	var species = [];
	var generation = 0;
	var innovation = Config.Inputs*Config.Outputs;
	var currentSpecies =1;
	var currentGenome = 1;
	var currentFrame = 0;
	var maxFitness = 0;
	var shouldStop = false;

	return {'species':species,
			'generation':generation,
			'innovation':innovation,
			'currentSpecies':currentSpecies,
			'currentGenome':currentGenome,
			'currentFrame':currentFrame,
			'maxFitness':maxFitness,
			'shouldStop':shouldStop
		}

};

function initializePool(){
	pool = new Pool();

	for (i =0;i<Config.Population;i++){
		var basic = basicGenome();	//Comeback
		addToSpecies(basic,pool);
	}

	return pool;
}

function newInnovation(pool){
	pool.innovation = pool.innovation + 1;
	return pool.innovation;
}

function rankGlobally(pool){
	var global = {};

	for (var s = 1 in pool.species){
		var species = pool.species[s];

		for (var g in species.genomes ){
			global.push(species.genomes[g]);
		}

	}

	global.sort(
		function (a,b){
		return (a.fitness < b.fitness);
		}
	);


	for(var g =0 ; g<global.length ; g++ ){
		global[g].globalRank = g;
	}

}

// module.exports = Pool;
