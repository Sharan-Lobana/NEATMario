
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
		}

};

function initializePool(){
	pool = newPool()
 
	for (i in Population){	
		basic = basicGenome()
		addToSpecies(basic)
	
	}

}

function rankGlobally(){
	local global = {}

	for (s = 1 in pool.species){
		local species = pool.species[s]
		for (g in species.genomes ){
			table.insert(global, species.genomes[g])
		}
		
	}

	table.sort(global, function (a,b)			//check this ..
		return (a.fitness < b.fitness)
	end)
       
	for(g=1 in global){
		global[g].globalRank = g
	}
	

}





