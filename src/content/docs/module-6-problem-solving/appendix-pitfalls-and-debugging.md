---
title: "Appendix — Common Pitfalls and Debugging Guide"
---


> This appendix is a living reference document. It catalogues failure modes encountered frequently in bioinformatics, organised by pipeline stage. For each pitfall, it describes the symptom, the likely cause, the diagnostic approach, and the fix. This is not a complete list — it is a starting point for building your own.

---

## How to Use This Appendix

When you encounter an unexpected result or error, follow this protocol:

```
1. Do not panic. Unexpected results are normal.
2. Read the error message or diagnostic output carefully.
3. Find the closest matching pitfall in this appendix.
4. Apply the diagnostic described.
5. If none match, search for the error message online + tool name + GitHub Issues.
6. Document what you found and what you did to fix it.
```

---

## Section 1: Data Quality Pitfalls

### Pitfall 1.1 — Raw reads fail quality check with mean quality < Q7 (Nanopore)

**Symptom:** NanoStat reports mean quality of 6.5 or lower; most reads are unassembled or produce fragmented contigs.

**Likely causes:**
- Reads basecalled with an outdated or mismatched basecalling model
- Flow cell used past its optimal cell count
- Reads basecalled in "fast" mode rather than "high accuracy" mode

**Diagnostic:**
```bash
# Check the header of your FASTQ reads — does it contain the basecalling model?
head -n 1 reads.fastq
# Nanopore headers should contain model info like:
# basecall_model_version_id=dna_r10.4.1_e8.2_400bps_sup@v4.3.0
```

**Fix:**
- If the model is mismatched (fast model applied to high-accuracy data), re-run Dorado or Guppy basecaller with the correct model: `--model dna_r10.4.1_e8.2_400bps_sup@v4.3.0`
- If flow cell exhaustion is the issue, request re-sequencing

---

### Pitfall 1.2 — FastQC reports "Fail" on per-tile quality for Illumina data

**Symptom:** FastQC per-tile quality module shows a red/fail result with a specific region of tiles showing low quality.

**Likely cause:** A bubble or obstruction on the Illumina flow cell during the sequencing run — that region of the flow cell produced lower quality signals.

**Diagnostic:** Check which tiles are affected (shown in the FastQC report). If it is a small fraction of tiles, the effect on analysis may be minor.

**Fix:**
- Report to the sequencing facility — this indicates a hardware/chemistry issue at the facility, not a sample problem
- For mild tile failure: proceed after quality trimming; the effect is usually diluted
- For severe or extensive tile failure: request re-sequencing

---

### Pitfall 1.3 — Bimodal GC peak in FastQC or NanoStat

**Symptom:** GC content plot shows two distinct peaks instead of a single bell curve.

**Likely cause:** Mixed sample (e.g., host + pathogen with different GC compositions; or two different organisms in a metagenomic sample).

**Diagnostic:**
```bash
# Run a quick taxonomic survey with Kraken2 on a subset of reads
head -n 4000 reads.fastq > subset.fastq  # First 1000 reads
kraken2 --db k2_standard subset.fastq --report kraken_report.txt --output /dev/null
# Inspect kraken_report.txt to see what is in the sample
```

**Fix:** This is usually expected for field samples. Proceed with host filtering (Section 2). Do not trim based on GC content alone — this is not an appropriate filtering criterion.

---

### Pitfall 1.4 — Empty FASTQ output after quality trimming

**Symptom:** After running Trimmomatic or Cutadapt, the output FASTQ file is 0 bytes or contains no reads.

**Likely cause:** Parameters are too aggressive; all reads are being discarded.

**Diagnostic:**
```bash
# Check how many reads the trimmer is removing
wc -l input.fastq output.fastq
# If output is 0, your threshold is too strict

# For Trimmomatic, check the summary log:
# Input Reads: 8567  Surviving: 0  Dropped: 8567
```

**Fix:**
- Relax the MINLEN parameter first (Trimmomatic MINLEN:50 → MINLEN:30)
- Check if LEADING/TRAILING quality thresholds are appropriate for your data (Q20 for Illumina; Nanopore usually does not need hard quality trimming — use length filtering instead)
- For Nanopore specifically: quality trimming is less standard; use `--min-length` in NanoFilt instead of score-based trimming

