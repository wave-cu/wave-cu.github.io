---
title: "Lesson 5 — Computational Thinking in Action"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Apply all four principles simultaneously to solve a complex, multi-step bioinformatics problem
- Describe how a real analysis differs from an idealised one and why that is normal
- Recognise common failure points and describe strategies for recovering from them
- Explain the role of iterative debugging in bioinformatics
- Evaluate your own analysis for completeness, reproducibility, and scientific rigour
- Connect computational thinking to lifelong problem-solving in research

---

## 1. The Messy Reality of Bioinformatics

The lessons so far have presented computational thinking as a set of clean, logical principles applied to well-defined problems. The reality of bioinformatics is different:

- Reads arrive in unexpected formats
- Tools crash with cryptic error messages
- Reference databases are incomplete or out of date
- Results look biologically implausible
- Published protocols do not quite match your data
- The "simple" project turns out to have three sub-problems you did not anticipate

This is not a sign that you are failing. This is what bioinformatics looks like from the inside. Computational thinking is precisely the tool that lets you navigate this uncertainty without panicking.

> **Key principle:** The difference between a beginning bioinformatician and an experienced one is not that the experienced one never encounters problems. It is that the experienced one has a framework for diagnosing and resolving them systematically.

---

## 2. Integrated Case Study 1: Viral Assembly Pipeline (Full Walkthrough)

**Scenario:** You receive an email on a Monday morning. A collaborator has sequenced a cassava sample using Oxford Nanopore Technology. They believe the plant is infected with a begomovirus, but the species is unclear. The raw FASTQ file is 2.1 GB. They want an annotated genome and a phylogenetic tree by Friday.

This is the Module 5 project, but now we walk through it *as a thinking exercise*, annotating every decision with the computational thinking principle it represents.

---

### Step 1: Before Opening the Terminal

**Decomposition:** What is the full problem structure?

```
Monday goal: characterise the begomovirus
├── 1. Data quality assessment
├── 2. Host read removal
├── 3. Coverage estimation → decision to proceed or request more data
├── 4. De novo assembly
├── 5. Assembly quality evaluation
├── 6. Viral contig identification (BLAST)
├── 7. Annotation
└── 8. Phylogenetic analysis
```

**Abstraction:** What do I need to know right now, and what can I defer?

- I need to know the data format and rough quality before anything else → Step 1 is non-negotiable.
- I do not need to know the final phylogenetic method before starting — I can decide that in Step 8.

**Pattern recognition:** What do I know from experience?

- Nanopore data from plant field samples always has host reads. Plan for significant host filtering.
- Begomoviruses have a ~2.7 kb bipartite genome. That means I need far fewer reads than for a large eukaryotic genome.
- Flye is the current best-practice assembler for Nanopore viral data.

---

### Step 2: Data Quality Assessment

```bash
conda activate bioinfo

# Get summary statistics on raw reads
NanoStat --fastq Training/long_reads/barcode57.fastq --outdir qc_results/ --name barcode57

# Quick sanity check
wc -l Training/long_reads/barcode57.fastq  # Expect divisible by 4
```

**Expected output from NanoStat:**
```
General summary:
Mean read length:           2,914.3
Mean read quality:              9.4
Median read length:         1,892.0
Median read quality:            9.3
Number of reads:            8,567
Read length N50:            4,821
Total bases:           24,952,281
```

**Computational thinking in action:**

- **Pattern recognition:** Mean quality ~9.4 is typical for older Nanopore chemistry (R9 with Guppy basecalling). Not great, but workable. If you saw mean quality of 6.0, that would be a red flag for basecalling failure.
- **Abstraction:** The N50 of 4,821 bp is longer than the entire begomovirus genome (2.7 kb). This is excellent — individual reads may span the full genome multiple times. This is the key abstraction: you do not need to read every quality score; you need to know whether reads are long enough and plentiful enough.
- **Decision point:** Proceed to host filtering. Data quality is acceptable.

---

### Step 3: Host Read Removal

```bash
# Download cassava reference (if not available locally)
# Assume it has been pre-downloaded to:
REF="references/Manihot_esculenta_genome.fa"

# Map all reads to the host genome
minimap2 -ax map-ont -t 4 $REF Training/long_reads/barcode57.fastq \
  | samtools view -bS - \
  | samtools sort -o mapped_to_host.bam -

# Index the BAM file
samtools index mapped_to_host.bam

# Check mapping statistics
samtools flagstat mapped_to_host.bam
```

