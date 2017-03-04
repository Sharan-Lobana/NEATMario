var Gene = function(){
	var into = 0;
	var out = 0;
  	var	weight = 0.0;
	var enabled = true;
	var innovation = 0;

	return{
		'into':into,
		'out':out,
		'weight':weight,
		'enabled':enabled,
		'innovation':innovation,
	}
};


function copyGene(gene){

  	gene2 = new Gene();
	gene2.into = gene.into;
	gene2.out = gene.out;
	gene2.weight = gene.weight;
	gene2.enabled = gene.enabled;
	gene2.innovation = gene.innovation;
	console.log("\ncopyGene is executed");
	return gene2;
}

function disjoint(genes1, genes2){
	var i1 = {};
	var gene ={};

	for (i in genes1){

	  	gene = genes1[i];
		i1[gene.innovation] = true;
	}

	var i2 = {};
	for (i in genes2){

	  	gene = genes2[i];
		i2[gene.innovation] = true;
	}

	var disjointGenes = 0;
	for (i in genes1){
	  gene = genes1[i];
		if (!i2[gene.innovation]){
			disjointGenes = disjointGenes+1;
		}
	}

	for (i in genes2){
	  gene = genes2[i];
		if (!i1[gene.innovation]){
			disjointGenes = disjointGenes+1;
		}
	}

	var n = Math.max(genes1.length,genes2.length);
	console.log("\ndisjoint is executed");
	return disjointGenes / n;
}

function weights(genes1, genes2){

	var i2 = {};
	var gene={};

	for (i in genes2){

		gene = genes2[i];
		i2[gene.innovation] = gene;
	}

	var sum = 0;
	var coincident = 0;
	var gene2={};
	for (i in genes1){

		gene = genes1[i];

		if (i2[gene.innovation] != null){

		  	gene2 = i2[gene.innovation];
			sum = sum + Math.abs(gene.weight - gene2.weight);
			coincident = coincident + 1;
		}
	}
	console.log("\nweights is executed");
	return sum / coincident;
}

// module.exports = Gene;
