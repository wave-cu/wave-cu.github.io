---
title: "Lesson 4 — Abstraction and Algorithm Design"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Identify which details are essential and which are irrelevant for a given bioinformatics problem
- Explain the costs and benefits of different levels of abstraction
- Evaluate multiple algorithms for the same problem using structured trade-off analysis
- Apply the SACRED framework (Speed, Accuracy, Cost, Robustness, Ease, Data suitability) to algorithm selection
- Make and justify algorithm choices under realistic biological and computational constraints
- Recognise when an abstraction has failed and how to revise it

---

## Part 1: Abstraction in Depth

### 1.1 Levels of Abstraction

Every bioinformatics analysis involves multiple simultaneous levels of abstraction. Understanding which level you are working at — and which levels you are ignoring — is fundamental to correct interpretation.

Consider a single RNA-Seq experiment:

| Level | What is real | What we abstract to |
|-------|-------------|-------------------|
| Molecular | Individual mRNA molecules in a cell | A count of transcript copies |
| Cellular | Heterogeneous cell population | A "bulk" average signal |
| Technical | Probabilistic basecalling, PCR amplification bias | A quality-filtered read |
| Statistical | Continuous expression distribution | A discrete count per gene |
| Biological | Complex gene regulatory networks | A list of differentially expressed genes |

At each level, you discard information to make the problem tractable. The key question at each step: **is what I am discarding relevant to my biological question?**

If your question is "which genes are differentially expressed on average across a tissue?", bulk RNA-Seq is an appropriate abstraction. If your question is "do all cells respond uniformly, or is there a rare responding subpopulation?", bulk RNA-Seq is the *wrong* abstraction — you need single-cell RNA-Seq, which maintains cellular resolution.

---

### 1.2 Case Study: What Details Matter in Genome Assembly?

**Scenario:** You are assembling a begomovirus genome (~2.7 kb per DNA component) from Nanopore reads.

**Details that matter:**

| Detail | Why it matters |
|--------|---------------|
| Read length distribution | Determines whether reads can span the full genome |
| Error rate of the reads | Determines polishing requirements and assembler choice |
| Expected genome size | Sets coverage requirements and helps validate assembly |
| Genome circularity | Begomoviruses have circular genomes; most assemblers assume linear — must check |
| Host proportion in sample | Directly affects effective viral coverage after host removal |

**Details that can be safely abstracted away at assembly stage:**

| Detail | Why it can be ignored |
|--------|----------------------|
| Exact basecalling model used | Relevant at QC, but by assembly time reads are already called |
| DNA extraction protocol | Affects yield (relevant earlier) but not assembler input logic |
| Which primers were used for library prep | Relevant for adapter trimming (already done); irrelevant for assembly |
| Sample collection date | Epidemiologically important, but not relevant to assembly algorithm |
| The researcher's name | Not relevant at any computational step |

**The key insight:** "Can be safely ignored" depends entirely on the question. The DNA extraction protocol is irrelevant for assembly, but essential for troubleshooting if yields were unexpectedly low. Always ask: "ignored *for what purpose*?"

---

### 1.3 Case Study: Abstractions in Reference-Based Assembly vs. De Novo

When you choose between reference-based and de novo assembly, you are choosing between two different abstractions of the same biological reality.

**Reference-based assembly abstracts the genome as:**
"A set of positions along a known coordinate system (the reference), where some positions may differ from the reference."

This abstraction is powerful when:
- A close reference exists (> ~90% identity)
- You are interested in variation (SNPs, indels) rather than novel sequence
- Computational resources are limited

This abstraction **fails when:**
- The sample contains large insertions not in the reference
- The sample is so divergent that most reads fail to map
- You need to discover novel genomic elements

**De novo assembly abstracts the genome as:**
"A sequence that can be reconstructed from read-read overlaps, without assumptions about the content."

This abstraction is powerful when:
- No close reference exists
- You expect structural novelty
- You are characterising a new organism or virus

This abstraction **fails when:**
- Coverage is insufficient for confident overlap detection
- Reads are too short to span complex repeat regions
- The sample is heavily contaminated (overlaps from contaminating DNA cause misassembly)

**The lesson:** Neither abstraction is universally correct. The begomovirus project in Module 5 was a case where de novo assembly was the appropriate choice — you were working with potentially novel strains, and the reference-based approach would have missed divergent regions. But if you had been typing a *known* pathogen for clinical surveillance, reference-based mapping would have been faster and sufficient.