**Example flagstat output:**
```
8567 + 0 in total (QC-passed reads + QC-failed reads)
7302 + 0 mapped (85.24% : N/A)
```

**Computational thinking in action:**

- **Pattern recognition:** 85% mapped to host. This is expected for a non-depleted leaf sample. You now have ~1,265 unmapped reads that are potentially viral.
- **Abstraction question:** Should I worry about the 85% of host reads? No — they are irrelevant to the viral analysis. You are abstracting the "sample" to "the viral fraction."

```bash
# Extract unmapped reads (the non-host fraction)
samtools view -f 4 -F 256 mapped_to_host.bam \
  | samtools fastq - > viral_candidate_reads.fastq

# Count the result
echo "Remaining reads:"
wc -l viral_candidate_reads.fastq | awk '{print $1/4}'
```

**Unexpected finding:** Only 1,265 reads remain. Now recalculate coverage:

```
Coverage = (1,265 reads × 2,914 bp average) / 2,700 bp genome size
         = 3,686,810 / 2,700
         ≈ 1,365×
```

**Decomposition insight:** 1,365× coverage is far more than the 30× minimum. This is not unusual for begomoviruses in symptomatic tissue — the virus replicates to high copy numbers. Your analysis can proceed.

---

### Step 4: De Novo Assembly

```bash
flye --nano-raw viral_candidate_reads.fastq \
     --genome-size 5k \
     --out-dir flye_assembly/ \
     --threads 4
```

**Algorithm design in action:** Why Flye with `--nano-raw` and not SPAdes?

- `--nano-raw`: Tells Flye to expect Nanopore reads with raw error rates (~10% error). If you used a mode designed for Illumina data, Flye would misinterpret the error model.
- Genome size `5k`: Slightly larger than 2.7 kb to account for the possibility of finding both DNA-A and DNA-B components. If set too small, Flye may stop assembling too early.

**Flye assembly output:**
```
assembly_info.txt:
seq_name    length    cov.    circ.    repeat    mult.
contig_1    2714      1203×   Y        N         1
contig_2    2691      1187×   Y        N         1
```

**Pattern recognition:** Two contigs, both circular (~2.7 kb), both at ~1,200× coverage. This is the classic begomovirus bipartite genome pattern. DNA-A and DNA-B components are typically similar in size and coverage in a co-infected plant.

---

### Step 5: Assembly Quality Evaluation

```bash
# Map original reads back to assembly to validate
minimap2 -ax map-ont flye_assembly/assembly.fasta viral_candidate_reads.fastq \
  | samtools sort -o reads_to_assembly.bam -
samtools index reads_to_assembly.bam
samtools coverage reads_to_assembly.bam
```

**Expected output:**
```
#rname     startpos  endpos  numreads  covbases  coverage  meanbaseq  meandepth
contig_1   1         2714    942       2714      100.00    9.3        1203.4
contig_2   1         2691    897       2691      100.00    9.2        1187.1
```

**Abstraction and validation:** 100% coverage of both contigs with no uncovered positions tells you the assembly is not fragmented. The depth is uniform, which rules out collapse artifacts (collapsed repeats show anomalously high depth).

**Polishing (optional for this coverage level):**
```bash
medaka_consensus -i viral_candidate_reads.fastq \
                 -d flye_assembly/assembly.fasta \
                 -o medaka_polished/ \
                 -t 4 \
                 -m r941_min_sup_g507  # match to basecalling model
```

---

### Step 6: BLAST for Identification

```bash
# BLAST contigs against NCBI nucleotide database
blastn -query flye_assembly/assembly.fasta \
       -db nt \
       -out blast_results.txt \
       -outfmt "6 qseqid sseqid pident length evalue stitle" \
       -evalue 1e-5 \
       -max_target_seqs 5 \
       -num_threads 4
```

**Interpreting BLAST output:**
```
contig_1  KX702091.1  95.3  2706  0.0  East African cassava mosaic virus DNA-A, complete genome
contig_2  KX702092.1  91.7  2688  0.0  East African cassava mosaic virus DNA-B, complete genome
```

**Pattern recognition:** 95.3% identity to EACMV DNA-A and 91.7% to EACMV DNA-B. This places the sample as likely EACMV, but the divergence in DNA-B suggests a potentially novel strain or recombinant.

**Critical thinking checkpoint:** Identity < 95% at the genome level often signals:
- A novel strain (most likely)
- A recombinant with another begomovirus (check for mosaic patterns)
- Assembly error (less likely given 1,200× coverage and 100% contig coverage)

