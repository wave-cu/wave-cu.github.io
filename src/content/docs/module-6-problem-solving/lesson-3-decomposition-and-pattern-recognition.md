---
title: "Lesson 3 — Decomposition and Pattern Recognition in Action"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Systematically decompose an unfamiliar bioinformatics problem using a structured approach
- Apply the "five questions" framework to any new problem before starting an analysis
- Recognise at least six recurring patterns in NGS data and their standard responses
- Use a decision tree to select an appropriate solution strategy
- Identify common decomposition mistakes and how to avoid them
- Describe how decomposition and pattern recognition were applied in the Module 5 project

---

## Part 1: Decomposition in Depth

### 1.1 Why Decomposition Is Hard

Decomposition sounds simple. Break the problem apart. But in practice, it is the skill that most distinguishes experienced bioinformaticians from beginners. Two common failure modes:

**Failure mode 1: Decomposing too shallowly.**
"My problem is: assemble and annotate the genome." This is not decomposed — it is just restated. A useful decomposition reaches the level where each sub-problem has a clear input, a clear output, and a tool or method that can solve it.

**Failure mode 2: Decomposing incorrectly.**
Sometimes the pieces you identify do not actually combine to solve the original problem. This happens when you decompose based on *familiar steps* rather than *logical structure*. For example, decomposing "identify differentially expressed genes" into "run FastQC, trim reads, map reads, call variants" — the last step (variant calling) does not contribute to differential expression analysis. You have recognised familiar tools without thinking about whether they solve your specific problem.

---

### 1.2 A Systematic Framework: Five Questions Before You Start

Before decomposing any bioinformatics problem, answer these five questions:

**Q1: What is the final biological output?**
What form does the answer take? A list of genes? A phylogenetic tree? A VCF file? A heatmap? Clarity about the endpoint prevents the analysis from drifting.

**Q2: What data do I have at the start?**
What format? What quality? What technology (Illumina/Nanopore/PacBio)? Single-end or paired-end? How many samples? This determines which tools are available and which assumptions are valid.

**Q3: What is the logical gap between Q1 and Q2?**
The gap defines the problem. Each step that bridges the gap is a sub-problem. Map the gap as explicitly as you can.

**Q4: What are the known failure modes at each step?**
Contamination, low coverage, poor assembly, incorrect annotation, batch effects. Identifying these *before* you start tells you where to build validation checkpoints.

**Q5: What defines "good enough" at each step?**
Q30 for read quality? N50 > genome size? BUSCO completeness > 90%? Without quality thresholds, you cannot decide when to proceed and when to investigate.

---

### 1.3 Case Study: Decomposing a Viral Assembly Problem

**Scenario:** You have received a FASTQ file from a field sample. The researcher believes it contains a novel plant virus. Your task: characterise the virus.

**Applying the five questions:**

| Question | Answer |
|----------|--------|
| Q1 (output) | Annotated viral genome sequence, placed in a phylogenetic tree |
| Q2 (data) | Nanopore long reads, mixed sample (plant + potential virus), unknown coverage |
| Q3 (gap) | Raw mixed reads → clean viral reads → assembled viral genome → annotated genome → tree |
| Q4 (failure modes) | Host contamination dominates; virus may be low abundance; assembly may fragment; BLAST may find no close relatives |
| Q5 (thresholds) | Coverage ≥ 30×; assembly completeness assessed by genome fraction covered; BLAST identity ≥ 70% for genus-level assignment |

**Decomposition tree:**

