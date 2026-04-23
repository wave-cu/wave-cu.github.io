---
title: "Lesson 2 — Core Principles and Bioinformatics"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Give a precise definition of each of the four computational thinking principles
- Apply each principle to at least three different bioinformatics contexts
- Explain why each principle is necessary and what goes wrong when it is skipped
- Recognise which principle is most relevant to a given problem

---

## Overview

Each of the four principles is introduced with:
1. A precise definition
2. The biological intuition behind it
3. Multiple worked examples from bioinformatics
4. A description of what goes wrong when the principle is ignored

The examples deliberately span multiple domains — viral genomics, population genetics, transcriptomics, and metagenomics — to emphasise that these principles are domain-agnostic.

---

## Principle 1: Decomposition

### Definition

Decomposition is the process of breaking a large, complex problem into smaller sub-problems that are individually tractable, and then systematically solving each sub-problem as part of the whole.

### The Biological Intuition

Organisms are built from modules: cells contain organelles, genomes contain genes, genes contain exons, exons encode protein domains. Biological systems are inherently hierarchical. Bioinformatics problems reflect this structure — and decomposition lets us exploit it.

### Why It Is Necessary

Without decomposition, a problem like "assemble and annotate a novel pathogen genome" is paralysing. With decomposition, it becomes a sequence of tractable steps. Each step can be validated independently, failed steps can be isolated and fixed, and different team members (or different tools) can work on different parts simultaneously.

### Bioinformatics Examples

**Example 1: De Novo Viral Genome Assembly**

The goal is to produce an annotated viral genome from raw long-reads. Decomposed:

```
Level 1: Produce a high-quality annotated viral genome
  ├── Level 2a: Obtain clean, viral-enriched reads
  │     ├── Level 3a: Assess raw read quality (FastQC/NanoStat)
  │     ├── Level 3b: Trim low-quality bases and adapters
  │     └── Level 3c: Filter host-derived reads (Minimap2 → exclude mapped reads)
  ├── Level 2b: Assemble viral contigs
  │     ├── Level 3a: Choose assembler (Flye for long reads, SPAdes for short reads)
  │     ├── Level 3b: Run assembly
  │     └── Level 3c: Evaluate assembly (N50, coverage, QUAST)
  ├── Level 2c: Identify viral contigs
  │     ├── Level 3a: BLAST against viral databases
  │     └── Level 3b: Filter non-viral hits
  └── Level 2d: Annotate the genome
        ├── Level 3a: Predict open reading frames (Prokka / custom BLAST)
        └── Level 3b: Assign functional categories
```

Each box is independently testable. If assembly quality is poor (Level 2b), you can investigate without touching annotation (Level 2d).

**Example 2: GWAS (Genome-Wide Association Study)**

The goal is to identify genetic variants associated with a disease phenotype. Decomposed:

```
Level 1: Identify variants associated with disease
  ├── Level 2a: Prepare genotype data
  │     ├── Level 3a: Quality-filter SNP calls (missingness, MAF, HWE)
  │     ├── Level 3b: Prune for linkage disequilibrium
  │     └── Level 3c: Exclude population outliers (PCA)
  ├── Level 2b: Prepare phenotype data
  │     ├── Level 3a: Define case/control status clearly
  │     └── Level 3b: Collect and harmonise covariates (age, sex, ancestry)
  ├── Level 2c: Run association tests
  │     └── Level 3a: Linear or logistic regression per variant
  ├── Level 2d: Correct for multiple testing
  │     └── Level 3a: Apply Bonferroni or FDR threshold
  └── Level 2e: Interpret results
        ├── Level 3a: Annotate significant SNPs (dbSNP, Ensembl)
        └── Level 3b: Examine LD structure and candidate genes
```

**Example 3: RNA-Seq Differential Expression**

```
Level 1: Identify differentially expressed genes between conditions
  ├── Level 2a: Quality-check and preprocess reads
  ├── Level 2b: Map reads to reference genome (STAR, HISAT2)
  ├── Level 2c: Quantify gene-level expression (featureCounts, HTSeq)
  ├── Level 2d: Normalise counts (TMM, DESeq2 size factors)
  ├── Level 2e: Statistical testing (DESeq2, edgeR)
  └── Level 2f: Biological interpretation (GO enrichment, pathway analysis)
```

### What Goes Wrong Without Decomposition

