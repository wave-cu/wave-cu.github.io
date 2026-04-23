---
title: "Solutions — Module 6 Exercises"
---


> **Note for instructors:** These solutions demonstrate strong reasoning, not the only valid approach. Students may arrive at different but equally correct conclusions. Prioritise discussion of *reasoning quality* over answer matching. Where a student's approach differs from these solutions but is logically sound, treat it as an opportunity for a richer conversation.

---

## Exercise 1 Solutions: Systematic Decomposition of a New Problem

### Part A: Five Questions

**Q1 — Final biological output:**

A strong answer includes:
- A table or text report identifying the virus species (or species) present in each sample
- One or more phylogenetic trees (one per viral component if bipartite genome is found)
- A comparison table showing which virus/strain was found on each farm and whether there is cross-farm sharing
- Supporting files: assembled contigs (FASTA), BLAST summary table, alignment and tree files

A weak answer says only "a phylogenetic tree" without specifying what question the tree answers, or what format the result takes.

---

**Q2 — What data do I start with?**

Key points a strong answer includes:
- 6 FASTQ files, Nanopore technology (long reads, error rate ~5–15% depending on chemistry)
- 2 samples per farm = opportunity to check within-farm reproducibility
- No reference virus sequences from these farms → de novo approach required
- Tomato reference genome available → host filtering is feasible
- Unknown: basecalling model used (affects polishing tool choice), library preparation details, whether samples are mixed co-infections

---

**Q3 — Logical gap:**

```
Raw Nanopore FASTQ files (mixed: host + virus + other)
  ↓ QC and host filtering
Viral-enriched reads (clean, reduced)
  ↓ De novo assembly
Assembled contigs (of unknown identity)
  ↓ BLAST identification
Annotated viral contigs (labelled by species)
  ↓ Alignment + phylogenetics
Phylogenetic tree (evolutionary context)
  ↓ Comparison across farms
Conclusion: same/different virus per farm
```

---

**Q4 — Known failure modes (minimum four):**

| Failure mode | Step | Detection |
|-------------|------|-----------|
| Tomato chloroplast escapes host filtering | Host removal | Three-GC-peak QC; extra contig in assembly BLASTs to chloroplast |
| Low viral abundance → insufficient coverage | Coverage estimation | Coverage formula < 30× after host filtering |
| Co-infection with two viruses | Assembly | Two sets of contigs of the same expected size; BLAST gives different top hits |
| Assembly collapse (two strains in one contig) | Assembly | BLAST identity unexpectedly low to all references; uneven depth |
| Reference genome too divergent from local tomato → poor host removal | Host removal | Many host-like reads in assembled contigs |

---

**Q5 — "Good enough" thresholds:**

| Phase | Threshold |
|-------|---------|
| Read QC | Mean quality ≥ Q8 (Nanopore baseline); if mean < Q7, flag for re-basecalling |
| Host filtering | ≥ 50% of reads mapped to host (for a field sample — less would be surprising) |
| Coverage | ≥ 30× after host removal; flag and consider combining samples if below |
| Assembly | ≥ 90% of expected genome size covered; no uncovered regions in read-back mapping |
| BLAST identification | Top hit e-value < 1e-10; identity ≥ 65% for genus-level assignment |
| Phylogenetic tree | Bootstrap support ≥ 70 for key branches |

---

### Part B: Decomposition Tree

A strong tree for this problem:

```
Characterise tomato virus across 3 farms
│
├── Phase 1: Data quality assessment (×6 samples)
│     ├── 1a. NanoStat per sample (read count, N50, mean quality)
│     └── 1b. Flag samples with mean quality < Q8 or read count < 1,000
│
├── Phase 2: Host read removal (×6 samples)
│     ├── 2a. Download S. lycopersicum reference (including chloroplast genome)
│     ├── 2b. Map with minimap2 -ax map-ont
│     ├── 2c. Extract unmapped reads (samtools view -f 4)
│     ├── 2d. Quantify: % mapped to host (expected: 70–95%)
│     └── 2e. IF >99% mapped: investigate (possible very low viral load or wrong host reference)
│
├── Phase 3: Coverage estimation (×6 samples)
│     ├── 3a. Calculate coverage (reads × avg_length / expected_genome_size)
│     │         → Use 6,000 bp as estimate (bipartite genome, ~3 kb each component)
│     ├── 3b. IF coverage < 30×: combine with second farm sample before assembly
│     └── 3c. Document coverage decision
│
├── Phase 4: De novo assembly (×6 samples or combined pairs)
│     ├── 4a. Flye --nano-raw --genome-size 6k
│     ├── 4b. Evaluate: QUAST (N50, total length, contig count, circularity)
│     ├── 4c. Polish: Medaka (match model to basecalling chemistry)
│     └── 4d. IF assembly fails: check filtered reads file; check genome size estimate
│
├── Phase 5: Contig identification (×6 assemblies)
│     ├── 5a. BLAST all contigs vs. NCBI nt (outfmt 6, evalue 1e-5)
│     ├── 5b. Classify contigs: viral, host chloroplast, bacterial, unknown
│     ├── 5c. Retain only viral contigs
│     └── 5d. IF multiple viral species detected: report as co-infection
│
├── Phase 6: Annotation
│     ├── 6a. Compare to GenBank entries (BLASTn + BLASTx)
│     └── 6b. Predict and annotate ORFs
│
├── Phase 7: Phylogenetic analysis (per viral species found)
│     ├── 7a. Download reference sequences (same genus/family, from NCBI)
│     ├── 7b. Align: MAFFT --auto
│     ├── 7c. Trim: trimAl -automated1
│     ├── 7d. Model selection + tree inference: IQ-TREE2 -m TEST -bb 1000
│     └── 7e. Visualise: FigTree or iTOL
│
└── Phase 8: Cross-farm comparison
      ├── 8a. Extract assembled sequences from all 6 samples
      ├── 8b. Pairwise BLAST or whole-genome alignment (Mauve)
      └── 8c. Report: same strain / related strains / different species per farm
```

---

### Part C: Relevant Patterns

**Pattern 1: Mixed sample with bimodal GC** — very likely in field-collected plant material. Presentation: GC plot in NanoStat or FastQC shows two peaks. Response: proceed with host filtering; do not be alarmed.

**Pattern 2: Chloroplast escape from host filtering** — known issue when host reference is nuclear-only. Presentation: unexpected extra contig in assembly, BLASTs to Solanaceae chloroplast. Response: include chloroplast genome in host reference; remove the contig.

**Pattern 3: Co-infection** — multiple viruses common in symptomatic plants. Presentation: more contigs than expected; BLAST gives different top hits for different contigs. Response: separate the viruses and analyse each independently.

---

### Part D: Algorithm Choices with SACRED justification

**Host removal:**
- Tool: minimap2 + samtools
- SACRED: Speed (fast, runs in minutes); Data suitability (map-ont mode designed for Nanopore); Ease (standard, well-documented)
- Acceptable alternative: Kraken2 (better if reference is incomplete, but requires large database)

**De novo assembly:**
- Tool: Flye (--nano-raw)
- SACRED: Accuracy (handles high error rate via read graph approach); Robustness (designed for messy field data); Data suitability (Nanopore-specific mode)

**Viral contig identification:**
- Tool: BLASTn against NCBI nt
- SACRED: Accuracy (exhaustive database coverage); Speed (acceptable for small contig count)

**Phylogenetic analysis:**
- Tool: IQ-TREE2 with model testing (-m TEST)
- SACRED: Accuracy (maximum likelihood with bootstrap; best method for < 100 sequences); Ease (minimal configuration for standard use case)

**Cross-farm comparison:**
- Tool: BLASTn (pairwise) or whole-genome alignment (Mauve) + average nucleotide identity (ANI)
- Justification: You are asking about similarity between sequences, which is an alignment/similarity problem. BLAST is fast; ANI is more rigorous if you want species-level discrimination.

---

## Exercise 2 Solutions: A GWAS Gone Wrong

### Part A: Diagnosis

**Most likely cause of λ = 1.89:**

Decomposed causes:
1. Population stratification — supported by the PCA finding (PC1 separates Kenya from Ghana)
2. Cryptic relatedness — possible, but relatedness would not cause PC1 to split perfectly by country
3. Batch effects — could contribute if genotyping was done in country-specific batches
4. True signal — eliminated: λ = 1.89 is too high and too uniform for true signal, which concentrates at significant SNPs

**Most likely cause: population stratification.** The PCA shows that Kenya and Ghana form completely separate clusters. These populations have different allele frequencies at hundreds of thousands of SNPs across the genome. The association analysis, naively treating both groups as "cases and controls," is detecting country of origin at every SNP, not disease association.