---

## Section 2: Host Filtering Pitfalls

### Pitfall 2.1 — >99% of reads map to host genome

**Symptom:** After minimap2, virtually all reads are classified as host. The extracted non-host FASTQ contains < 100 reads.

**Likely causes:**
- Very low viral titre in the sample
- Reference virus is so divergent that some viral reads map to the host genome
- The sample is not infected after all

**Diagnostic:**
```bash
# Check the actual numbers
samtools flagstat mapped_to_host.bam
# Look at unmapped read count carefully

# BLAST 100 of the "unmapped" reads to check what they are
head -n 400 unmapped_reads.fastq > subset_unmapped.fastq
blastn -query subset_unmapped.fastq -db nt -out test_blast.txt \
       -outfmt "6 qseqid sseqid pident length stitle" \
       -max_target_seqs 1 -evalue 1e-5
```

**Fix:**
- If viral titre is genuinely low: sequence more (combine samples if possible); consider viral enrichment in future experiments
- If the reference genome is causing over-mapping: check genome version; use only high-confidence nuclear chromosomes (exclude unplaced scaffolds which may be contaminated with viral sequences)

---

### Pitfall 2.2 — Chloroplast or mitochondrial reads survive host filtering

**Symptom:** After host filtering, one or more assembled contigs BLAST to chloroplast or mitochondrial sequences.

**Likely cause:** The host reference used for filtering was nuclear-only; organellar genomes were not included.

**Diagnostic:**
```bash
# BLAST unexpected contigs
blastn -query unexpected_contig.fa -db nt \
       -outfmt "6 qseqid sseqid pident stitle" \
       -evalue 1e-5 -max_target_seqs 1 -out blast_check.txt
# Look for "chloroplast", "mitochondrion", "plastid" in the stitle column
```

**Fix:**
```bash
# Download the chloroplast/mitochondrial genome and combine with nuclear reference
cat nuclear_reference.fa chloroplast.fa mitochondrion.fa > complete_host.fa

# Re-run host filtering with the complete reference
minimap2 -ax map-ont complete_host.fa reads.fastq \
  | samtools view -f 4 -F 256 | samtools fastq - > cleaner_viral_reads.fastq
```

---

### Pitfall 2.3 — Host genome download fails or uses wrong version

**Symptom:** minimap2 completes but mapping rate is anomalously low (< 50%) for a sample that should be mostly host-derived.

**Likely cause:** Wrong species reference; or reference genome is incomplete (draft assembly with many unplaced contigs); or genome is from a highly divergent cultivar.

**Diagnostic:**
```bash
# Verify the reference genome you are using
head -n 5 host_genome.fa  # Check FASTA header for assembly version
grep "^>" host_genome.fa | wc -l  # Count chromosomes/scaffolds
# A chromosome-level assembly should have <50 sequences
# A draft assembly may have thousands of scaffolds — use with caution
```

**Fix:** Download the highest-quality assembly available. For cassava: GCF_001659605.2 (Phytozome AM560-2). For tomato: GCF_000188115.5 (SL4.0). Always record the accession number you used.

---

## Section 3: Assembly Pitfalls

### Pitfall 3.1 — Assembly produces zero contigs

**Symptom:** Flye (or other assembler) completes but produces an empty `assembly.fasta` file.

**Likely causes:**
- Input FASTQ file is empty or corrupted
- Genome size estimate is wildly incorrect
- Read count is below the assembler's internal minimum

**Diagnostic:**
```bash
# Check input file
wc -l viral_reads.fastq
head -n 4 viral_reads.fastq  # Verify FASTQ format
file viral_reads.fastq  # Should say ASCII text

# Check Flye log file for error messages
cat flye_assembly/flye.log | tail -n 50
```

**Fix:**
- If file is empty: trace back to the host-filtering step and check all commands ran correctly
- If genome size is wrong: correct it and re-run
- If read count is too low (< 20 reads for very small genomes): assembly is impossible; obtain more data

---

### Pitfall 3.2 — Assembly size much larger than expected

**Symptom:** QUAST reports total assembly length of 500 kb when the target genome is 5 kb. Hundreds of contigs are produced.

**Likely causes:**
- Contaminating organisms assembled alongside the target
- Incomplete host filtering — host reads incorporated into assembly