```
Characterise the novel virus
│
├── 1. Data quality assessment
│     ├── 1a. NanoStat on raw reads (read count, N50, mean quality)
│     └── 1b. Flag if mean quality < Q10 (Nanopore baseline)
│
├── 2. Host read removal
│     ├── 2a. Download or locate host reference genome (e.g., Manihot esculenta)
│     ├── 2b. Map reads to host (minimap2 -ax map-ont)
│     ├── 2c. Extract unmapped reads (samtools view -f 4)
│     └── 2d. Verify enrichment: what % of reads were host?
│
├── 3. Coverage check
│     ├── 3a. Estimate genome size (assume ~5 kb for begomovirus)
│     ├── 3b. Calculate: (read_count × avg_length) / genome_size
│     └── 3c. Decision: if coverage < 30×, consider combining samples
│
├── 4. Assembly
│     ├── 4a. Run Flye (--nano-raw, --genome-size 5k)
│     ├── 4b. Evaluate assembly: QUAST (N50, total length, contig count)
│     └── 4c. Polish if needed (Medaka or Racon)
│
├── 5. Viral contig identification
│     ├── 5a. BLAST all contigs against NCBI viral database
│     ├── 5b. Retain contigs with viral hits (e-value < 1e-5)
│     └── 5c. Flag unexpected hits (plant, bacteria) for removal
│
├── 6. Genome annotation
│     ├── 6a. Predict ORFs (Prokka or custom BLAST against known viral proteins)
│     └── 6b. Assign gene names and functional categories
│
└── 7. Phylogenetic analysis
      ├── 7a. Download reference sequences from NCBI (same genus/family)
      ├── 7b. Multiple sequence alignment (MAFFT)
      ├── 7c. Trim alignment (trimAl)
      ├── 7d. Infer tree (IQ-TREE or FastTree)
      └── 7e. Visualise and annotate (FigTree, iTOL)
```

Each leaf node of this tree has: a clear input, a clear tool, and a clear output. That is a correctly decomposed problem.

---

### 1.4 Case Study: Decomposing a GWAS

**Scenario:** A research group has genotyped 3,000 individuals (1,500 cases with chronic kidney disease, 1,500 controls) using a 500,000-SNP array. They want to identify genetic variants associated with disease risk.

**Five questions:**

| Question | Answer |
|----------|--------|
| Q1 (output) | A ranked list of SNPs with association statistics and annotated candidate genes |
| Q2 (data) | Raw genotype array data (PLINK format), plus phenotype file (case/control), and covariate file (age, sex, ancestry PCs) |
| Q3 (gap) | Raw genotypes → QC-filtered genotypes → association analysis → multiple testing correction → annotation → biological interpretation |
| Q4 (failure modes) | Related individuals inflate statistics; population stratification creates false positives; poorly QC-filtered SNPs generate artefactual associations |
| Q5 (thresholds) | Genome-wide significance p < 5×10⁻⁸; SNP call rate ≥ 95%; sample call rate ≥ 95%; HWE p > 1×10⁻⁶ in controls |

**Decomposition:**

```
GWAS: Identify CKD risk variants
│
├── 1. Genotype QC (per-SNP and per-sample)
│     ├── 1a. Remove SNPs with call rate < 95%
│     ├── 1b. Remove samples with call rate < 95%
│     ├── 1c. Remove SNPs with MAF < 1%
│     ├── 1d. Remove SNPs failing HWE in controls (p < 1e-6)
│     └── 1e. Check sex concordance (reported vs. inferred)
│
├── 2. Population stratification control
│     ├── 2a. LD-prune SNPs (window = 50 SNPs, step = 5, r² < 0.2)
│     ├── 2b. Merge with HapMap/1000G reference panel
│     ├── 2c. Run PCA (PLINK --pca)
│     └── 2d. Exclude population outliers (> 6 SD from mean on PC1-PC2)
│
├── 3. Relatedness check
│     ├── 3a. Calculate identity-by-descent (IBD) coefficients
│     └── 3b. Remove one individual from each related pair (PI_HAT > 0.2)
│
├── 4. Association testing
│     ├── 4a. Logistic regression (binary phenotype: case/control)
│     ├── 4b. Include covariates: age, sex, top 10 PCs
│     └── 4c. Generate summary statistics (beta, SE, p-value per SNP)
│
├── 5. Visualisation and quality checks
│     ├── 5a. Manhattan plot (p-values across genome)
│     ├── 5b. QQ plot (observed vs. expected p-values)
│     └── 5c. Calculate genomic inflation factor lambda (should be ~1.0)
│
├── 6. Identify significant loci
│     ├── 6a. Apply genome-wide significance threshold (p < 5e-8)
│     ├── 6b. LD-clump to identify independent signals
│     └── 6c. Regional association plots for each locus
│
└── 7. Functional annotation
      ├── 7a. Annotate lead SNPs (dbSNP, Ensembl)
      ├── 7b. Check if SNPs fall in coding regions, promoters, eQTLs
      └── 7c. Gene ontology and pathway enrichment for candidate genes
```