---

### Step 7: Unexpected Result — A Third Contig

**Scenario:** Suppose Flye had also produced a third contig:

```
contig_3    6,892    23×    N    N    1
```

**Decomposition:** This requires a new sub-problem. What is contig_3?

```bash
# BLAST the unexpected contig
blastn -query contig_3.fa -db nt -out contig3_blast.txt \
       -outfmt "6 qseqid sseqid pident length evalue stitle" \
       -evalue 1e-5 -max_target_seqs 3
```

**Possible BLAST results and their interpretations:**

| BLAST result | Interpretation | Action |
|-------------|----------------|--------|
| Manihot esculenta chloroplast (99%) | Host contamination — plant plastid reads that escaped host filtering because plastid DNA differs from nuclear DNA | Exclude from viral analysis |
| Phage sequence | Possible bacteriophage from endophytic bacteria in the plant | Report separately, not as viral contig |
| No hit (e-value > 1e-5) | Truly novel sequence — unknown virus or repeat | Flag for manual investigation; do not include in EACMV tree |
| Another begomovirus component | This is a co-infection with two begomovirus species | Report both; generate separate trees |

**This is where pattern recognition is critical:** Cassava chloroplast DNA escaping host filtering is a *known* and *common* pattern. The cassava chloroplast genome (~160 kb) is structurally different enough from the nuclear genome that minimap2 can miss it if the reference used for host filtering was nuclear-only.

**The fix:**
```bash
# Use a combined reference including both nuclear and chloroplast genomes
cat nuclear_genome.fa chloroplast_genome.fa > combined_host.fa
minimap2 -ax map-ont combined_host.fa reads.fastq | samtools view -f 4 ... > cleaner_viral_reads.fastq
```

This is a perfect example of an **abstraction that failed**: you abstracted "host genome" to "nuclear reference", when the full abstraction should have included the plastid genome. The fix is to revise the abstraction.

---

### Step 8: Phylogenetic Analysis

```bash
# Download reference begomovirus sequences (DNA-A) from NCBI
# Assume these have been collected in references/begomovirus_DNA-A_refs.fa

# Combine with your assembled sequence
cat flye_assembly/assembly_contig1.fa references/begomovirus_DNA-A_refs.fa > all_DNA-A.fa

# Multiple sequence alignment
mafft --auto all_DNA-A.fa > aligned_DNA-A.fa

# Trim poorly aligned positions
trimal -in aligned_DNA-A.fa -out trimmed_DNA-A.fa -automated1

# Infer phylogenetic tree
iqtree2 -s trimmed_DNA-A.fa -m TEST -bb 1000 -nt AUTO -prefix EACMV_tree
```

**Algorithm design — choosing the phylogenetic method:**

| Method | Tool | Speed | Accuracy | Best for |
|--------|------|-------|----------|---------|
| Maximum likelihood | IQ-TREE2 | Moderate | Very high | < 1,000 sequences |
| Bayesian inference | BEAST2 | Slow | Highest | Temporal signal, divergence dates |
| Neighbour-joining | MEGA | Fast | Lower | Quick exploratory trees |
| Maximum parsimony | PAUP* | Variable | Variable | Historical comparison only |

For a 2–50 taxon begomovirus tree: IQ-TREE2 is the correct choice. BEAST2 would be appropriate if you had dated sequences and wanted molecular clock analysis — that is a different biological question.

---

## 3. Integrated Case Study 2: GWAS — Handling Unexpected Genomic Inflation

**Scenario:** You run a GWAS for chronic kidney disease in a cohort of 3,000 individuals and examine the QQ plot. The genomic inflation factor is λ = 1.32. This is too high — any value above 1.05 requires investigation.

**Decomposition of the inflation problem:**

```
λ = 1.32: What is the cause?
├── 1. Population stratification (most common)
│     └── Diagnosis: Examine PCA plot. Do cases cluster separately from controls?
├── 2. Cryptic relatedness
│     └── Diagnosis: Examine IBD distribution. Are there pairs with PI_HAT > 0.2?
├── 3. Genotyping batch effects
│     └── Diagnosis: Does inflation correlate with genotyping plate or date?
├── 4. Genuine signal (unlikely to cause λ > 1.1 uniformly)
│     └── Diagnosis: Inflation should be concentrated at significant SNPs, not genome-wide
└── 5. Software or file error
      └── Diagnosis: Re-examine phenotype coding. Are all controls actually controls?
```