**The student's counterargument:**
It is incorrect. Malaria severity genetics differ between populations, but not so dramatically or uniformly that every SNP in the genome would show association. The key diagnostic to refute this claim: **LD score regression (LDSC)**. LDSC can partition inflation into stratification and genuine polygenicity. If the intercept is >> 1.0, the inflation is confounding, not signal.

**Abstraction failure:**
The analysis abstracted "cohort" as a single ancestrally homogeneous population. In reality, the cohort was a stratified mixture of two genetically distinct populations with different environmental exposures (different malaria transmission settings in Kenya vs. Ghana), different case definitions, and different control recruitment strategies. A correct abstraction would model the two populations separately or explicitly include ancestry as a covariate.

---

### Part B: Corrective Strategies

**Strategy 1: Include top PCs as covariates**

```bash
plink --bfile genotypes_qc \
      --logistic \
      --covar pca_results.eigenvec \
      --covar-number 1-10 \
      --out gwas_pc_corrected
```

| SACRED factor | Score |
|--------------|-------|
| Speed | High — just adds covariates to regression |
| Accuracy | Moderate — corrects for gradual stratification; may not fully correct extreme stratification |
| Cost | Low |
| Robustness | Moderate — assumes linear relationship between PCs and phenotype |
| Ease | High |
| Data suitability | Good for mild stratification; questionable for two completely separate populations |

---

**Strategy 2: Stratified analysis + meta-analysis**

Run the GWAS separately in Kenya and Ghana, then meta-analyse with a fixed-effects model (METAL or GWAMA).

| SACRED factor | Score |
|--------------|-------|
| Speed | Moderate — two separate runs |
| Accuracy | High — removes confounding completely by population |
| Cost | Low |
| Robustness | High — does not rely on covariate assumptions |
| Ease | Moderate — requires meta-analysis software |
| Data suitability | Excellent for two clearly separated populations |

---

**Strategy 3: Genomic Control (GC correction)**

Divide all test statistics by the inflation factor λ before computing p-values.

```r
# In R, using a summary statistics file:
summary_stats$chi2_corrected <- summary_stats$chi2 / 1.89
summary_stats$p_corrected <- pchisq(summary_stats$chi2_corrected, df=1, lower.tail=FALSE)
```

| SACRED factor | Score |
|--------------|-------|
| Speed | Very high — post-hoc correction |
| Accuracy | Lower — blunt correction that doesn't model stratification |
| Cost | Very low |
| Robustness | Low — overcorrects in polygenic traits; undercorrects in extreme stratification |
| Ease | Very high |
| Data suitability | Only for mild inflation (λ < 1.1) |

**Recommendation for this scenario:** Strategy 2 (stratified meta-analysis). The stratification is so extreme (two completely non-overlapping clusters in PCA) that covariate correction (Strategy 1) may be insufficient. GC correction (Strategy 3) would be inappropriate here — it is only suitable for mild inflation.

---

### Part C: Open Reflection

The proposal to use only one country's data is scientifically suboptimal:
- **Loss of sample size**: Halving to n=1,000 reduces statistical power by ~30% (power scales with √n in most models). This may eliminate the ability to detect true associations.
- **Loss of generalisability**: Results from Kenya-only would apply only to the Kenyan population. Malaria genetics are population-specific; a Kenya-only result may not replicate in Ghana.
- **Misses cross-population heterogeneity**: Some variants may be associated in one population but not another — that heterogeneity is itself scientifically interesting.

The correct solution is Strategy 2: analyse populations separately, then meta-analyse. This is the standard approach in multi-ancestry GWAS.

**Computational thinking principle:** This is an abstraction problem. The student wants to simplify by using only one population — but the correct simplification is to abstract the *analysis* separately per population, not to discard half the data.

---

## Exercise 3 Solutions: Pseudocode and Algorithm Design

### Part A: Pseudocode

A strong pseudocode submission:

```
SCRIPT: viral_filter_and_assemble.sh
INPUTS: FASTQ_FILE, HOST_GENOME, GENOME_SIZE (default 5000)
OUTPUTS: results/ directory structure

FUNCTION main(fastq_file, host_genome):
    CREATE directories: results/qc/, results/mapping/, results/assembly/

    STEP 1: Read quality assessment
    RUN NanoStat on fastq_file
    SAVE report to results/qc/nanostat_report.txt
    PRINT "QC complete"

    STEP 2: Host read mapping
    RUN minimap2 -ax map-ont host_genome fastq_file → SAM
    CONVERT SAM to sorted BAM (samtools sort)
    INDEX BAM (samtools index)
    SAVE BAM to results/mapping/mapped_to_host.bam

    STEP 3: Extract unmapped reads
    RUN samtools view -f 4 -F 256 mapped_to_host.bam → FASTQ
    SAVE to results/mapping/viral_candidate_reads.fastq

    STEP 4: Coverage estimation
    read_count = COUNT_LINES(viral_candidate_reads.fastq) / 4
    avg_length = ESTIMATE_AVERAGE_LENGTH(viral_candidate_reads.fastq)
    coverage = (read_count × avg_length) / GENOME_SIZE
    PRINT "Estimated coverage: " + coverage + "×"

    IF coverage < 30:
        PRINT WARNING "Coverage below 30×. Consider combining samples."
        EXIT with code 1  # or flag, depending on design
    ELSE:
        PRINT "Coverage adequate. Proceeding to assembly."

    STEP 5: De novo assembly
    RUN flye --nano-raw viral_candidate_reads.fastq
             --genome-size GENOME_SIZE
             --out-dir results/assembly/
             --threads 4
    PRINT "Assembly complete"

    STEP 6: Mapping QC report
    RUN samtools flagstat results/mapping/mapped_to_host.bam
    SAVE to results/qc/flagstat_report.txt

    PRINT "Pipeline complete. Results in results/"

CALL main(FASTQ_FILE, HOST_GENOME)
```

---

### Part B: Bash Script

```bash
#!/usr/bin/env bash
# viral_filter_and_assemble.sh
# Usage: bash viral_filter_and_assemble.sh <reads.fastq> <host_genome.fa> [genome_size_bp]
#
# set -euo pipefail:
#   -e: exit immediately if any command fails (non-zero exit code)
#   -u: treat undefined variables as errors (prevents silent typos)
#   -o pipefail: if any command in a pipe fails, the whole pipe fails
#   Together: prevents silent failures from cascading through the pipeline
set -euo pipefail

# --- Arguments ---
READS="${1:?Usage: $0 <reads.fastq> <host_genome.fa> [genome_size_bp]}"
HOST_GENOME="${2:?Must provide host genome FASTA}"
GENOME_SIZE="${3:-5000}"    # Default 5000 bp if not provided
THREADS=4

# --- Directory setup ---
mkdir -p results/qc results/mapping results/assembly

echo "=== Step 1: Read quality assessment ==="
NanoStat --fastq "$READS" --outdir results/qc/ --name "raw_reads" \
  > results/qc/nanostat_stdout.txt 2>&1
echo "  NanoStat complete. Report in results/qc/"

echo "=== Step 2: Map reads to host genome ==="
minimap2 -ax map-ont -t "$THREADS" "$HOST_GENOME" "$READS" \
  | samtools sort -o results/mapping/mapped_to_host.bam -
samtools index results/mapping/mapped_to_host.bam
echo "  Mapping complete."

echo "=== Step 3: Extract non-host (unmapped) reads ==="
samtools view -f 4 -F 256 results/mapping/mapped_to_host.bam \
  | samtools fastq - > results/mapping/viral_candidate_reads.fastq
echo "  Non-host reads extracted."

echo "=== Step 4: Estimate coverage ==="
LINE_COUNT=$(wc -l < results/mapping/viral_candidate_reads.fastq)
READ_COUNT=$(( LINE_COUNT / 4 ))
# Estimate average read length: total bases / read count
TOTAL_BASES=$(awk 'NR%4==2 {total+=length($0)} END {print total}' \
  results/mapping/viral_candidate_reads.fastq)
if [ "$READ_COUNT" -eq 0 ]; then
  echo "ERROR: No non-host reads found. Check host genome and input reads."
  exit 1
fi
AVG_LENGTH=$(( TOTAL_BASES / READ_COUNT ))
COVERAGE=$(( READ_COUNT * AVG_LENGTH / GENOME_SIZE ))
echo "  Reads: $READ_COUNT | Avg length: ${AVG_LENGTH} bp | Coverage: ~${COVERAGE}×"

if [ "$COVERAGE" -lt 30 ]; then
  echo "  WARNING: Coverage ($COVERAGE×) is below the recommended 30× threshold."
  echo "  Consider combining with additional samples before assembly."
  echo "  Proceeding anyway — assembly quality may be reduced."
fi

echo "=== Step 5: De novo assembly with Flye ==="
flye --nano-raw results/mapping/viral_candidate_reads.fastq \
     --genome-size "${GENOME_SIZE}" \
     --out-dir results/assembly/ \
     --threads "$THREADS"
echo "  Assembly complete. Results in results/assembly/"

echo "=== Step 6: Mapping QC report ==="
samtools flagstat results/mapping/mapped_to_host.bam \
  > results/qc/flagstat_report.txt
echo "  Flagstat report saved to results/qc/flagstat_report.txt"

echo "=== Pipeline complete ==="
echo "All results in: results/"
```