**Diagnostic:**
```bash
# BLAST all contigs
blastn -query assembly.fasta -db nt \
       -outfmt "6 qseqid sseqid pident length stitle" \
       -evalue 1e-5 -max_target_seqs 1 -out all_contig_blast.txt

# Summarise taxonomy
cut -f6 all_contig_blast.txt | sort | uniq -c | sort -rn | head -20
```

**Fix:** Retain only contigs that BLAST to the target taxon. Filter by contig name or extract using samtools faidx:

```bash
# Extract only the viral contigs by name
samtools faidx assembly.fasta contig_1 contig_2 > viral_only.fasta
```

---

### Pitfall 3.3 — Assembly produces correct number of contigs but coverage is uneven

**Symptom:** When mapping reads back to the assembly, one region has 5,000× coverage and another has 0×. QUAST reports misassembled regions.

**Likely cause:** The assembler collapsed a repeat — two distinct genomic regions that share a repetitive element are represented as one contig. This causes reads from both original loci to pile up at the collapsed repeat, and the flanking unique regions to appear uncovered.

**Diagnostic:**
```bash
# Visualise coverage across the assembly
samtools depth -a reads_to_assembly.bam > depth.txt
# Plot depth.txt (position vs. depth) — look for sudden drops to 0 or spikes to 10,000×

# Check if low-coverage regions are in repetitive elements
blastn -query suspected_repeat_region.fa -db nt -outfmt "6 qseqid sseqid pident stitle"
```

**Fix:**
- If using short reads: switch to long reads that span the repeat
- If already using long reads: increase minimum overlap length (Flye `--min-overlap` parameter); or try Canu which has stronger repeat resolution
- Accept fragmented assembly at this locus and report it transparently

---

### Pitfall 3.4 — Flye crashes with "out of memory" error

**Symptom:** Flye exits mid-run with `MemoryError` or the system kills the process due to RAM exhaustion.

**Likely cause:** Genome size estimate is too large (causing Flye to allocate RAM for a large graph); or the system has insufficient RAM for the data volume.

**Diagnostic:**
```bash
# Check available RAM
free -h

# Check what genome size you specified
cat flye_assembly/flye.log | head -n 20  # First few lines show parameters
```

**Fix:**
- Reduce the genome size estimate to match your expectation
- Subsample reads if coverage is extremely high (> 500×): `rasusa -i reads.fastq -c 200 -g 5k -o subsampled_reads.fastq`
- Use a machine with more RAM (HPC cluster)

---

## Section 4: BLAST and Annotation Pitfalls

### Pitfall 4.1 — BLAST returns no hits

**Symptom:** blastn completes but the output file is empty, or all e-values are above 1e-5.

**Likely causes:**
- Truly novel sequence with no close relatives in the database
- Wrong BLAST program (e.g., blastn on a protein-coding region where blastp or blastx would be more sensitive)
- Database not downloaded or corrupted

**Diagnostic:**
```bash
# Verify database integrity
blastdbcmd -db nt -info

# Try blastx (translated BLAST — more sensitive for divergent sequences)
blastx -query contig.fa -db nr \
       -outfmt "6 qseqid sseqid pident length stitle" \
       -evalue 1e-3 -max_target_seqs 5 -out blastx_results.txt
```

**Fix:**
- Use blastx instead of blastn for protein-coding regions
- Relax the e-value threshold (1e-3 instead of 1e-5) — but report borderline hits with caution
- Query the ICTV database or Virus-Host DB for family-level relationships
- If the sequence is genuinely novel, this is a scientifically interesting finding — do not force a classification

---

### Pitfall 4.2 — Top BLAST hit is not the expected organism

**Symptom:** Your contig BLASTs with 99% identity to a sequence from a completely unrelated organism (e.g., your "viral" contig matches a bacterial plasmid).

**Likely causes:**
- Contamination in your sample that you did not account for
- Database entry mislabelled in NCBI
- Lateral gene transfer (the gene really does exist in both organisms)

**Diagnostic:**
```bash
# Check multiple hits, not just the top hit
blastn -query contig.fa -db nt -outfmt "6 qseqid sseqid pident length stitle" \
       -evalue 1e-5 -max_target_seqs 10 -out top10_blast.txt

# Check for multiple organisms in the hit list
cut -f6 top10_blast.txt | sort | uniq
```