**Pattern recognition:** λ = 1.32 is too high to be caused by a few strong signals — it indicates global inflation, pointing to a systematic problem rather than biology.

**Investigation:**

```bash
# Run PCA on QC-filtered genotypes
plink --bfile genotypes_qc \
      --pca 10 \
      --out pca_results

# Examine in R:
# plot(pca_results$PC1, pca_results$PC2, col=phenotype$status)
```

**Finding:** The PCA plot reveals that 200 cases cluster separately from all other samples along PC1. These samples are from a different geographic region (they were added to the study mid-collection). They were genotyped on a different array version.

**Abstraction insight:** The analyst originally abstracted "cohort" as a single homogeneous group. The reality was a batch-structured cohort with array version differences and geographic stratification.

**Corrective algorithm:**

```bash
# Option 1: Include the top 10 PCs as covariates in the regression
plink --bfile genotypes_qc \
      --logistic \
      --covar pca_results.eigenvec \
      --covar-number 1-10 \
      --out gwas_corrected

# Option 2: Remove the 200 outlier samples entirely and re-run
# (appropriate if the batch effect is too large to model)

# Option 3: Analyse the two batches separately, then meta-analyse
```

**Algorithm design trade-off:**

| Option | Advantage | Disadvantage |
|--------|-----------|-------------|
| Include PCs as covariates | Retains all samples; statistically valid | Does not fully correct for extreme batch effects |
| Remove outlier batch | Cleanest analysis | Loses 200 samples (~13% of cases) |
| Stratified meta-analysis | Maximises sample size; models heterogeneity | More complex; requires two separate analyses |

**The key message:** The first version of the analysis was not wrong. It was an appropriate starting point. The QQ plot — a validation checkpoint built into the algorithm — revealed the abstraction failure. The corrective action was to revise the abstraction and re-run from the point of failure, not from the beginning.

---

## 4. Integrated Case Study 3: RNA-Seq — Zero DE Genes

**Scenario:** You run a DESeq2 analysis comparing infected vs. uninfected cassava leaves (3 samples per group). The result: 0 differentially expressed genes at FDR < 0.05.

**Computational thinking in action:**

**Step 1 — Decompose the problem:**
```
Why are there zero DE genes?
├── A. The biology is genuinely the same (unlikely if samples were infected)
├── B. The analysis has an error
│     ├── B1. Wrong contrast specification in DESeq2
│     ├── B2. Wrong sample labels
│     └── B3. Normalisation failure
├── C. Insufficient statistical power
│     └── n=3 may not detect modest fold changes
└── D. Technical failure in the data
      ├── D1. Very low library size in one or more samples
      └── D2. Contamination obscuring the signal
```

**Step 2 — Apply pattern recognition:**

The pattern "zero DE genes with small sample sizes" is common and has a known cause: insufficient power. With n=3 per group, DESeq2 can only detect fold changes of approximately 4-fold or greater at typical expression levels. Small or moderate effects are invisible.

**Step 3 — Diagnostic checks in R:**

```r
library(DESeq2)

# Load counts and metadata
dds <- DESeqDataSetFromMatrix(countData = count_matrix,
                              colData = sample_info,
                              design = ~ condition)

# Check library sizes
colSums(counts(dds))
# If any sample has < 500,000 reads, it is too low

# Check normalised PCA — do groups separate?
vsd <- vst(dds, blind=FALSE)
plotPCA(vsd, intgroup="condition")
# If groups do NOT separate → either no signal or batch effect masking signal

# Check dispersion estimates
dds <- DESeq(dds)
plotDispEsts(dds)
# If dispersion is extremely high → overdispersion, likely biological or technical noise
```

**Pattern recognition from PCA:**

- Groups separate clearly on PC1 → there IS a signal; the statistical test is underpowered
- Groups do not separate at all → the biological effect may be weak, or samples are mislabelled
- Groups cluster by a different variable (batch, library prep date) → batch effect

**Corrective actions depending on diagnosis:**

| Finding | Action |
|---------|--------|
| Clear separation but no significant DE | Lower significance threshold (FDR < 0.1); or increase n |
| No separation at all | Verify sample labels and infection status; check raw data |
| Batch effect visible | Include batch as a covariate in the design formula |
| High dispersion | Check for outlier samples; consider removing extreme outliers |

---

## 5. Iterative Debugging: The Core Workflow