- You attempt the whole problem at once and become overwhelmed.
- Errors at one stage contaminate all later stages without your knowledge.
- You cannot tell which step failed when results look wrong.
- You cannot estimate how long the analysis will take.
- You cannot parallelise work across people or compute nodes.

> **Rule of thumb:** If you cannot explain your analysis in under five steps at a high level, you have not decomposed it enough.

---

## Principle 2: Pattern Recognition

### Definition

Pattern recognition is the process of identifying similarities, shared structures, and recurring themes across different problems, datasets, or contexts — and using those patterns to apply known solutions to unfamiliar situations.

### The Biological Intuition

Biology is pattern-rich. Protein families share sequence motifs. Virus families share structural features. QC failure modes look similar across platforms. Recognising these patterns is how biologists build intuition over time — and computational thinking formalises that intuition.

### Why It Is Necessary

Without pattern recognition, every problem feels new. With it, you build on what you know. The skill is not just recognising that two things look similar — it is knowing *which* similarity is relevant and *which* differences matter.

### Bioinformatics Examples

**Example 1: Recognising the "Host Contamination" Pattern**

Any time you sequence a pathogen from a clinical or environmental sample without prior host depletion, you will have host contamination. This is true whether you are sequencing:
- A begomovirus from a cassava leaf (Module 5)
- SARS-CoV-2 from a nasopharyngeal swab
- A gut bacteriophage from a stool metagenome

The pattern is the same. The solution is the same: map to host genome, extract unmapped reads, proceed with pathogen analysis. The only difference is which host genome you use.

**Example 2: Recognising Quality Degradation Signatures**

FastQC reports for Illumina data show a characteristic pattern: high quality at the 5' end of reads, declining quality toward the 3' end. This is a known artefact of synthesis chemistry. Once you recognise this pattern, you immediately know: (1) trimming from the 3' end is appropriate; (2) the decline is expected, not a sign of a failed run; (3) very long reads will be more affected.

The same tool run on RNA-Seq data from a different lab, a different organism, and a different date will show the same pattern — because the cause is the chemistry, not the biology.

**Example 3: Recognising the Alignment Problem Across Domains**

Each of these is structurally an alignment problem:
- Mapping short reads to a reference genome (BWA-MEM)
- Comparing a novel sequence to a database (BLAST)
- Aligning multiple homologous sequences (MUSCLE, MAFFT)
- Correcting assembly errors using polishing reads (Medaka, Racon)

The underlying mathematical structure — finding the best match between two sequences given a scoring scheme — is the same. The differences (speed requirements, error models, input size) determine which algorithm to use. But recognising the shared structure lets you transfer intuition from one domain to another.

**Example 4: Recognising Batch Effects**

In RNA-Seq, GWAS, and metagenomics, you will encounter batch effects: systematic differences between samples that are caused by when or how they were processed, not by the biology. The pattern of detection is always similar: samples cluster by processing batch rather than biological condition in a PCA or heatmap. The correction strategies (ComBat, surrogate variable analysis) are shared across domains.

**Example 5: The "Normalisation Before Comparison" Pattern**

Before comparing:
- Read counts across RNA-Seq samples → normalise by library size (RPKM, TPM, TMM)
- Coverage across assembly samples → normalise by genome size
- Variant frequencies across GWAS cohorts → control for population stratification

The pattern: raw numbers are often incomparable across samples without normalisation. Recognise it early; it applies everywhere.

### What Goes Wrong Without Pattern Recognition

- You solve every problem from scratch, wasting time on already-solved sub-problems.
- You apply tools from familiar domains that are inappropriate in the new context (e.g., using a short-read assembler on long-read data without recognising the difference in error profile).
- You miss red flags that are obvious once you know the pattern (e.g., a FastQC "per-tile sequence quality" failure that indicates a flow cell bubble on the Illumina platform).

> **Rule of thumb:** Before designing a solution, ask: "Have I seen this type of problem before? Have others?" The answer is almost always yes.

---

## Principle 3: Abstraction

### Definition

Abstraction is the process of identifying the features of a problem that are essential for solving it — and deliberately ignoring features that, while real, are not relevant to the current step of the analysis.

### The Biological Intuition

A genome is impossibly complex. To study gene expression, you abstract away chromatin structure, DNA methylation (usually), and three-dimensional conformation — and focus only on transcript abundance. To study population structure, you abstract away the phenotype entirely and focus only on allele frequencies. Abstraction is how science makes progress: by choosing the right level of description for the question at hand.