---

### Part C: Algorithm Evaluation

**1. Risk of incorrect genome size:**

- **False pass (too large):** If genome size is set to 50,000 bp instead of 5,000 bp, the coverage estimate is 10-fold too low. A sample with true 300× coverage would appear to have 30× — exactly at the threshold — and the warning would not trigger even though the data is excellent. The assembly still runs and may be fine, but you lose the diagnostic value of the coverage check.

- **False fail (too small):** If genome size is set to 500 bp instead of 5,000 bp, the coverage appears 10-fold too high. A sample with genuine 10× coverage (insufficient) would appear to have 100×, and the script would proceed to assembly with inadequate data, producing a poor or failed assembly.

**2. Alternative approach:**

Use a prior BLAST-based estimate or biological knowledge:
- If you have done an initial quick BLASTn of a subset of reads, the top hit genome size gives you an estimate.
- Alternatively, use Minimap2's read-to-read overlap output to estimate genome size from the read depth curve (this is what Flye does internally with its `--asm-coverage` parameter).
- If the expected organism is known (e.g., "probably a begomovirus"), the NCBI taxonomy entry will give you the expected genome size.

**3. `set -euo pipefail`:**

Without this, if `minimap2` failed (e.g., due to a corrupted genome file), bash would continue to the next command, attempting to extract unmapped reads from a non-existent BAM file, then continuing to assembly. By the end, you would have an assembly of nothing — and no error message indicating anything had gone wrong. The script would appear to succeed while producing garbage output.

`set -euo pipefail` implements **decomposition** — specifically, it enforces that each sub-step must succeed before the next begins. It makes the pipeline's modular structure enforceable, not just conceptual.

---

## Exercise 4 Solutions: Open-Ended Challenge

> **Important for instructors:** This exercise has no single correct answer. The solutions below represent one strong approach. Reward logical coherence, justified choices, and explicit handling of uncertainty — not agreement with this document.

### Part A: Top 10 Questions for Your Supervisor

A strong answer will include questions in this priority order:

1. **Is a zebrafish reference genome and GTF annotation available?** (Determines pipeline type: alignment-based vs. de novo assembly)
2. **What organism/strain of zebrafish?** (Determines which reference to use: GRCz11 for Danio rerio)
3. **Were the samples run on the same flow cell / the same sequencing batch?** (Determines whether batch correction is needed)
4. **What is the expected fold change of the effect?** (Determines power and whether n=4 is sufficient)
5. **What time point were the embryos treated?** (Affects which developmental transcriptome is the right reference)
6. **Was there a treatment vehicle (DMSO)?** (Controls should receive the vehicle, not just water)
7. **What is the library type?** (Stranded or unstranded? Poly-A selection or ribo-depletion? Affects featureCounts parameters)
8. **Have any samples had quality issues noted at the facility?** (Alerts you to samples to monitor closely)
9. **What is the scientific question — all DE genes, or a specific pathway?** (Affects reporting threshold and focus)
10. **Have any prior RNA-Seq experiments been done in this system?** (Allows comparison and controls for known biology)

---

### Part B: Provisional Pipeline

A strong provisional pipeline:

**Explicit assumptions made under uncertainty:**
- Assuming Danio rerio reference genome (GRCz11) is appropriate
- Assuming library is stranded (most modern RNA-Seq protocols)
- Assuming biological replication is genuinely independent (not technical replicates mislabelled as biological)
- Assuming "treatment" is the primary variable of interest

