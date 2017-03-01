var Config  = require('./config')
var Genome = require('./Genome');
var Pool = require('./Pool');
var Gene = require('./Gene');



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
    };

};

function calculateAverageFitness(){
      var total = 0 ;
        for (g =0 ;g<Species.genomes.length;g++){
            var genome = Species.genomes[g];
            total = total + genome.globalRank;
        }

        Species.averageFitness = total / Species.genome.length;
        return Species.averageFitness;
}


function totalAverageFitness(){
       var total = 0;
        for(s=0; s<Pool.species.length;s++){
            var species = pool.species[s];
            total = total + species.averageFitness;
        }
        return total;

}

function cullSpecies(cutToOne){
    for(s=0; s<Pool.species.length;s++){
        var species = Pool.species[s]; 

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
}


function breedChild(species){
    var child = {};
    if (Math.random() < Config.CrossoverChance){
        var g1 = Species.genomes[Math.random(1, Species.genomes.length)];
        var g2 = Species.genomes[Math.random(1, Species.genomes.length)];
        child = Genome.crossover(g1, g2);
    }else{
        var g = Species.genomes[Math.random(1, Species.genomes.length)];
        child = Genome.copyGenome(g);
    }

    Genome.mutate(child);                  //check : 
    return child;

}

function removeStaleSpecies(){
    var survived = {};
 
    for (s =0;s<Pool.species.length;s++ ){
        var species = Pool.species[s];            //this is the var species , dont confuse it with our class species..

        species.genomes.sort(function (a,b){
            return (a.fitness > b.fitness);
        });
           
        if (species.genomes[1].fitness > species.topFitness) {
            species.topFitness = species.genomes[1].fitness;
            species.staleness = 0;
        } else{
            species.staleness = species.staleness + 1;
        }
        
        if (species.staleness < Config.StaleSpecies or species.topFitness >= Pool.maxFitness ){
            survived.push(species);
        }        
    } 

    Pool.species = survived;


}

function removeWeakSpecies{
    var survived = {};
 
    var sum = Species.totalAverageFitness();

    for (s =0;s<Pool.species.length; s++ ){
        var species = Pool.species[s];
        breed = Math.floor(species.averageFitness / sum * Config.Population);
        if (breed >= 1 ){
            survived.push(species);
        }        
    }
 
    Pool.species = survived;

}

function addToSpecies(child){

    var foundSpecies = false;

    for (s in Pool.species){
        var species = Pool.species[s];
        if (!foundSpecies && Genome.sameSpecies(child, species.genomes[1])){
            species.genomes.push(child);
            foundSpecies = true;
        }
    }
       
    if (!foundSpecies ){
        var childSpecies = new Species;
        childSpecies.genomes.push(child);
        Pool.species.push(childSpecies);
    }

}

function sameSpecies(genome1, genome2){
    var dd = Config.DeltaDisjoint*Gene.disjoint(genome1.genes, genome2.genes);
    var dw = Config.DeltaWeights*Gene.weights(genome1.genes, genome2.genes);
    return dd + dw < Config.DeltaThreshold;
}

module.exports = Species;