---

### 1.4 When Abstractions Fail: A Diagnostic Guide

An abstraction fails when the detail you discarded turns out to be relevant after all. Recognising this is a critical debugging skill.

**Signs that your abstraction has failed:**

1. **Results are biologically implausible.** Assembly size is 50 kb for a known 5 kb virus → you have included contaminating sequences in your abstraction of "viral reads."

2. **Results are inconsistent across replicate analyses.** Every time you re-run with slightly different parameters, you get a completely different answer → your abstraction is too sensitive to parameters that should not matter, suggesting the true signal is weak.

3. **A downstream tool refuses to accept your output.** For example, GATK expects reads to have read groups (`@RG` header); if your alignment lacks these, the tool will crash. This is a signal that you abstracted away a metadata field (read group assignment) that a downstream algorithm needs.

4. **Statistical diagnostics fail.** A QQ plot that shows severe inflation, a coverage plot with extreme bimodality, a BUSCO score near 0% — these are signs that reality does not match your model.

**What to do when an abstraction fails:**

```
Step 1: Identify which abstraction failed
         (Which detail did you discard that turned out to matter?)

Step 2: Revise the abstraction
         (Add back the necessary detail)

Step 3: Re-run from the point of failure
         (Do not re-run the entire pipeline)

Step 4: Document the revision
         (Why did you add that detail back? What was the evidence?)
```

---

## Part 2: Algorithm Design in Depth

### 2.1 The SACRED Framework for Algorithm Selection

When choosing between multiple valid algorithms for the same problem, apply the SACRED framework:

| Letter | Factor | Key question |
|--------|--------|-------------|
| **S** | Speed | How long will this take, given my data size? |
| **A** | Accuracy | How correct are the results? What are the error rates? |
| **C** | Cost | What computational resources are required? (RAM, CPU, storage) |
| **R** | Robustness | How does the algorithm perform on messy, real-world data? |
| **E** | Ease | How hard is it to install, configure, and interpret? |
| **D** | Data suitability | Was this algorithm designed for data like mine? |

No algorithm scores highest on all six. The art of algorithm design is knowing which factors matter most for your specific problem.

---

### 2.2 Detailed Trade-Off Analysis: Read Mapping Algorithms

**Problem:** You have Illumina short reads and need to map them to a reference genome for variant calling.

| Factor | BWA-MEM | Bowtie2 | STAR |
|--------|---------|---------|------|
| **Speed** | Fast (~30 min/sample) | Very fast | Moderate (genome index is slow to build) |
| **Accuracy** | High, especially for long reads and variants | Good for short reads | Excellent for spliced RNA-Seq; poor for DNA |
| **Cost (RAM)** | ~5–8 GB | ~4–6 GB | ~30 GB (due to splice-aware index) |
| **Robustness** | Handles indels well | Less robust to large indels | Handles introns correctly |
| **Ease** | Well-documented, standard | Well-documented | Complex configuration for splice-aware mode |
| **Data suitability** | DNA-Seq, amplicons, WGS | DNA-Seq, short reads | RNA-Seq only |

**Verdict:** For DNA variant calling → BWA-MEM. For RNA-Seq → STAR. Using STAR for DNA variant calling would miss structural variants and consume unnecessary memory. Using BWA-MEM for RNA-Seq would fail to map reads that span exon-exon junctions.

---

### 2.3 Detailed Trade-Off Analysis: Variant Callers

**Problem:** You want to identify germline variants in a human genome.

| Factor | GATK HaplotypeCaller | samtools mpileup + bcftools | FreeBayes |
|--------|---------------------|----------------------------|-----------|
| **Speed** | Slow (hours per sample) | Fast (minutes) | Moderate |
| **Accuracy** | Very high, especially indels | Good for SNPs, weaker for complex indels | Good, especially for polyploid |
| **Cost (RAM)** | 4–8 GB | 2–4 GB | 4–6 GB |
| **Robustness** | Handles complex loci via local reassembly | Sensitive to mapping quality at complex loci | Handles multi-allelic sites well |
| **Ease** | Complex GATK ecosystem, steep learning curve | Simple command-line interface | Moderate complexity |
| **Data suitability** | Germline, human WGS/WES | Any organism, quick variant survey | Any organism, polyploid support |

**Verdict:** For clinical-grade germline variant calling in a funded project → GATK HaplotypeCaller. For a rapid exploratory variant survey in a non-human organism → samtools mpileup + bcftools. The cost (time and complexity) of GATK is justified in high-stakes contexts but not always in exploratory analyses.

