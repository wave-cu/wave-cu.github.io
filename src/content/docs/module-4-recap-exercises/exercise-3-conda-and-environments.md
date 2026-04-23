---
title: "Exercise Set 3: Conda and Environment Management"
---


**Difficulty:** Medium
**Topics:** Conda environments, channels, package installation, reproducibility

These exercises are mostly conceptual and command-design exercises — you may not be able to run all of them without a live internet connection, but you should be able to design the correct commands and explain what each one does.

---

## Exercise 4.1 — Diagnosing Your Setup (Medium)

Before you can run any bioinformatics tools, you need to check that your environment is set up correctly.

1. What command tells you:
   - Whether Conda is installed?
   - Which version of Conda you have?
   - Which Conda environment is currently active?
   - What environments are available on your system?

2. Run each of these commands. What do you see?

3. What does it mean when you see `(base)` at the start of your terminal prompt?

> **Discussion:** Why is it bad practice to install all bioinformatics tools into the `base` environment? What is the risk?

---

## Exercise 4.2 — Choosing the Right Channels (Medium)

You need to install `FastQC` and `MultiQC` to analyse the unpaired samples.

1. Which Conda channels provide bioinformatics tools like FastQC and MultiQC?
2. Write the command to configure your channels so that `bioconda` and `conda-forge` are checked before `defaults`.
3. Write the command to verify your channel configuration was applied.
4. Why is the **order** of channels important? What happens if `defaults` is listed first?

> **Discussion:** A colleague tells you "I just use `conda install fastqc` and it works fine." What potential problems might they not be aware of, especially in an institutional or collaborative setting?

---

## Exercise 4.3 — Creating a Reproducible Environment (Medium)

1. Write the commands to create a new environment called `qc_env` with Python 3.10, then install FastQC and MultiQC into it from the correct channels.

2. How do you activate this environment? How do you deactivate it?

3. Once your environment is set up, what command exports it so a colleague can recreate it exactly?

4. Your colleague receives the `environment.yml` file. What single command do they run to recreate your environment?

> **Discussion:** What is the difference between `conda env export` and `conda env export --no-builds`? Which would you share across different operating systems, and why?

---

## Exercise 4.4 — Debugging a Bad Install (Medium)

A colleague runs the following and gets an error:

```bash
conda install minimap2 samtools
```

They see a conflict resolution error and the install fails.

1. List three different strategies they could try to fix this, in the order you would attempt them.
2. They also forgot to activate their environment first. They are currently in `(base)`. What did they accidentally do?
3. What command tells you exactly which packages are installed in the currently active environment?

> **Discussion:** Why do version conflicts happen more often in bioinformatics than in general programming? Think about what kinds of dependencies bioinformatics tools have.

---

## Exercise 4.5 — Environment Strategy (Medium)

Consider the following scenarios. For each, decide: **one shared environment** or **separate environments**? Justify your answer.

1. You are running FastQC for QC, then Trimmomatic for trimming, then FastQC again to check the result. These are all part of the same QC pipeline.

2. You are working on two projects: one uses `samtools 1.15` and another requires `samtools 1.9` because an old script breaks with newer versions.

3. You want to run both assembly (Flye) and variant calling (bcftools) as part of a single end-to-end pipeline.

4. You are testing whether a new version of a tool gives different results from the old version.

> **Discussion:** What is the cost of having too many environments? What is the cost of having too few?

---

## Exercise 4.6 — Connecting Conda to the Omics Workflow (Medium)

Looking at the Module 3 workflow:

1. List all the tools mentioned across Module 3 lessons (FastQC, MultiQC, Flye, etc.). Write the `conda install` command you would use to install all of them at once into a single environment called `bioinfo`.

2. After building your environment, how would you save it for future use?

3. Suppose you run `flye --version` and get `command not found`. What are two possible reasons for this error? What would you check first?

> **Discussion:** If you had to hand off your entire analysis to a new lab member who has never used Conda, what three commands or files would you give them to get started? Why those three?
