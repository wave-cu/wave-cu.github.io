---
title: "Module 6 — Computational Thinking for Bioinformatics"
---


## Module Overview

Every tool you have used so far — FastQC, Flye, Minimap2, BLAST — was built by someone who first sat down and thought carefully about a biological problem before writing a single line of code. That thinking process has a name: **computational thinking**.

This module steps back from the command line and asks a more fundamental question: **how do you approach a problem you have never seen before?** Whether you are assembling a new viral genome, designing a GWAS pipeline, or interpreting an RNA-Seq dataset, the same four cognitive tools are at work. This module names them, dissects them, and trains you to apply them deliberately.

By the end of this module, you will not just run pipelines — you will design them.

---

## Why This Module Exists

Modules 1–5 gave you technical skills: Linux navigation, environment management, quality control, genome assembly, and a complete project from raw reads to a phylogenetic tree. What they could not fully address is the meta-skill that ties all of these together: **structured problem-solving under uncertainty**.

Real bioinformatics problems are messy. Data is contaminated. Tools crash. Reference databases are incomplete. The "correct" approach is rarely obvious, and there are almost always multiple valid solutions with different trade-offs. This module gives you a framework for navigating that uncertainty systematically.

---

## Learning Objectives

By the end of this module, you will be able to:

- Define computational thinking and distinguish it from programming
- Apply the four principles — decomposition, pattern recognition, abstraction, and algorithm design — to novel bioinformatics problems
- Systematically break down complex problems into tractable sub-problems
- Recognise recurring patterns across different biological domains
- Decide which details are essential and which can be safely ignored when designing an analysis
- Evaluate multiple algorithms for the same problem and justify your choice based on real-world constraints
- Debug iteratively and recover from unexpected results without abandoning the overall approach

---

## Lessons

| Lesson | Title | Focus |
|--------|-------|-------|
| 1 | Introduction to Computational Thinking | What it is, why it matters, and how it differs from coding |
| 2 | Core Principles and Bioinformatics | Detailed exposition of all four principles with biological examples |
| 3 | Decomposition and Pattern Recognition in Action | Deep dives with worked examples from viral assembly and GWAS |
| 4 | Abstraction and Algorithm Design | What to ignore, how to choose, and trade-off analysis |
| 5 | Computational Thinking in Action | Integrated case studies and the messy reality of real projects |

---

## Supporting Materials

| File | Purpose |
|------|---------|
| `Exercises.md` | Four structured exercises with graduated difficulty |
| `Solutions.md` | Complete answer keys and worked explanations |
| `Appendix_Pitfalls_and_Debugging.md` | Common mistakes, failure modes, and how to recover |


---

## Connection to Previous Modules

This module is explicitly retrospective. At every stage, we will revisit decisions you already made:

- In **Module 3**, you chose between de novo and reference-based assembly — that was abstraction and algorithm design.
- In **Module 4**, you debugged coverage estimates and compared file formats — that was decomposition.
- In **Module 5**, you designed your own pipeline from scratch — that was computational thinking applied in full.

You were already doing this. Now you will do it consciously.

---

## Module Toolbox

No new software is required for this module. All concepts are illustrated using tools you have already installed in the `bioinfo` conda environment:

```bash
conda activate bioinfo
```

Tools referenced: `fastqc`, `multiqc`, `minimap2`, `samtools`, `flye`, `blast`, `bwa`, `gatk`, `trinity`

---

> **A note on "right answers":** This module deliberately avoids presenting single correct solutions. Many problems in bioinformatics have multiple valid approaches. Your goal is not to find *the* answer, but to make a *justified* choice and know when to revise it.