```
Provisional RNA-Seq pipeline for zebrafish antifungal data
│
├── 1. Quality assessment (×12 samples)
│     ├── 1a. FastQC on all files
│     ├── 1b. MultiQC to aggregate
│     ├── 1c. Decision point A: if any sample has < 5M reads → flag for exclusion discussion
│     └── 1d. Decision point B: if adapter content detected → add Trimmomatic step
│
├── 2. Read alignment
│     ├── 2a. Download GRCz11 genome + GTF from Ensembl
│     ├── 2b. Build STAR index (genomeDir, GTF file)
│     ├── 2c. Align all 12 samples (STAR --outSAMtype BAM SortedByCoordinate)
│     └── 2d. Evaluate: mapping rate per sample (expect ≥ 75%)
│
├── 3. Quantification
│     ├── 3a. featureCounts (gene-level, paired-end, stranded)
│     └── 3b. MultiQC to check assignment rates
│
├── 4. Differential expression
│     ├── 4a. Import to R (DESeq2)
│     ├── 4b. PCA: visualise sample clustering
│     ├── 4c. Decision point C: if batch structure visible → add batch as covariate
│     ├── 4d. Two contrasts: control vs. low_dose; control vs. high_dose
│     └── 4e. Volcano plots, heatmaps, gene lists
│
└── 5. Functional interpretation
      ├── 5a. GO enrichment (clusterProfiler)
      └── 5b. Pathway analysis (KEGG or Reactome)

IF no zebrafish reference available:
  Replace steps 2-3 with Trinity de novo assembly + RSEM quantification
  (Much slower; assembly quality uncertain; treat results as exploratory only)
```

---

### Part C: Interpreting Unexpected Results

**Observation 1: Zero DE genes between control and low_dose**

| Possible explanation | Diagnostic |
|---------------------|-----------|
| Effect of low dose is genuinely small; n=4 is underpowered | Examine estimated fold changes — are they < 1.2? Check power calculations |
| Low_dose samples are mislabelled (they are actually controls) | PCA: low_dose samples cluster with controls, not between control and high_dose |

*Most relevant principle: Pattern recognition* — "zero DE genes with small n" is a known power problem.

---

**Observation 2: 4,872 DE genes between control and high_dose**

| Possible explanation | Diagnostic |
|---------------------|-----------|
| Genuine broad transcriptional response to high dose | Check GO enrichment — does it make biological sense for an antifungal compound? |
| Batch effect (high_dose all from one sequencing lane) | Check MultiQC — do high_dose samples share a specific lane? Check PCA for lane clustering |

*Most relevant principle: Abstraction* — you need to determine whether the signal is real biology or an artefact of the abstraction (treating lane = treatment).

---

**Observation 3: Controls spread out on PCA (PC1 = 62% within controls)**

| Possible explanation | Diagnostic |
|---------------------|-----------|
| Biological noise (developmental stage variation within control group; zebrafish embryos are staged by hours post-fertilisation) | Check whether developmental timing was recorded — was staging consistent? |
| Technical batch effect (different RNA extraction kits, operators, or dates) | Check sample metadata — were all controls extracted on the same day? |

*Most relevant principle: Decomposition* — decompose the source of variance. PC1 within a single treatment group should be noise; if it is 62%, there is a structured source of variation that must be identified.

---

### Part D: Scientific Communication Outline

**The problem (one sentence):**
"We need to determine which genes in zebrafish embryos are transcriptionally affected by a novel antifungal compound at two doses, using RNA-Seq data from 12 samples across three treatment groups."

**Major phases:**
1. Data QC and preprocessing (validate data quality before committing compute time)
2. Alignment to zebrafish reference genome (STAR — chosen because it handles spliced RNA-Seq reads; BWA would miss exon-exon junction reads)
3. Gene-level quantification (featureCounts — gene-level aggregation appropriate for differential expression; not transcript-level, which requires different tools)
4. Statistical testing (DESeq2 — designed for count data negative binomial model; not a simple t-test)
5. Functional interpretation (GO enrichment — translates gene lists into biological meaning)

**Two biggest risks:**
- Risk 1: Batch effects masking or inflating biological signal → Mitigation: examine PCA before finalising the statistical model
- Risk 2: Insufficient power with n=4 → Mitigation: if zero DE genes found at FDR 0.05, examine at FDR 0.2 and check estimated effect sizes

**What "done" looks like:**
- Volcano plots for both contrasts (control vs. low, control vs. high)
- A table of top 50 DE genes per contrast with fold changes and adjusted p-values
- GO enrichment dot plots for significant gene sets
- A brief written interpretation connecting the biology to the antifungal mechanism of action
