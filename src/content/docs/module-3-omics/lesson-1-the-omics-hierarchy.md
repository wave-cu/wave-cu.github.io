---
title: "Lesson 1: The Omics Hierarchy and File Architecture"
---

## Biological context: the omics layers

Omics refers to technologies used to study large-scale molecular information in biological systems. A common view follows the central dogma of molecular biology.

- Genomics (DNA-Seq)
  - Studies the complete DNA blueprint and sequence variation such as SNPs
- Transcriptomics (RNA-Seq)
  - Studies expressed RNA transcripts and which genes are active under specific conditions

## Technical definitions: the big four file formats

### FASTQ: raw sequence reads

FASTQ is the raw output from sequencing platforms such as Illumina and Oxford Nanopore.

- Definition: text format that stores biological sequences and per-base quality scores
- 4-line structure per read:
  - Line 1: header, starts with `@`
  - Line 2: sequence (`A`, `C`, `T`, `G`, `N`)
  - Line 3: separator, starts with `+`
  - Line 4: quality string (Phred scores encoded as ASCII characters)

### FASTA: reference sequence

FASTA is a simple format for nucleotide or protein sequences.

- Definition: sequence format used for references and assembled contigs
- Structure: entry header starts with `>` followed by sequence lines

### SAM/BAM: alignment records

SAM/BAM represent alignments of reads to a reference.

- SAM: human-readable alignment text format
- BAM: compressed binary version of SAM for efficient storage and processing
- Practical rule: store and process BAM, inspect with tools such as `samtools view`

### VCF: variant calls

VCF stores sequence variants relative to a reference.

- Definition: tab-delimited format for genomic variants
- Typical fields include chromosome, position, reference allele, and alternate allele

## Hands-on conceptual exercise

Inspect raw FASTQ structure in your training data.

```bash
cd ~/Training/short_reads/unpaired
zcat SRR11282408_Healthy.fastq.gz | head -n 4
```

Line 4 contains quality symbols that encode base-call confidence. Higher-quality symbols correspond to lower error probability.