---

### 1.5 Common Decomposition Mistakes

| Mistake | What it looks like | How to fix it |
|---------|-------------------|---------------|
| **Circular decomposition** | "Step 1: analyse. Step 2: get results from analysis." | Each sub-step must reduce the gap between input and output |
| **Tool-first decomposition** | "Step 1: run FastQC. Step 2: run Trimmomatic. Step 3: run..." | Start with logic, not tools. Add tools once the logic is clear |
| **Missing validation steps** | No checkpoints between major steps | Add QC steps between each major phase |
| **Insufficient depth** | Stopping at 2–3 high-level steps | Continue until each leaf has a clear tool and input/output |
| **Ignoring failure modes** | Not considering what to do if assembly fails | For each step, ask: "What do I do if this gives bad output?" |
| **Coupling independent sub-problems** | Assuming Step 3 must come from Step 2's exact output | Keep sub-problems modular so they can be revised independently |

---

## Part 2: Pattern Recognition in Action

### 2.1 How to Build a Pattern Recognition Vocabulary

Pattern recognition is a learned skill. Each time you encounter a problem, file it mentally (or literally) under:
- "What type of problem is this?" (alignment, assembly, clustering, regression, annotation)
- "What did the data look like?" (low coverage, adapter contamination, batch effect, host contamination)
- "What worked, and why?"
- "What failed, and why?"

Over time, you build a library of patterns. The goal of this section is to give you a head start on that library.

---

### 2.2 Pattern Catalogue for NGS Data

**Pattern 1: The Low-Quality Tail**

*Presentation:* FastQC per-base quality plot shows high Q30+ quality for the first 50–80% of read length, then a rapid decline to Q20 or below at the 3' end.

*Cause:* Illumina synthesis chemistry — polymerase fidelity decreases over longer synthesis runs. Signal dephasing and phasing errors accumulate.

*Standard response:* Trim 3' ends using Trimmomatic (TRAILING:20) or Cutadapt. Do not trim uniformly from both ends — 5' end quality is usually fine.

*Pattern recognition flag:* "Declining 3' quality = chemistry artefact, not biology."

---

**Pattern 2: Adapter Contamination**

*Presentation:* FastQC adapter content plot shows rising lines; overrepresented sequences contain known adapter sequences (e.g., AGATCGGAAGAGC for Illumina TruSeq).

*Cause:* Insert size shorter than read length causes the sequencer to read into the adapter.

*Standard response:* Adapter trimming with Trimmomatic (ILLUMINACLIP) or Cutadapt. Verify with post-trim FastQC.

*Recognition flag:* "Any rising line in adapter content = trimming required."

---

**Pattern 3: GC Content Bimodality**

*Presentation:* FastQC per-sequence GC content shows two peaks instead of the expected bell curve — e.g., one peak at ~35% (host) and one at ~55% (pathogen).

*Cause:* Mixed sample with organisms of different GC composition.

*Standard response:* This is actually diagnostic — it tells you the sample is mixed and the contaminating organism has a different GC content from the target. Proceed with host filtering; the bimodality will resolve.