### Why It Is Necessary

Abstraction prevents analysis paralysis. Real datasets contain enormous amounts of information. Without abstraction, you would never decide what to measure, what to report, or what to ignore. Every tool you use implements abstraction — it is built into the design. But *you* must apply abstraction at the level of problem selection, pipeline design, and interpretation.

### Bioinformatics Examples

**Example 1: Genome Assembly — What Do You Need?**

When assembling a viral genome, the biologically relevant abstraction is: the genome is a sequence of nucleotides with a specific organisation. You do not need to model:
- The three-dimensional structure of the virion
- The exact kinetics of DNA replication
- The host immune response

You do need to model:
- Read length distribution and error profile (affects assembler choice)
- Expected genome size and ploidy (affects coverage requirements)
- Repeat structure (affects contig continuity)

**Example 2: Coverage — Abstraction of Sequencing Data**

Coverage (depth) is an abstraction. The raw data is millions of individual reads, each with positional information, quality scores, and sequence. Coverage collapses all of that into a single number per position: how many times was this position sequenced?

This abstraction is powerful enough to answer important questions (is there enough data? are there assembly gaps?) while discarding enormous amounts of detail that is irrelevant for that question.

**Example 3: GWAS — Abstracting Individual Genomes to Allele Frequencies**

A GWAS does not care about the full sequence of each individual's genome. It abstracts each person's genome to a vector of genotypes at pre-specified positions (SNPs). Then it abstracts further, treating each SNP as a single variable in a regression model. The enormous complexity of human genetic variation is reduced to a number — a p-value — for each tested position.

This abstraction makes the analysis computationally tractable. But it also has costs: it cannot detect structural variants, it misses rare variants below minor allele frequency thresholds, and it cannot capture haplotype-level effects at loci with multiple causative variants. Knowing what your abstraction *discards* is as important as knowing what it *retains*.

**Example 4: Sequence Alignment — Ignoring Order of Magnitude Differences**

BLAST uses a "word match" heuristic: rather than aligning your query to every sequence in the database, it first finds short k-mer matches (words of length 11 for nucleotide BLAST), then extends only those matches. This is an abstraction — most of the database is not considered. The heuristic is wrong in a small fraction of cases (very divergent homologs), but for the vast majority of queries it is fast and accurate.

This trade-off — speed gained by abstracting away exhaustive alignment — is why BLAST is usable on a laptop. An exact dynamic programming approach (Smith-Waterman against a full database) would take days.

### What Goes Wrong Without Abstraction

- You include irrelevant variables in your analysis, introducing noise.
- You over-engineer solutions for details that do not affect the biological conclusion.
- You get lost in raw data complexity and cannot make decisions.
- You report outputs at the wrong level of detail for the scientific question (e.g., reporting per-base coverage when the question is about gene presence/absence).

> **Critical insight:** Every abstraction discards information. The question is not whether your abstraction is perfect — it is whether it discards *the right* information for *your* specific question. Always know what your abstraction throws away.

---

## Principle 4: Algorithm Design

### Definition

Algorithm design is the process of creating a clear, unambiguous, step-by-step procedure that transforms input data into output results, while making explicit choices about trade-offs in speed, accuracy, memory, and robustness.

### The Biological Intuition

A bioinformatics pipeline is an algorithm. Each tool you run is an algorithm. But algorithm design as a thinking skill is about *choosing* and *ordering* those steps — deciding which procedure to use, in what sequence, with what parameters, and for what reason.

### Why It Is Necessary

Many biological problems can be solved by multiple different algorithms. Choosing the wrong one — or choosing the right one with wrong parameters — can give you valid-looking but incorrect results. Algorithm design forces you to make your choices explicit and justified, which is essential for reproducibility and debugging.

### Bioinformatics Examples

**Example 1: Two Algorithms for the Same Assembly Problem**

You want to assemble a 5 kb viral genome from long Oxford Nanopore reads.

*Algorithm A: Overlap-Layout-Consensus (OLC)*
```
1. Find all pairwise overlaps between reads (MHAP, minimap2)
2. Build an overlap graph
3. Find an Eulerian or Hamiltonian path through the graph
4. Generate consensus sequence (Racon, Medaka)
```

*Algorithm B: Repeat Graph (Flye)*
```
1. Find approximate repeat structure from reads
2. Build a repeat graph (edges = unique sequences, nodes = repeats)
3. Traverse graph to produce contigs
4. Polish with raw reads
```

