function crossover(g1, g2){
	// Make sure g1 is the higher fitness genome
	if (g2.fitness > g1.fitness){
	 var tempg = g1;
		g1 = g2;
		g2 = tempg;
	}

	var child = newGenome();

	var innovations2 = {};
	for (i in g2.genes){
		var gene = g2.genes[i];
		innovations2[gene.innovation] = gene;
	}
	var gene1={};
	var gene2={};
	for (i in g1.genes){
	  gene1 = g1.genes[i];
		gene2 = innovations2[gene1.innovation];
		if (gene2 != null && (2*Math.random()) == 1 && gene2.enabled){
			child.genes.push(copyGene(gene2))}
		else{
			child.genes.push(copyGene(gene1))}
	}

	child.maxneuron = Math.max(g1.maxneuron,g2.maxneuron)

	for (mutation in g1.mutationRates){
		child.mutationRates[mutation] = g1.mutationRates[mutation];}

	return child;
}

function randomNeuron(genes, nonInput){//check this function
	var neurons = {};
	if (!nonInput){
		for (i=1,i<=Inputs,i++){
			neurons[i] = true;
		}
	}
	for (o=1,o<=Outputs,o++){
		neurons[MaxNodes+o] = true;
	}
	for (i in genes){
		if ((!nonInput) || (genes[i].into > config.Inputs)){
						neurons[genes[i].into] = true}
		if ((not nonInput) || (genes[i].out > Inputs)){
			neurons[genes[i].out] = true;
		}
	}

	var count = 0;
	for (i in neurons){
		count = count + 1;
	}
	var n = Math.floor(Math.random())*(count-1)+1;

	for (k in neurons){
		n = n-1;
		if (n == 0)
			return k;
	}

	return 0;
}

function containsLink(genes, link){
	var gene={};
	for (i in genes){
	  gene = genes[i];
		if (gene.into == link.into && gene.out == link.out){
			return true}
		}
}

function pointMutate(genome)
	local step = genome.mutationRates['step']

	for i=1,#genome.genes do
		local gene = genome.genes[i]
		if Math.random() < PerturbChance then
			gene.weight = gene.weight + Math.random() * step*2 - step
		else
			gene.weight = Math.random()*4-2
		end
	end
}

function linkMutate(genome, forceBias)
	local neuron1 = randomNeuron(genome.genes, false)
	local neuron2 = randomNeuron(genome.genes, true)

	local newLink = newGene()
	if neuron1 <= Inputs and neuron2 <= Inputs then
		--Both input nodes
		return
	end
	if neuron2 <= Inputs then
		-- Swap output and input
		local temp = neuron1
		neuron1 = neuron2
		neuron2 = temp
	end

	newLink.into = neuron1
	newLink.out = neuron2
	if forceBias then
		newLink.into = Inputs
	end

	if containsLink(genome.genes, newLink) then
		return
	end
	newLink.innovation = newInnovation()
	newLink.weight = Math.random()*4-2

	table.insert(genome.genes, newLink)
end

function nodeMutate(genome)
	if #genome.genes == 0 then
		return
	end

	genome.maxneuron = genome.maxneuron + 1

	local gene = genome.genes[Math.random(1,#genome.genes)]
	if not gene.enabled then
		return
	end
	gene.enabled = false

	local gene1 = copyGene(gene)
	gene1.out = genome.maxneuron
	gene1.weight = 1.0
	gene1.innovation = newInnovation()
	gene1.enabled = true
	table.insert(genome.genes, gene1)

	local gene2 = copyGene(gene)
	gene2.into = genome.maxneuron
	gene2.innovation = newInnovation()
	gene2.enabled = true
	table.insert(genome.genes, gene2)
end

function enableDisableMutate(genome, enable)
	local candidates = {}
	for _,gene in pairs(genome.genes) do
		if gene.enabled == not enable then
			table.insert(candidates, gene)
		end
	end

	if #candidates == 0 then
		return
	end

	local gene = candidates[Math.floor(Math.random(1,#candidates)*(candidates.length)+1)];
	gene.enabled = not gene.enabled
end

function mutate(genome){
	for (mutation in genome.mutationRates){
		if (Math.random(1,2) == 1){
			genome.mutationRates[mutation] = 0.95*rate;}
		else{
			genme.mutationRates[mutation] = 1.05263*rate;}
	}

	if Math.random() < genome.mutationRates['connections'] then
		pointMutate(genome)
	end

	local p = genome.mutationRates['link']
	while p > 0 do
		if Math.random() < p then
			linkMutate(genome, false)
		end
		p = p - 1
	end

	p = genome.mutationRates['bias']
	while p > 0 do
		if Math.random() < p then
			linkMutate(genome, true)
		end
		p = p - 1
	end

	p = genome.mutationRates['node']
	while p > 0 do
		if Math.random() < p then
			nodeMutate(genome)
		end
		p = p - 1
	end

	p = genome.mutationRates['enable']
	while p > 0 do
		if Math.random() < p then
			enableDisableMutate(genome, true)
		end
		p = p - 1
	end

	p = genome.mutationRates['disable']
	while p > 0 do
		if Math.random() < p then
			enableDisableMutate(genome, false)
		end
		p = p - 1
	end
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
		if (not i1[gene.innovation]){
			disjointGenes = disjointGenes+1;
		}
	}

	var n = Math.max(genes1.length,genes2.length);

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

	return sum / coincident;
}
