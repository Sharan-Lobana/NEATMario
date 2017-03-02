var Config  = require('./config')
var Genome = require('./Genome');
var Pool = require('./Pool');
var Gene = require('./Gene');



var Species = function(){

	var topFitness =  0;
	var staleness = 0;
	var genomes = {};
	var averageFitness = 0;
       
    return {
        'topFitness':topFitness,
        'staleness':staleness,
        'genomes':genomes,
        'averageFitness':averageFitness
    };

};

function calculateAverageFitness(species){
      console.log("calculateAverageFitness");

      var total = 0 ;
        for (g =0 ;g<species.genomes.length;g++){
            var genome = species.genomes[g];
            total = total + genome.globalRank;
        }

        species.averageFitness = total / species.genome.length;
        return averageFitness;
}


function totalAverageFitness(pool){
    console.log("totalAverageFitness");
       var total = 0;
        for(s=0; s<pool.species.length;s++){
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
    console.log("cullSpecies");
}


function breedChild(species){
    var child = {};
    if (Math.random() < Config.CrossoverChance){
        var g1 = species.genomes[Math.random(1, species.genomes.length)];
        var g2 = species.genomes[Math.random(1, species.genomes.length)];
        child = crossover(g1, g2);
    }else{
        var g = species.genomes[Math.random(1, species.genomes.length)];
        child = copyGenome(g);
    }

    mutate(child);                  //check : 
    console.log("breedChild");
    return child;


}

function removeStaleSpecies(pool){
    var survived = {};
 
    for (s =0;s<pool.species.length;s++ ){
        var species = pool.species[s];            

        species.genomes.sort(function (a,b){
            return (a.fitness > b.fitness);
        });
           
        if (species.genomes[1].fitness > species.topFitness) {
            species.topFitness = species.genomes[1].fitness;
            species.staleness = 0;
        } else{
            species.staleness = species.staleness + 1;
        }
        
        if (species.staleness < Config.StaleSpecies || species.topFitness >= pool.maxFitness ){
            survived.push(species);
        }        
    } 

    pool.species = survived;
    console.log("removeWeakSpecies");


}

function removeWeakSpecies(pool){
    var survived = {};
 
    var sum = totalAverageFitness();

    for (s =0;s<pool.species.length; s++ ){
        var species = pool.species[s];
        breed = Math.floor(species.averageFitness / sum * Config.Population);
        if (breed >= 1 ){
            survived.push(species);
        }        
    }
 
    pool.species = survived;
    console.log("removeWeakSpecies");

}

function addToSpecies(child,pool){

    var foundSpecies = false;

    for (s in pool.species){
        var species = pool.species[s];
        if (!foundSpecies && sameSpecies(child, species.genomes[1])){
            species.genomes.push(child);
            foundSpecies = true;
        }
    }
       
    if (!foundSpecies ){
        var childSpecies = new Species();
        childSpecies.genomes.push(child);
        pool.species.push(childSpecies);
    }
    console.log("addToSpecies");

}

function sameSpecies(genome1, genome2){
    var dd = Config.DeltaDisjoint*disjoint(genome1.genes, genome2.genes);
    var dw = Config.DeltaWeights*weights(genome1.genes, genome2.genes);
    return dd + dw < Config.DeltaThreshold;

    console.log("sameSpecies");
}

module.exports = Species;