**Fix:**
- Report the top 5 hits, not just the top 1
- Cross-check with NCBI taxonomy: is the top hit organism sensible given your sample source?
- If multiple unrelated organisms hit the same contig: the contig may be a repeat element or mobile genetic element — investigate further before including in downstream analysis

---

## Section 5: GWAS Pitfalls

### Pitfall 5.1 — Genomic inflation factor λ > 1.05

**Symptom:** QQ plot shows observed p-values consistently above the diagonal. Lambda is elevated.

**Diagnosis tree:**
```
Is inflation uniform (across all p-value quantiles)?
├── YES → Stratification or relatedness
│     └── Check PCA: do cases/controls separate by population?
│           ├── YES → Add top 10 PCs as covariates
│           └── NO  → Check IBD: are there related pairs?
└── NO (inflated only at top of QQ plot) → Likely true signal
      └── This is expected and good; do not "correct" it
```

---

### Pitfall 5.2 — Very few significant SNPs despite large sample size

**Symptom:** Genome-wide significance threshold (p < 5×10⁻⁸) is met by 0 SNPs despite n=10,000.

**Likely causes:**
- The phenotype is highly polygenic (thousands of common variants of small effect)
- Wrong phenotype definition (disease is clinically heterogeneous)
- Insufficient genotyping density in the causal region (imputation not performed)

**Diagnostic:**
- Check QQ plot: is there enrichment of small p-values (even if none reach genome-wide significance)?
- Run polygenic score analysis: even without significant SNPs, genetic architecture can be examined
- Review the phenotype definition with clinicians

---

### Pitfall 5.3 — Significant SNP is in the HLA region on chromosome 6

**Symptom:** The strongest association is at ~30 Mb on chromosome 6 — the HLA region.

**This is a special case, not a pitfall.** The HLA (human leukocyte antigen) region is the most polymorphic region in the human genome and is associated with hundreds of diseases, including infectious diseases and autoimmune conditions. An association here:
- Is often real
- Is extremely difficult to fine-map due to complex LD structure
- Requires specialised HLA typing methods (HLA-specific imputation panels)

**Action:** Do not dismiss HLA associations. Perform specialised HLA allele imputation using HLA*IMP or SNP2HLA, and report the specific allele(s) implicated.

---

## Section 6: RNA-Seq Pitfalls

### Pitfall 6.1 — Very low mapping rate (< 60%)

**Symptom:** STAR or HISAT2 reports that only 40–55% of reads mapped to the reference.

**Likely causes:**
- Wrong species reference (you aligned zebrafish reads to the human genome)
- Heavy adapter contamination (untrimmed adapters prevent alignment)
- Highly divergent sample (splice sites differ from reference annotation)
- Strand mismatch in featureCounts

**Diagnostic:**
```bash
# Check what is in the unmapped reads
samtools view -f 4 aligned.bam | samtools fastq - | head -n 400 > unmapped.fastq
blastn -query unmapped.fastq -db nt -outfmt "6 qseqid sseqid stitle" \
       -evalue 1e-5 -max_target_seqs 1 -out unmapped_blast.txt | head -n 20
# What organism do the unmapped reads come from?
```

---

### Pitfall 6.2 — DESeq2 reports "every gene is differentially expressed"

**Symptom:** 15,000 out of 20,000 tested genes are significant at FDR < 0.05.

**Likely causes:**
- Batch effect is the dominant signal (samples cluster by batch, not treatment)
- Sample labels are swapped (cases and controls are inverted)
- Extreme outlier sample pulling the whole analysis

**Diagnostic:**
```r
# PCA in R
vsd <- vst(dds, blind=TRUE)
plotPCA(vsd, intgroup="condition")
# Do samples cluster by biological condition or by something else?

# Heatmap of sample distances
sampleDists <- dist(t(assay(vsd)))
# Are any samples wildly different from all others?
```

---

### Pitfall 6.3 — featureCounts assigns < 30% of reads to genes

**Symptom:** featureCounts log shows that the majority of reads are "Unassigned_NoFeatures" or "Unassigned_Ambiguity".

**Likely causes:**
- Strand parameter is wrong (library is stranded but featureCounts called as unstranded)
- GTF annotation does not match the genome version used for alignment
- Reads are very short and map to intergenic regions between annotated genes