Both produce a genome assembly. Algorithm B (Flye) handles repetitive sequences better because it explicitly models repeats in the graph, rather than treating them as conflicts in an overlap graph. For a viral genome with tandem repeat elements, Algorithm B is usually preferable. But you need to know *why* to make that decision.

**Example 2: Short-Read Mapping Algorithms**

You want to map Illumina reads to a reference genome for variant calling.

| Algorithm | Tool | Speed | Accuracy | Good for |
|-----------|------|-------|----------|---------|
| Burrows-Wheeler Aligner | BWA-MEM | Fast | High | Standard DNA-Seq |
| Hash-based seeding | Bowtie2 | Very fast | Slightly lower | RNA-Seq pre-alignment |
| Seed-and-extend with splice-awareness | STAR | Moderate | High for RNA | RNA-Seq (handles introns) |

If you use BWA-MEM for RNA-Seq reads, many reads that span exon-exon junctions will fail to map, because BWA-MEM does not know that a 200 bp gap in the alignment might be an intron. Recognising this failure mode requires understanding the algorithm.

**Example 3: Variant Calling — GATK HaplotypeCaller Algorithm**

GATK HaplotypeCaller does not simply look for positions where the aligned bases differ from the reference. Its algorithm:

```
For each active region (locally variable region):
  1. Locally reassemble reads into possible haplotypes (using De Bruijn graphs)
  2. Re-align raw reads to each candidate haplotype
  3. Calculate likelihood of each haplotype under observed reads
  4. Genotype: choose most likely diploid genotype
  5. Report as VCF record with quality scores
```

This is more complex than pileup-based callers (samtools mpileup), but it handles complex variant sites — insertions, deletions, multinucleotide polymorphisms — much better. Understanding this lets you know that HaplotypeCaller is usually preferable for germline variant calling, while simpler pileup methods may be sufficient for somatic variant detection at high coverage.

**Example 4: Differential Expression — Why the Algorithm Matters**

RNA-Seq count data is not normally distributed. It follows a negative binomial distribution (overdispersed Poisson). An algorithm that assumes normal distribution (e.g., a simple t-test) will produce incorrect p-values — typically too many false positives at low counts. DESeq2 and edgeR were designed specifically for negative binomial count data. Using the wrong statistical algorithm here is not a minor error; it can change your entire list of differentially expressed genes.

### What Goes Wrong Without Deliberate Algorithm Design

- You use a tool without understanding its assumptions, violating them silently.
- You apply an algorithm to data it was not designed for.
- You cannot explain your choices to a reviewer or collaborator.
- You cannot tune parameters because you do not understand what they control.
- Results are irreproducible because choices were not documented.

> **Key principle:** Every algorithm is a set of assumptions. Before using any tool, ask: "What does this assume about my data? Does my data satisfy those assumptions?"

---

## Summary: The Four Principles in One Table

| Principle | Core question | Common mistake when skipped |
|-----------|--------------|----------------------------|
| **Decomposition** | "What are the parts of this problem?" | Trying to solve everything at once; unable to locate errors |
| **Pattern recognition** | "Have I seen this before?" | Reinventing solutions; missing known failure modes |
| **Abstraction** | "What can I safely ignore?" | Including irrelevant detail; getting lost in noise |
| **Algorithm design** | "What procedure will solve this, and why?" | Using tools without understanding their assumptions |

---

## Connecting to Your Prior Work

Every analysis you ran in Modules 1–5 implicitly used these principles:

| What you did | Which principle |
|-------------|-----------------|
| Counted reads before estimating coverage | Decomposition |
| Recognised that low Q30 tail in FastQC means trimming is needed | Pattern recognition |
| Used coverage as a single number rather than per-read quality | Abstraction |
| Chose Flye over SPAdes for long-read assembly | Algorithm design |
| Ran FastQC before and after trimming to compare | Decomposition + algorithm design |
| Recognised that barcode57 and barcode58 had the same host contamination problem | Pattern recognition |

You were already thinking computationally. This lesson gave you the vocabulary to describe what you were doing.

---

## Looking Ahead

Lesson 3 zooms in on decomposition and pattern recognition, working through two extended case studies — viral assembly and GWAS — to build practical skill in applying these principles to problems you have not solved before. Lesson 4 does the same for abstraction and algorithm design.
