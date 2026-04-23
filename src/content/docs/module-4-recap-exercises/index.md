---
title: "Module 4: Recap Exercises"
---


## Overview

This module brings together everything from Modules 1–3. There are no new concepts to learn — instead, you will apply what you already know to increasingly challenging problems, all using real data from the `Training/` folder.

The exercises are designed for **class discussion**. There is often more than one correct answer. The goal is not just to get the right output, but to be able to explain *why* you chose your approach and what tradeoffs exist.

---

## How to Use This Module

- Work through each exercise set in order — they build on each other.
- Discuss your approach with the class **before** running any commands.
- When you disagree with a classmate's approach, try both and compare the results.
- The Solutions file is there to check your work, not to shortcut the thinking.

---

## Exercise Sets

| File | Difficulty | Topics |
|------|------------|--------|
| [Exercise_1_Linux_Foundations.md](Exercise_1_Linux_Foundations.md) | Easy → Medium | Navigation, file inspection, permissions |
| [Exercise_2_Text_Processing.md](Exercise_2_Text_Processing.md) | Medium | Pipes, grep, sort, counting reads |
| [Exercise_3_Conda_and_Environments.md](Exercise_3_Conda_and_Environments.md) | Medium | Conda concepts, environments, channels |
| [Exercise_4_Omics_Integration.md](Exercise_4_Omics_Integration.md) | Hard → Challenge | Full omics workflows, QC, assembly |
| [Solutions.md](Solutions.md) | — | All solutions with explanations |

---

## Training Data Reference

All exercises use files in the `Training/` folder:

```
Training/
├── long_reads/
│   ├── barcode57.fastq       # Nanopore reads, 34,268 lines (8,567 reads)
│   ├── barcode58.fastq       # Nanopore reads, 36,784 lines (9,196 reads)
│   └── sample3.fastq         # Nanopore reads, 11,880 lines (2,970 reads)
└── short_reads/
    ├── paired/
    │   ├── SRR1553607_1.fastq  # Illumina forward reads, 203,445 reads
    │   └── SRR1553607_2.fastq  # Illumina reverse reads, 203,445 reads
    └── unpaired/
        ├── SRR11282407_Case.fastq.gz
        ├── SRR11282408_Healthy.fastq.gz
        ├── SRR11282409_Healthy.fastq.gz
        ├── SRR11282410_Case.fastq.gz
        ├── SRR11282411_Healthy.fastq.gz
        ├── SRR11282412_Case.fastq.gz
        ├── SRR11282413_Healthy.fastq.gz
        └── download.sh
```

> **Tip:** Set a variable at the start of your session to save typing:
> ```bash
> TRAINING=~/path/to/Training
> ```

---

## Difficulty Scale

- **Easy** — One command, covered directly in class
- **Medium** — Requires combining 2–3 concepts
- **Hard** — Requires thinking about the problem before writing any commands
- **Challenge** — Open-ended; there is no single correct answer
