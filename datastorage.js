var config = require('./config');
var datastorage = {
		writeToFile:null,
		loadFromFile:null,

   
   
 };
 
 datastorage.writeToFile = function(fileName){
     	var jsonGenomes = {};
     	jsonGenomes.generation = pool.generation; 
	     	jsonGenomes.maxFitness = pool.maxFitness;
     	jsonGenomes.speciesLength = pool.species.length;

     	for(var key in pool.species){
       	var species = pool.species[key];
       	jsonGenomes.species = species;
        jsonGenomes.topFitness = species.topFitness;
        jsonGenomes.staleness = species.staleness;
        jsonGenomes.genomes = species.genomes ;

       	for(var k in species.genomes){
    		var genome = species.genomes[k];
    		jsongenomes.genome = genome;
        jsonGenomes.fitness = genome.fitness;
        jsonGenomes.maxneuron = genome.maxneuron;

       for(var l in genome.mutationRates){
    			jsongenomes.mutationRates = l + genome.mutationRates[l];
    		}
    
       jsonGenomes.geneslength = genome.genes.length;
       for (var a in genome.gene){
         var gene = genome.gene;
         jsonGenomes.into = gene.into + " ";
         jsonGenomes.out = gene.out + " ";
         jsonGenomes.weight = gene.weight + "";
         jsonGenomes.innovation = gene.innovation + " ";
         if(gene.enabled)
         jsonGenomes.geneenabled = 1 ;
         else 
         jsonGenomes.geneenabled = 0;
       }
     }
   }
   var filename = config.StorageDir+'/'+datetime.now()+'_'+pool.generation+'_'+pool.maxFitness+'.json';
   fs.writeFileSync(filename,JSON.stringify(jsonGenomes));
}

 datastorage.loadFromFile = function(fileName){
 	var jsonGenomes = JSON.parse(fs.readFileSync(fileName));
 	var pool = new Pool();
 	pool.species.length = jsonGenomes.speciesLength;

 	pool.maxFitness = jsonGenomes.maxFitness;
 	pool.generation = jsonGenomes.generation;
 	for( var b=0; b<jsonGenomes.speciesLength ;b++){
 		var species = new Species();
 		species.topFitness = jsonGenomes.fitness;
 		species.staleness = jsonGenomes.staleness;
        species.genome.length = jsonGenomes.genomeLength;
        for(var c=0; c< jsonGenomes.genomeLength;c++){
        	var genome = new genome();
        	genome.maxneuron = jsonGenomes.maxneuron;
        	genome.fitness = jsonGenomes.fitness;


        	genome.genes.length = jsonGenomes.geneslength;
            for(var d =0; d< jsonGenomes.geneslength;d++){
            	var gene = new gene();
            	gene.into = jsonGenomes.into;
            	gene.out = jsonGenomes.out;
            	gene.innovation = jsonGenomes.innovation;
            	gene.weight = jsonGenomes.weight;
            	if(jsonGenomes.geneenabled ){
					gene.enabled = true
            	}
				else{
					gene.enabled = false
				}


            }

        }
        
 	}

 	
 }
module.exports = datastorage;


    		