Every case study above followed the same core debugging loop:

```
[Unexpected result]
        ↓
[Decompose the possible causes]
        ↓
[Apply pattern recognition: have I seen this before?]
        ↓
[Select the most likely cause and test it]
        ↓
[Design a corrective action]
        ↓
[Apply the correction at the point of failure, not from scratch]
        ↓
[Re-validate: did the correction work?]
        ↓
[Document what happened and why]
```

This loop applies equally to:
- A crashed tool (find the error message, search for it, fix the input)
- An implausible result (find where the pipeline diverged from expectation)
- A peer reviewer's concern (identify which analytical choice is being questioned)

---

## 6. The Iterative Nature of Real Projects

No real bioinformatics project follows the clean pipeline you designed at the start. Here is what a realistic project timeline looks like:

```
Day 1:  Decompose the problem. Design a pipeline. Start QC.
Day 2:  QC complete. Notice unexpected bimodal GC. Investigate.
        → Recognise: mixed sample (host + pathogen)
        → Decision: must filter first, not assumed in original plan
Day 3:  Host filtering. Assembly. Assembly fails (0 contigs).
        → Decompose: why? Check input file → host filter command had a flag error,
          ALL reads were classified as host. Fix flag. Re-run.
Day 4:  Assembly succeeds. Three contigs. Expected: two.
        → Pattern recognition: third contig is likely plastid contamination
        → BLAST confirms. Exclude. Proceed.
Day 5:  Phylogenetic tree generated. Collaborator asks: "Why does the DNA-B
        branch land outside the main clade?"
        → Abstraction review: were enough reference sequences included?
        → Add 10 more NCBI sequences. Re-align. Re-tree. Result now makes sense.
```

**This is a success story.** The project was completed and the result was biologically meaningful. Every detour was a natural consequence of working with real, messy biological data. The computational thinking framework did not prevent problems — it provided a structured way to resolve them.

---

## 7. Computational Thinking as a Lifelong Skill

The four principles introduced in this module will not become obsolete when sequencing technologies change, when new tools replace current tools, or when you move to a new research area. They are domain-agnostic:

- A genomics researcher who learns machine learning is doing **decomposition** (what is the prediction problem?) and **abstraction** (what features matter?) all over again — in a new domain, but with the same cognitive tools.
- An epidemiologist building a disease surveillance system is doing **algorithm design** (what decision rules trigger an alert?) and **pattern recognition** (what does an outbreak look like in the data?) — same principles, different field.

> **The ultimate takeaway:** The tools change. The questions change. The data changes. The principles do not. Invest in the principles, and every new technology or domain you enter will be faster to learn than the last.

---

## 8. Checklist: Before You Submit Your Analysis

Use this checklist after completing any bioinformatics analysis to evaluate its quality and completeness:

**Decomposition audit:**
- [ ] Can I describe the full analysis in a logical tree of sub-problems?
- [ ] Does each step have a clear input, tool/method, and output?
- [ ] Did I include quality-check steps between major phases?

**Pattern recognition audit:**
- [ ] Did I look for known failure patterns (contamination, low coverage, batch effects) before accepting results?
- [ ] Did I check diagnostic plots (QQ plot, PCA, FastQC, coverage plot)?

**Abstraction audit:**
- [ ] Do I know what details I ignored and why?
- [ ] Is the abstraction appropriate for my biological question?
- [ ] Did any diagnostic plot suggest my abstraction failed?

**Algorithm design audit:**
- [ ] Can I justify each major tool choice?
- [ ] Have I documented all non-default parameters?
- [ ] Are my results reproducible from the documented commands?

**Iteration audit:**
- [ ] Did I investigate unexpected results, or did I accept them?
- [ ] If I revised the pipeline, did I document why?

---

## Summary

| Case study | Primary lesson |
|-----------|---------------|
| Viral assembly pipeline | Full decomposition applied; pattern recognition caught chloroplast contamination; abstraction failure identified and fixed |
| GWAS inflation | Iterative debugging; abstraction of "cohort homogeneity" revised after QC |
| RNA-Seq zero DE | Pattern recognition and diagnostic PCA identified insufficient power |

> **Closing statement:** You have now completed the computational thinking module. You began Modules 1–5 by learning to run tools. You now understand why those tools were designed the way they were, how to choose between them, how to know when to trust them, and how to recover when they give you something unexpected. That is the foundation of scientific problem-solving in computational biology — and it is a foundation that will serve you for your entire career.
