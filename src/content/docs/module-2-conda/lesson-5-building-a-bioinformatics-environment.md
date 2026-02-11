---
title: "Lesson 5: Building a Bioinformatics Environment"
---

## Create a bioinformatics environment

This command creates a new environment called `bioinfo` with Python 3.9.

```bash
conda create -n bioinfo python=3.9
```

## Activate the environment

This command activates the environment so all installs go into `bioinfo`.

```bash
conda activate bioinfo
```

## Install core bioinformatics tools

This command installs a standard set of tools used in many workflows. Here is a quick summary of what each tool is used for:

- `samtools`: Manipulates SAM/BAM/CRAM alignment files (view, sort, index)
- `seqkit`: Fast toolkit for inspecting and transforming FASTA/FASTQ files
- `fastqc`: Quality control reports for raw sequencing reads
- `multiqc`: Aggregates QC reports from many samples into one summary
- `minimap2`: Aligns long reads or assemblies to a reference genome
- `blast`: Finds sequence similarity against reference databases
- `bowtie2`: Aligns short reads to a reference genome

```bash
conda install samtools seqkit fastqc multiqc minimap2 blast bowtie2
```

> Note: If you have not configured channels yet, complete Lesson 4 first to ensure reliable installs.

>_alternatively, you can specify channels directly:_
```bash
conda install -c conda-forge -c bioconda samtools seqkit fastqc multiqc minimap2 blast bowtie2
```
>_Remember we said many of the packages in the bioconda channel depend on packages in conda-forge. This is why the order of channels matters._

## Verify each tool is installed

These commands check that each tool runs and reports a version.

```bash
samtools --version
seqkit version
fastqc --version
multiqc --version
minimap2 --version
blastn -version
bowtie2 --version
```

If each command prints a version number, the installation succeeded.

## Export the environment to a YAML file

This command writes the environment specification to a file that can be shared or reused.

```bash
conda env export -n bioinfo > bioinfo.yml
```

> Note: Keep this YAML file with your project to ensure reproducibility.

## Recreate the environment from YAML

This command creates a new environment from the exported file.

```bash
conda env create -f bioinfo.yml
```

After recreation, you can activate it the same way:

```bash
conda activate bioinfo
```

## Deactivate when finished

This command returns you to the base environment.

```bash
conda deactivate
```