---

### 2.4 Detailed Trade-Off Analysis: De Novo Assembly Tools

**Problem:** You want to assemble a 2.7 kb viral genome from Nanopore reads.

| Factor | Flye | Canu | Hifiasm | SPAdes |
|--------|------|------|---------|--------|
| **Speed** | Fast (minutes for small genome) | Slow (hours) | Fast | Fast |
| **Accuracy** | Good, needs polishing | Very good after self-correction | Excellent (designed for HiFi) | Good for short reads |
| **Cost (RAM)** | 4–16 GB | 16–64 GB | 16 GB | 4–8 GB |
| **Robustness** | Handles high error rate well | Robust to errors via self-correction | Requires HiFi reads | Best for short Illumina reads |
| **Ease** | Simple, well-documented | Complex parameter tuning | Straightforward | Well-documented |
| **Data suitability** | Nanopore raw reads (R9/R10) | Nanopore or PacBio CLR | PacBio HiFi (CCS) only | Illumina short reads |

**Verdict for the begomovirus project:** Flye was the correct choice. Canu would have worked but with longer runtime and more memory. Hifiasm was not appropriate because the data was not HiFi. SPAdes was not appropriate because the reads were long Nanopore reads with a high error profile.

---

### 2.5 Algorithm Design: Multiple Valid Approaches to the Same Problem

A critical insight in computational thinking: **for almost every bioinformatics problem, multiple valid algorithms exist.** The goal is not to find the only correct algorithm — it is to find a justified algorithm for your constraints.

**Example: Detecting Host Contamination Before Assembly**

*Approach A: Map-and-filter (standard approach)*
```bash
# Map all reads to host genome
minimap2 -ax map-ont host_genome.fa reads.fastq > mapped.sam

# Extract unmapped reads (these are potentially non-host)
samtools view -f 4 mapped.sam | samtools fastq > viral_reads.fastq
```
- Advantage: Fast, well-established, works with any reference genome
- Disadvantage: Requires a good host reference genome; divergent host strains may be missed

*Approach B: Taxonomic classification (Kraken2)*
```bash
# Classify reads by taxonomy
kraken2 --db k2_standard reads.fastq --output kraken_output.txt --report report.txt

# Extract non-host reads
extract_kraken_reads.py -k kraken_output.txt -s reads.fastq \
  --exclude --taxid 3983 > viral_reads.fastq  # 3983 = Manihot esculenta
```
- Advantage: Does not require a complete host reference genome; classifies to species level
- Disadvantage: Depends on database completeness; novel organisms may be missed; requires larger database download

*Approach C: GC-content separation (opportunistic — only when GC profiles are very different)*
```bash
# Compute per-read GC content and filter
awk '{if (NR%4==2) {gc=gsub(/[GCgc]/,""); print gc/length($0)}}' reads.fastq > gc_content.txt
# Then filter reads with GC content in the viral range
```
- Advantage: No reference required
- Disadvantage: Crude, unreliable when host and pathogen have similar GC content; would fail for begomoviruses (GC ~40%) in cassava (GC ~34%)

**Which approach should you choose?**

For the Module 5 scenario:
- Host reference genome (Manihot esculenta) is available on NCBI → Approach A is fast and reliable
- Approach B is valid but requires downloading a large Kraken2 database (~50 GB)
- Approach C is inappropriate — GC profiles too similar

**Constraint-based selection:**

| Constraint | Preferred approach |
|-----------|-------------------|
| Good reference genome available, fast turnaround needed | A (map-and-filter) |
| No reference genome, comprehensive classification needed | B (Kraken2) |
| Very limited storage and compute | A with a reduced reference |
| Novel host with no genome | B or A against closest relative |

---

### 2.6 How to Choose: A Practical Decision Guide

When you face a choice between multiple algorithms, work through this checklist:

```
1. What is my data type?
   → This immediately eliminates algorithms that are incompatible

2. What is my primary constraint?
   → Time? Memory? Accuracy? Choose the algorithm where that factor scores highest

3. What are the known failure modes of each option?
   → Does my data trigger any known failure modes?

4. What have others used for this type of data?
   → Check tool benchmarking papers, GitHub Issues, and bioinformatics forums

5. What is the cost of being wrong?
   → Clinical application: prioritise accuracy. Exploratory analysis: prioritise speed.

6. Can I test multiple approaches on a subset?
   → If compute allows, run two approaches on a small subset and compare
```

