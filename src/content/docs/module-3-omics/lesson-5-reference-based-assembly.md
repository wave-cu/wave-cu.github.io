---
title: "Lesson 5: Reference-Based Assembly"
---

## 1. Lesson Goal

In this lesson, you will map long reads to a combined reference that contains:

1. ACMV DNA-A
2. ACMV DNA-B

You will then build a consensus sequence and produce alignment summary files. This is a reference-guided assembly workflow.

## 2. Why Use Reference-Based Assembly Here

Reference-based assembly is ideal when you have a trusted reference and want to answer questions like:

1. Assemble the full genome if de novo assembly fails.
2. Which parts of DNA-A and DNA-B are covered by reads?
3. What sample-specific differences exist relative to reference?

Compared with de novo assembly, this method is often faster and easier to interpret for known genomes. The tradeoff is that you may miss novel sequences or rearrangements not present in the reference. It is prone to reference bias if the sample differs significantly from the reference.

## 3. Input Files for This Lesson

We will use the cleaned FASTQ files from Lesson 4. These are the same reads used for de novo assembly, but now they will be mapped to a combined ACMV reference.

- `Training/long_reads/denovo/clean/barcode57_clean.fastq`
- `Training/long_reads/denovo/clean/barcode58_clean.fastq` (if available; otherwise continue with `barcode57` only)

Reference you will provide:

- You will go online to get this yourself. Download ACMV DNA-A and DNA-B sequences from NCBI, combine them into a single FASTA file, and place it in the reference folder.

## 4. Folder Organization for Reference-Based Work

Keep this workflow separate from de novo outputs.

```bash
cd Training/long_reads
mkdir -p reference_based/{raw,reference,mapping,consensus,stats,logs}
```

Copy reads into the reference-based raw folder.

```bash
cp barcode57.fastq reference_based/raw/
cp barcode58.fastq reference_based/raw/
```

## 5. Software environment

Use the same environment from Lesson 4 if already created.

```bash
conda activate bioinfo
```

## 6. Prepare the combined ACMV reference

Place your combined ACMV FASTA into `reference_based/reference`.

Example expected file path:

- `Training/long_reads/reference_based/reference/acmv_combined.fa`


```bash
cp <PATH_TO_YOUR_ACMV_COMBINED_FASTA> reference_based/reference/acmv_combined.fa
```

## 7. Map long reads to ACMV DNA-A + DNA-B

Map reads with Nanopore preset.

```bash
minimap2 -t 2 -ax map-ont  \
  reference_based/reference/acmv_combined.fa \
  reference_based/raw/barcode57_clean.fastq \
  > reference_based/mapping/barcode57_vs_acmv.sam
```

Convert, sort, and index BAM.

```bash
samtools view -b reference_based/mapping/barcode57_vs_acmv.sam > reference_based/mapping/barcode57_vs_acmv.bam
```
```bash
samtools sort reference_based/mapping/barcode57_vs_acmv.bam -o reference_based/mapping/barcode57_vs_acmv.sorted.bam
```
```bash
samtools index reference_based/mapping/barcode57_vs_acmv.sorted.bam
```

## 8. Evaluate mapping quality and coverage

Generate key alignment statistics.

```bash
samtools flagstat reference_based/mapping/barcode57_vs_acmv.sorted.bam > reference_based/stats/flagstat.txt
```
```bash
samtools idxstats reference_based/mapping/barcode57_vs_acmv.sorted.bam > reference_based/stats/idxstats.txt
```
```bash
samtools depth reference_based/mapping/barcode57_vs_acmv.sorted.bam > reference_based/stats/depth.txt
```

Check outputs quickly.

```bash
head -n 20 reference_based/stats/flagstat.txt
head -n 20 reference_based/stats/idxstats.txt
head -n 20 reference_based/stats/depth.txt
```

Interpretation guide:

1. `flagstat.txt` tells you overall alignment rate.
2. `idxstats.txt` shows reads mapped to each reference sequence (DNA-A vs DNA-B).
3. `depth.txt` shows per-position coverage, useful for finding low-coverage regions.

## 9. Build a consensus sequence

Generate a consensus FASTA.

```bash
samtools consensus \
  -o reference_based/consensus/barcode57_acmv_consensus.fa \
  reference_based/mapping/barcode57_vs_acmv.sorted.bam
```

Preview consensus output.

```bash
head -n 40 reference_based/consensus/barcode57_acmv_consensus.fa
```


## 10. Final Output Checklist

Expected important files:

1. `reference_based/mapping/barcode57_vs_acmv.sorted.bam`
2. `reference_based/stats/flagstat.txt`
3. `reference_based/stats/idxstats.txt`
4. `reference_based/stats/depth.txt`
5. `reference_based/consensus/barcode57_acmv_consensus.fa`

## 11. Key Take-Home Messages

1. Reference-guided assembly is efficient for known viral genomes.
2. Mapping statistics are essential to judge confidence, not optional.
3. Consensus sequence quality depends on read depth and alignment quality.
4. Keeping de novo and reference-based folders separate prevents analysis confusion.