*Recognition flag:* "Two GC peaks = mixed sample. Identify and separate by GC, mapping, or depth."

---

**Pattern 4: Low Assembly Contiguity Despite High Coverage**

*Presentation:* Assembly produces hundreds of short contigs even though estimated coverage is 100×+. N50 is much smaller than expected genome size.

*Cause:* Usually one of three things: (1) repeat-rich regions that the assembler cannot resolve; (2) contamination creating ambiguous overlaps; (3) wrong assembler for the data type (e.g., short-read assembler used for long reads, or long-read assembler used for short reads).

*Standard response:* Check contig length distribution. BLAST short contigs to check for contamination. If repeat-driven, switch to long-read assembly or use a repeat-aware assembler. If contamination-driven, filter before assembly.

*Recognition flag:* "High coverage + low N50 = repeat or contamination problem, not a data quantity problem."

---

**Pattern 5: Genomic Inflation in GWAS**

*Presentation:* QQ plot shows observed p-values consistently above the diagonal across all tested SNPs (genomic inflation factor λ > 1.05).

*Cause:* Cryptic population stratification (samples from different ancestry groups mixed without correction), relatedness among samples, or systematic genotyping bias.

*Standard response:* Include principal components as covariates in the regression model. Remove related individuals. Check for batch effects in genotyping. If λ remains elevated, apply genomic control correction.

*Recognition flag:* "QQ inflation = stratification or relatedness — not a sign of true widespread association."

---

**Pattern 6: Uneven Coverage Across Assembly**

*Presentation:* When mapping reads back to the assembly, some regions have 0× or near-0× coverage while others have 500×+. QUAST reports large numbers of misassembled regions.

*Cause:* The assembler collapsed repeats (two distinct genomic regions mapped to one contig), or structural variants created coverage anomalies.

*Standard response:* Inspect low-coverage regions — are they at contig ends? Are they in repetitive regions by BLAST? Flag potential misassemblies. If using long reads, re-polish with a tool that can detect and correct misassemblies (e.g., Medaka with a coverage filter).

*Recognition flag:* "Extreme coverage heterogeneity = assembly artefact, not data problem."

---

**Pattern 7: Zero Differentially Expressed Genes**

*Presentation:* DESeq2 or edgeR returns no significant results despite a clear visual difference between groups in the heatmap.

*Cause:* Usually low biological replication (n=2 per group), high within-group variability, or incorrect contrast specification in the model.

*Standard response:* Check the design formula. Visualise sample-level PCA — do the groups actually separate? Check dispersion estimates — are they unreasonably high? With n=2, statistical power is near zero.

*Recognition flag:* "Zero DE genes with visual group separation = underpowered design or model error, not absence of biology."

---

### 2.3 Decision Trees for Choosing Solution Strategies

Decision trees translate pattern recognition into action. When you recognise a pattern, a decision tree tells you which branch to follow.

**Decision Tree 1: Choosing an Assembly Strategy**

```
What type of data do I have?
│
├── Short reads only (Illumina, 100–300 bp)
│     ├── Do I have a reference genome?
│     │     ├── YES → Reference-based assembly (BWA-MEM + samtools + bcftools)
│     │     └── NO  → De novo (SPAdes for small genomes; Velvet for very small)
│     └── What is my genome size?
│           ├── < 10 Mb → SPAdes works well
│           └── > 100 Mb → Consider MaSuRCA (hybrid) or Platanus
│
├── Long reads only (Nanopore / PacBio)
│     ├── Nanopore → Flye (--nano-raw or --nano-hq depending on chemistry)
│     ├── PacBio CLR → Canu or FALCON
│     ├── PacBio HiFi (CCS) → hifiasm (very high accuracy, preferred)
│     └── Do I need polishing?
│           ├── Nanopore reads → Medaka (neural network polisher) or Racon
│           └── HiFi → usually self-correcting; polishing optional
│
└── Hybrid (short + long reads)
      └── MaSuRCA, Unicycler (for bacterial/viral), or long-read assembly + Pilon polishing
```

