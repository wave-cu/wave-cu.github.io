---
title: "Lesson 1: What Is Conda and Why We Use It"
---

## What is Conda

Conda is a package manager and environment manager. It installs software and all required dependencies into isolated environments. This is especially helpful in bioinformatics where tools often depend on compiled libraries and specific versions of system packages.

### What Conda does for you

- Installs command-line tools and libraries without compiling from source
- Keeps tools isolated in project-specific environments
- Makes it easier to reproduce analyses on another machine

## Conda vs `pip` and `venv`

`pip` and `venv` are great for Python-only workflows, but they do not manage non-Python dependencies well. Many bioinformatics tools are not pure Python; they require system libraries and compiled binaries.

- `venv` creates a Python-only environment
- `pip` installs Python packages from PyPI
- Conda installs Python and non-Python packages together

## Why `pip` is insufficient for bioinformatics

Bioinformatics tools often depend on C/C++ libraries, aligners, and file format libraries. Installing them with `pip` alone can lead to missing dependencies, build errors, or inconsistent versions.

Examples of tools that are difficult or impossible to install with `pip` alone include:

- `samtools`
- `bowtie2`
- `minimap2`
- `blast`
- `fastqc`
- `multiqc`
- `plink`
  

Conda provides prebuilt binaries for these tools, making installation reliable.

## Check your Conda installation

This command prints the Conda version and confirms that it is installed and on your PATH.

```bash
conda --version
```

If Conda is installed, you should see output similar to:

```
conda 23.x.x
```
