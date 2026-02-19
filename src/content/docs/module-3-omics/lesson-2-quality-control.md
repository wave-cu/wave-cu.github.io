---
title: "Lesson 2: Precision Quality Control (QC)"
---

## Why quality control matters

Before downstream analysis, assess raw read quality to detect artifacts that can bias results.

Common issues include:

- Adapter contamination
  - Synthetic adapter sequence is retained in reads
- Base-calling errors
  - Quality often drops toward read ends in long or noisy runs

## Phred quality score

Phred score (`Q`) expresses the probability (`P`) that a base call is incorrect.

```text
Q = -10 * log10(P)
```

Reference points:

```text
Q10  -> error probability 1 in 10     -> 90% accuracy
Q20  -> error probability 1 in 100    -> 99% accuracy
Q30  -> error probability 1 in 1,000  -> 99.9% accuracy
```

## Tools: FastQC and MultiQC

Use two standard tools together:

- `FastQC`: generates per-sample quality reports
- `MultiQC`: aggregates many FastQC outputs into one comparison report

## Hands-on workflow

### 1) Activate environment

```bash
conda activate bioinfo
```

### 2) Run FastQC on training reads

```bash
mkdir -p ~/Training/QC_Results
fastqc ~/Training/short_reads/unpaired/*.fastq.gz -o ~/Training/QC_Results
```

### 3) Aggregate reports with MultiQC

```bash
cd ~/Training/QC_Results
multiqc .
```

## What to inspect in the MultiQC report

Focus on these sections:

1. Per-base sequence quality
2. Adapter content
3. Overrepresented sequences

If quality tails drop below about Q20 or adapter content rises, trimming should be included before assembly.
