var config  = require('./config')

var Species = (function(){

	var topFitness =  0;
	var staleness = 0;
	var genomes = {};
	var averageFitness = 0;
       
    return {
        'topFitness':topFitness,
        'staleness':staleness,
        'genomes':genomes,
        'averageFitness':averageFitness
    }

};

function calculate_avg_fitness(){
      var total = 0 ;
        for (g in Species.genomes){
            local genome = Species.genomes[g];
            total = total + genome.globalRank;
        }

        var species.averageFitness = total / Species.genome.length;
        return Species.averageFitness;
}


function total_avg_fitness(){
       var total = 0;
        for(s in Pool.species){
            local species = pool.species[s];
            total = total + species.averageFitness;
        }
        return total;

}

function cullSpecies(cutToOne){
    for(s in pool.species ){
        local species = pool.species[s];
           
        table.sort(species.genomes, function (a,b)
            return (a.fitness > b.fitness);
        end)
           
        local remaining = math.ceil(species.genomes.length/2);
        if (cutToOne){
                remaining = 1;
            } 
    
        while (species.genomes.length> remaining){
            table.remove(species.genomes);           
        }
    }
}


function breedChild(){
    local child = {}
    if (math.random() < CrossoverChance){
        g1 = species.genomes[math.random(1, species.genomes.length)];
        g2 = species.genomes[math.random(1, species.genomes.length)];
        child = crossover(g1, g2);
    }else{
        g = species.genomes[math.random(1, species.genomes.length)];
        child = copyGenome(g);
    }

    mutate(child);                  //check : 
    return child;

}

function removeStaleSpecies{
    local survived = {}
 
    for (s = 1 in pool.species ){
        local species = pool.species[s];

        // learn how to write this line -->
        // table.sort(species.genomes, function (a,b)
        //     return (a.fitness > b.fitness)
        // end)
           
        if (species.genomes[1].fitness > species.topFitness) {
            species.topFitness = species.genomes[1].fitness;
            species.staleness = 0;
        } else{
            species.staleness = species.staleness + 1;
        }
        
        if (species.staleness < StaleSpecies or species.topFitness >= pool.maxFitness ){
            table.insert(survived, species);
        }        
    } 

    pool.species = survived;


}

function removeWeakSpecies{
    local survived = {}
 
    local sum = totalAverageFitness()
    for (s = in pool.species ){
        local species = pool.species[s];
        breed = math.floor(species.averageFitness / sum * Population);
        if (breed >= 1 ){
            table.insert(survived, species);
        }        
    }
 
    pool.species = survived;

}

function addToSpecies{

    local foundSpecies = false
    for (s in pool.species ){
        local species = pool.species[s];
        if (!foundSpecies && sameSpecies(child, species.genomes[1]) ){
            table.insert(species.genomes, child)
            foundSpecies = true
        }
    }
       
    if (!foundSpecies ){
        local childSpecies = newSpecies();
        table.insert(childSpecies.genomes, child;
        table.insert(pool.species, childSpecies);
    }

}