---

### 2.7 Parameter Tuning: A Special Case of Algorithm Design

Choosing an algorithm is only the first decision. Most bioinformatics tools have multiple parameters, each of which can significantly change the output. Parameter tuning is itself an algorithm design problem.

**Guiding principles for parameter tuning:**

1. **Start with defaults.** Tool authors set defaults for typical use cases. Understand what "typical" means before departing from defaults.

2. **Tune one parameter at a time.** Changing multiple parameters simultaneously makes it impossible to attribute the effect to a specific change.

3. **Tune on a subset.** Run multiple parameter combinations on a small subset of your data (e.g., one sample, or 10% of reads) before committing to a full run.

4. **Evaluate with a metric, not by eye.** Define your quality metric before tuning: N50, BUSCO score, number of mapped reads, QQ lambda. Then optimise toward that metric — not toward a result that "looks right."

5. **Document every parameter change.** A run with a non-default parameter that is not documented is unreproducible.

**Example: Flye genome size parameter**

```bash
# Correct usage for a ~5 kb begomovirus genome:
flye --nano-raw viral_reads.fastq --genome-size 5k --out-dir assembly/ --threads 4

# What happens if you set genome-size 50m (50 Megabases, wrong by 10,000x)?
# Flye will attempt to allocate enormous memory for the read graph,
# likely fail, or produce a wildly incorrect assembly.
# This is not a hardware failure — it is an algorithm design mistake.
```

---

### 2.8 Case Study: RNA-Seq — Multiple Valid Pipelines

**Goal:** Identify differentially expressed genes between infected and uninfected cassava leaves.

**Pipeline A: STAR + featureCounts + DESeq2** (most common)
```
1. Quality trim reads (Trimmomatic)
2. Map to reference genome (STAR --outSAMtype BAM SortedByCoordinate)
3. Quantify gene-level counts (featureCounts -p -s 0)
4. Import to R, normalise, test (DESeq2)
5. Visualise (volcano plot, heatmap, MA plot)
```

**Pipeline B: Salmon + tximport + DESeq2** (faster, pseudoalignment)
```
1. Quality trim reads (Trimmomatic or fastp)
2. Quasi-map to reference transcriptome (salmon quant --validateMappings)
3. Import transcript-level counts to R (tximport, summarise to gene level)
4. Test (DESeq2)
5. Visualise
```

**Pipeline C: Trinity (de novo) + RSEM + edgeR** (when no reference genome available)
```
1. Quality trim reads
2. De novo transcriptome assembly (Trinity --seqType fq --max_memory 50G)
3. Quantify (RSEM or kallisto)
4. Test (edgeR)
5. Visualise
```

**Trade-off comparison:**

| Factor | Pipeline A | Pipeline B | Pipeline C |
|--------|-----------|-----------|-----------|
| Requires reference genome | Yes (genome + GTF) | Yes (transcriptome) | No |
| Speed | Moderate | Fast | Slow (assembly) |
| Accuracy | High | Slightly lower (no alignment) | Variable (depends on assembly) |
| RAM usage | High (STAR index ~30 GB) | Low (Salmon index ~2 GB) | Very high (Trinity) |
| Handles multi-mapping reads | Yes (featureCounts) | Yes (EM algorithm) | Yes (RSEM) |
| Best for | Model organism with genome | Fast exploratory analysis | Novel organism |

For cassava (Manihot esculenta, reference genome available): Pipeline A or B. Pipeline C is unnecessary. For a novel pathosystem without a reference genome: Pipeline C.

---

## Summary

> **Core insight on abstraction:** Every model, tool, and pipeline is an abstraction. Your job is not to find the perfect abstraction — it is to find one that discards the right details for your specific question, and to know what it throws away.

> **Core insight on algorithm design:** There is rarely one correct algorithm. There is usually a best-justified algorithm given your data, your constraints, and your question. The justification is as important as the choice.

| Skill | Practice activity |
|-------|------------------|
| Abstraction | For the next tool you run, write down three things it assumes and three things it ignores |
| Algorithm selection | Find two tools for the same task and complete a SACRED comparison table |
| Parameter tuning | Run the same tool with two different key parameters and compare the outputs using a defined quality metric |

---

## Looking Ahead

Lesson 5 brings all four principles together in integrated case studies — showing how computational thinking operates in a real, complete, and messy analysis — including the inevitable failures, unexpected results, and iterative corrections that define real bioinformatics work.
