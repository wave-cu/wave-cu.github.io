---
title: "Lesson 3: Genome Assembly Foundations"
---

## 1. What is Genome Assembly?

Genome assembly is the process of reconstructing a genome sequence from smaller sequencing reads.

A sequencer does not usually output one full chromosome as a single read. Instead, it produces many overlapping pieces (reads). Assembly algorithms use these overlaps to rebuild longer sequences called contigs and scaffolds.

In practical terms, assembly answers this question:

How do we go from thousands or millions of short/long fragments to a biologically meaningful genome sequence?

## 2. Why Assembly Is Important in Bioinformatics

Genome assembly is important because many downstream analyses depend on having a good genome representation.

1. It helps discover unknown pathogens or strains when no perfect reference exists.
2. It supports gene discovery and annotation in non-model organisms.
3. It enables structural variant detection (insertions, deletions, rearrangements).
4. It provides a foundation for comparative genomics and evolutionary studies.
5. It improves interpretation of functional omics data (RNA-seq, metagenomics) by giving correct genomic context.

A poor assembly can mislead all later analysis steps. For this reason, assembly quality is not optional; it is central to reliable biological interpretation.

## 3. Core Concepts You Must Know

### 3.1 Reads, Contigs, and Scaffolds

- Reads are raw sequences from the sequencer.
- Contigs are contiguous sequences assembled from overlapping reads.
- Scaffolds are linked contigs with estimated gaps (often using read-pair or long-range information).

### 3.2 Coverage (Depth)

Coverage tells us how many times a genomic region is represented by reads.

Approximate formula:

Coverage = (Number_of_reads x Read_length) / Genome_size

Higher coverage usually improves assembly confidence, but very uneven coverage can still cause assembly gaps or errors.

### 3.3 Repeats

Repeated regions are hard to assemble because many genomic positions look similar.

- Short reads struggle more with long repeats.
- Long reads often bridge repeats better and improve contiguity.

## 4. De novo vs Reference-Based Assembly

## 4.1 De novo Assembly

De novo assembly reconstructs a genome from reads alone, without aligning to an existing reference.

When to use it:

1. No suitable reference genome exists.
2. You expect novel sequence not present in existing references.
3. You want unbiased reconstruction.

Strengths:

- Can reveal new sequences and genome rearrangements.
- Avoids reference bias.

Limitations:

- Computationally demanding.
- Sensitive to read quality and coverage.
- Harder in complex or highly repetitive genomes.

## 4.2 Reference-Based (Reference-Guided) Assembly

Reference-based assembly aligns reads to a known reference genome and reconstructs sample sequence relative to it.

When to use it:

1. A high-quality, closely related reference is available.
2. You mainly want consensus sequence and variants.
3. You need a faster and often simpler workflow.

Strengths:

- Efficient and reproducible for known organisms.
- Strong for SNP/indel calling and consensus generation.

Limitations:

- Can miss novel insertions or major rearrangements.
- Introduces reference bias if the sample differs strongly from the reference.

## 5. Software Choices for Short vs Long Reads

Different read types require different algorithmic strategies.

### 5.1 Short-Read Assembly Tools (Illumina)

Common options:

- SPAdes
- MEGAHIT
- Velvet (older but important historically)

Why these work for short reads:

They often use de Bruijn graph methods, which are efficient for massive numbers of accurate short reads.

### 5.2 Long-Read Assembly Tools (Oxford Nanopore / PacBio)

Common options:

- Flye
- Canu
- Raven
- wtdbg2

Why these work for long reads:

They are designed to handle higher error rates and long overlaps, which improves assembly across repeats.

### 5.3 Hybrid Assembly

Hybrid assembly combines short-read accuracy with long-read contiguity.

Common options:

- Unicycler
- hybridSPAdes

This is often useful when both read types are available and you need strong accuracy plus long contigs.

## 6. High-Level Assembly Pipeline (Overview)

This is a general assembly workflow you can adapt by project.

1. Organize files and project folders.
2. Inspect raw reads (`head`, `tail`, read counts).
3. Perform read quality control and contamination filtering.
4. Run assembly (de novo or reference-guided).
5. Assess assembly quality (N50, total length, number of contigs, completeness).
6. Assign biological identity (for example, BLAST on contigs).
7. Document software versions, parameters, and outputs for reproducibility.

## 7. File Organization Pattern for Assembly Projects

Good organization prevents errors and makes your analysis reproducible.

Use clear subfolders for input, intermediate files, and final outputs.

```bash
cd Training/long_reads
mkdir -p denovo/{raw,clean,assembly,blast,logs,reference}
```

## 8. Quick Data Inspection Using Existing Training Files

Before assembling, verify what files are available and inspect read structure.

```bash
cd Training/long_reads
ls -lh

head -n 8 barcode57.fastq
head -n 8 barcode58.fastq

tail -n 8 barcode57.fastq
tail -n 8 barcode58.fastq
```

Count total lines and estimate number of reads (FASTQ uses 4 lines per read).

```bash
wc -l barcode57.fastq barcode58.fastq
```

## 9. Key Take-Home Messages

1. Assembly is the bridge between raw sequencing output and interpretable genomes.
2. De novo and reference-based assembly solve different biological questions.
3. Tool choice depends strongly on read type and study objective.
4. Strong folder structure and clear command history are as important as the assembler itself.

In the next lessons, you will run a complete long-read de novo pipeline and then a reference-guided workflow.
