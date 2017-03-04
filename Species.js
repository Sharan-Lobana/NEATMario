// var Config  = require('./config')
// var Genome = require('./Genome');
// var Gene = require('./Gene');



var Species = function(){

	var topFitness =  0;
	var staleness = 0;
	var genomes = [];
	var averageFitness = 0;

    return {
        'topFitness':topFitness,
        'staleness':staleness,
        'genomes':genomes,
        'averageFitness':averageFitness
    };

};

function calculateAverageFitness(species){
      var total = 0 ;
        for (g =0 ;g<species.genomes.length;g++){
            var genome = species.genomes[g];
            total = total + genome.globalRank;
        }

        species.averageFitness = total / species.genome.length;
        console.log("\ncalculateAverageFitness is executed");
        return averageFitness;
}


function totalAverageFitness(pool){
       var total = 0;
        for(s=0; s<pool.species.length;s++){
            var species = pool.species[s];
            total = total + species.averageFitness;
        }
        console.log("\ntotalAverageFitness is executed");
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
    console.log("\ncullSpecies is executed");
}


function breedChild(species){
    var child = {};
    if (Math.random() < Config.CrossoverChance){
        var g1 = species.genomes[Math.floor(Math.random()* species.genomes.length)];
        var g2 = species.genomes[Math.floor(Math.random()* species.genomes.length)];
        child = crossover(g1, g2);
    }else{
        var g = species.genomes[Math.floor(Math.random()* species.genomes.length)];
        child = copyGenome(g);
    }

    mutate(child);                  //check :
    console.log("\nbreedChild is executed");
    return child;


}

function removeStaleSpecies(pool){
    var survived = [];

    for (s =0;s<pool.species.length;s++ ){
        var species = pool.species[s];

        species.genomes.sort(function (a,b){
            return (a.fitness > b.fitness);
        });

        if (species.genomes[0].fitness > species.topFitness) {
            species.topFitness = species.genomes[0].fitness;
            species.staleness = 0;
        } else{
            species.staleness = species.staleness + 1;
        }

        if (species.staleness < Config.StaleSpecies || species.topFitness >= pool.maxFitness ){
            survived.push(species);
        }
    }

    pool.species = survived;
    console.log("\nremoveWeakSpecies is executed");


}

function removeWeakSpecies(pool){
    var survived = [];

    var sum = totalAverageFitness();

    for (s =0;s<pool.species.length; s++ ){
        var species = pool.species[s];
        breed = Math.floor(species.averageFitness / sum * Config.Population);
        if (breed >= 1 ){
            survived.push(species);
        }
    }

    pool.species = survived;
    console.log("\nremoveWeakSpecies is executed");

}

function addToSpecies(child,pool){

    var foundSpecies = false;

    for (var s in pool.species){
        var species = pool.species[s];
        if (!foundSpecies && sameSpecies(child, species.genomes[0])){
            species.genomes.push(child);
            foundSpecies = true;
        }
    }

    if (!foundSpecies ){
        console.log("New species created.");
        var childSpecies = new Species();
        // console.log(childSpecies.genomes);
        childSpecies.genomes.push(child);
        pool.species.push(childSpecies);
    }
    console.log("\naddToSpecies is executed");

}

function sameSpecies(genome1, genome2){
    var dd = Config.DeltaDisjoint*disjoint(genome1.genes, genome2.genes);
    var dw = Config.DeltaWeights*weights(genome1.genes, genome2.genes);
    console.log("\nsameSpecies is executed");
    return dd + dw < Config.DeltaThreshold;
}

// module.exports = Species;
