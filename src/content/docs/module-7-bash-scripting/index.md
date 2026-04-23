---
title: "Module 7 — Bash Scripting for Bioinformatics"
---


## Module Overview

Every time you have sat at the terminal and typed the same FastQC command for each sample, one after another, you have been doing work a script could do for you. A Bash script is nothing more than a list of commands saved in a file — but that simple idea unlocks something powerful: the ability to run the same analysis on ten, a hundred, or a thousand samples with a single command.

This module introduces Bash scripting from the ground up. No prior scripting experience is assumed. By the end, you will have written a real script that processes sequencing files from the Training folder — the same kind of script you will use every day as a bioinformatician.

---

## Why This Module Exists

In Modules 1–6 you learned to navigate Linux, manage environments, run quality control, assemble genomes, and think computationally about problems. Every tool you have used — FastQC, Minimap2, Flye — was controlled from the command line, one command at a time.

The next step is **automation**: writing down your workflow so you do not have to type it again. Bash scripting is how bioinformaticians do this. It is not programming in the traditional sense — you are simply saving the commands you already know into a file and letting Bash run them for you.

---

## Learning Objectives

By the end of this module, you will be able to:

- Explain what a Bash script is and why the shebang line is essential
- Create, make executable, and run a Bash script
- Use variables to store file paths and sample names
- Use `basename` to extract clean filenames and sample names from full paths
- Write a simple for loop to repeat a command across multiple files
- Use `>` and `>>` to save output to a log file
- Use `tee` to print output to the terminal and save it simultaneously
- Use `exec > >(tee logfile) 2>&1` to capture all output — including errors — with a single line at the top of a script
- Build a complete script that automates a real bioinformatics task

---

## Lessons

| Lesson | Title | Focus |
|--------|-------|-------|
| 1 | What Is a Bash Script and Why Use One? | The problem of repetition; what a script is; what you will build |
| 2 | Your First Script — The Shebang Line | Creating a script; the shebang; `chmod +x`; running with `./` |
| 3 | Variables and `basename` | Storing paths and names; extracting clean filenames |
| 4 | Simple For Loops | Repeating commands over a list of files |
| 5 | Saving Output to a Log File | `>` and `>>` redirection; `tee`; `exec > >(tee log) 2>&1` for full capture |
| 6 | Putting It All Together | A complete script using all concepts on real Training data |

---

## Supporting Materials

| File | Purpose |
|------|---------|
| `Exercises.md` | Hands-on exercises with graduated difficulty |
| `Solutions.md` | Complete worked solutions |

---

## Prerequisites

Before starting this module, you should be comfortable with:

- Basic Linux navigation (`cd`, `ls`, `pwd`) from Module 1
- Running tools from the command line (e.g., `fastqc`, `conda activate`)
- The concept of file paths (absolute and relative)

No scripting experience is required.

---

## Training Data

The scripts in this module use files from the `Training/` folder:

```
Training/short_reads/paired/SRR1553607_1.fastq
Training/short_reads/paired/SRR1553607_2.fastq
```

These are the same Illumina paired-end reads used in earlier modules.

---

## A Note on Simplicity

This module deliberately teaches a small, useful subset of Bash. There is much more to Bash scripting — conditional statements, functions, error handling — but these are not needed to write effective bioinformatics scripts at this stage, and adding them too early makes scripts harder to read and debug.

Learn these foundations well. Everything else builds on them.
