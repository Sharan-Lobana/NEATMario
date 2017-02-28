var Species = require('./Species');
var Genome = require('./Genome');
var Config = require('./config');



var Pool = (function(){

	var species = {};
	var generation = 0;
	var innovation = 6; //= Outputs,
	var currentSpecies =1;
	var currentGenome = 1;
	var currentFrame = 0;
	var maxFitness = 0;

	return {'species':species,
			'generation':generation,
			'innovation':innovation,
			'currentSpecies':currentSpecies,
			'currentGenome':currentGenome,
			'currentFrame':currentFrame,
			'maxFitness':maxFitness
		};

};

function initializePool(){
	var pool = Pool();
 
	for (i =0;i<Config.Population;i++){	
		var basic = Genome.basicGenome();
		Species.addToSpecies(basic);
	}

}

function rankGlobally(){	
	var global = {};

	for (var s = 1 in Pool.species){
		var species = Pool.species[s];

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

module.exports = Pool;