**Diagnostic:**
```bash
# Check strandedness with RSeQC
infer_experiment.py -r reference.bed -i aligned.bam
# Output will tell you if the library is stranded and in which direction
```

**Fix:**
```bash
# If library is forward-stranded (common for Illumina TruSeq Stranded):
featureCounts -s 1 ...

# If reverse-stranded (common for many kits):
featureCounts -s 2 ...

# If unstranded:
featureCounts -s 0 ...
```

---

## Section 7: General Bioinformatics Pitfalls

### Pitfall 7.1 — Command runs but produces no output and no error

**Symptom:** A tool appears to complete successfully (exit code 0) but the output file is empty or not created.

**Likely causes:**
- Pipe failed silently (without `set -o pipefail`)
- Input file was empty (previous step failed)
- Output was written to a different location than expected

**Diagnostic:**
```bash
# Check exit codes explicitly
command1 | command2
echo "Exit code: $?"  # Should be 0

# Check file sizes of all inputs before running
ls -lh input.fastq
```

**Fix:** Always add `set -euo pipefail` at the start of scripts. Always check input files before running computationally expensive tools.

---

### Pitfall 7.2 — Tool installed but not found

**Symptom:** `command not found: flye` even though `conda install flye` appeared to succeed.

**Likely cause:** Tool was installed in a different conda environment than the one currently active; or conda environment was not activated.

**Diagnostic:**
```bash
conda info --envs  # See which environment is active (marked with *)
which flye         # Shows the path to the flye executable (or error if not found)
conda list -n bioinfo | grep flye  # Check if flye is in the bioinfo environment
```

**Fix:**
```bash
conda activate bioinfo
which flye  # Should now return a path
```

---

### Pitfall 7.3 — Analysis gives different results on re-run

**Symptom:** Running the exact same command twice gives different output (different number of DE genes, different assembled contigs, different phylogenetic topology).

**Likely causes:**
- Tool uses a random seed that is not fixed — results are stochastic by design
- Floating-point arithmetic differences across compute environments
- Input files were inadvertently modified between runs

**Diagnostic:**
```bash
# Check if files are identical
md5sum first_run_output.fasta second_run_output.fasta
# Different checksums = genuinely different output
```

**Fix:**
- For stochastic tools (IQ-TREE, some assemblers): set a fixed random seed in the command
  - IQ-TREE2: `-seed 42`
  - Many tools: `--seed 42` or `-seed 42`
- Document the seed used so the analysis is reproducible
- Accept minor topological differences in phylogenetic analysis as normal — check if the well-supported relationships are stable across runs

---

### Pitfall 7.4 — Analysis runs correctly on local machine but fails on the HPC cluster

**Symptom:** Your pipeline works on your laptop but crashes on the cluster with different errors.

**Likely causes:**
- Different software versions on the cluster
- Different operating system or library versions
- Job killed due to time or memory limits (common on HPC schedulers)

**Diagnostic:**
```bash
# On the cluster, check the job log for the exit code
cat slurm-JOBID.out  # or equivalent for PBS/SGE
# Look for "OOM Killed" (out of memory) or "Terminated" (time limit exceeded)

# Check software versions
conda activate bioinfo && conda list | grep flye
```

**Fix:**
- Export your conda environment to a YAML file and recreate it on the cluster: `conda env export > bioinfo_env.yml`
- Use containers (Singularity/Docker) for truly reproducible environments
- Request sufficient memory and wall-time in your job submission script

---

## Debugging Mindset: A Final Note

Every pitfall in this appendix was encountered by an experienced bioinformatician at some point. None of them indicates incompetence — they indicate that you are working with real data in a complex computational environment.

The debugging mindset has three components:

1. **Curiosity:** "That is interesting. Why did this happen?" (not "Something went wrong. I must have made a mistake.")

2. **Systematic approach:** Identify the most likely cause based on symptoms. Test it. If wrong, move to the next candidate.

3. **Documentation:** Record what failed, why, and how you fixed it. This is not just good practice — it is the foundation of reproducible science, and it will save you enormous time the next time you see the same problem.

> **Remember:** A result that surprised you is more scientifically valuable than one that confirmed your hypothesis — as long as you understand why it surprised you.