**Decision Tree 2: Diagnosing a Failed Assembly**

```
Assembly failed or produced poor results. What happened?
│
├── Zero contigs assembled
│     └── Check: did reads actually pass to assembler? (file size, format check)
│
├── Hundreds of very short contigs (< 500 bp)
│     ├── Check coverage: is it sufficient (≥ 30×)?
│     │     ├── NO  → Sequence more, or combine samples
│     │     └── YES → Likely repeat or contamination problem
│     └── Check GC content (FastQC): bimodal?
│           ├── YES → Mixed sample — filter host reads first
│           └── NO  → Try repeat-aware assembler or different k-mer settings
│
├── Assembly much larger than expected genome size
│     └── Contamination incorporated into assembly — BLAST contigs, filter non-target hits
│
└── Assembly correct size but poor N50
      ├── Are reads long enough to span repeats?
      │     ├── NO  → Switch to long-read technology or accept fragmented assembly
      │     └── YES → Investigate repeat complexity; try graph-based assembly
      └── Is coverage highly uneven? → Possible library preparation bias
```

---

### 2.4 Pattern Recognition Across Domains: A Summary Table

| Domain | Common pattern | What it signals | Standard response |
|--------|---------------|----------------|------------------|
| QC (all technologies) | Declining 3' quality | Chemistry artefact | Trim 3' ends |
| QC (Illumina) | Adapter content rising | Short insert library | Trim adapters |
| QC (all) | Bimodal GC curve | Mixed sample | Host filtering or source check |
| Assembly | High coverage, low N50 | Repeats or contamination | Filter, switch assembler |
| Assembly | Contigs >> expected size | Contamination assembled | BLAST and filter |
| Mapping | Low mapping rate (< 60%) | Wrong reference, wrong species, or heavy contamination | Check reference, filter reads |
| GWAS | λ > 1.1 | Stratification or relatedness | Add PCs, remove relatedness |
| GWAS | No hits at genome-wide threshold | Underpowered or wrong phenotype definition | Check sample size, phenotype |
| RNA-Seq | Zero DE genes | Underpowered or model error | Check design, check replication |
| RNA-Seq | Thousands of DE genes | Batch effect or normalisation failure | Check PCA, recheck normalisation |

---

## 2.5 Connecting to Module 5: What Patterns Did You Already Recognise?

In the Module 5 begomovirus project, many students implicitly applied pattern recognition:

- Recognising that host reads would dominate the raw FASTQ (pattern: mixed sample from field collection)
- Recognising that Flye was the appropriate assembler for Nanopore data (pattern: long-read assembly tool selection)
- Recognising that BLAST hits to plastid sequences were host contamination, not viral (pattern: unexpected BLAST taxonomy = contamination)
- Recognising that a single contig covering the full begomovirus DNA-A segment was a sign of a good assembly (pattern: expected genome completeness for a known genome size)

Each of these was pattern recognition. You had enough background from Modules 1–4 to recognise the pattern and act on it — even if you did not have a name for what you were doing.

---

## Summary

| Skill | What to practice |
|-------|-----------------|
| Decomposition | For every new problem, draw a tree before you open a terminal |
| Five questions | Always answer Q1–Q5 before designing an analysis |
| Pattern catalogue | Keep a personal log of patterns you encounter |
| Decision trees | Build your own trees as you gain experience — they are the crystallised form of pattern recognition |

> **Key takeaway:** Decomposition and pattern recognition are what turn a complex, overwhelming problem into a series of familiar, tractable steps. You build pattern recognition by solving many problems. You apply decomposition every time you start a new one.

---

## Looking Ahead

Lesson 4 examines abstraction and algorithm design in depth — with particular attention to the hardest practical questions: what details can you safely ignore, and how do you choose between multiple valid approaches to the same problem?
