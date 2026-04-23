---
title: "Lesson 1 — What Is a Bash Script and Why Use One?"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Describe the problem that Bash scripts solve
- Explain what a Bash script is in plain language
- Recognise what a simple script looks like before writing one

---

## 1. The Problem of Repetition

Imagine you have just received sequencing data for a project: 20 FASTQ files, one for each sample. Your first task is quality control — running FastQC on every file.

So you open the terminal and start typing:

```bash
fastqc Training/short_reads/paired/SRR1553607_1.fastq
```

Then the second file:

```bash
fastqc Training/short_reads/paired/SRR1553607_2.fastq
```

And so on, 18 more times.

This approach has several problems:

- **It is slow.** Typing 20 commands takes time, even with copy-paste.
- **It is error-prone.** One mistyped filename and you have run quality control on the wrong file — or no file at all.
- **It is not reproducible.** Six months later, your collaborator asks exactly which files you ran. You will not remember.
- **It does not scale.** What happens when the next project has 200 samples?

There is a better way.

---

## 2. What Is a Bash Script?

A Bash script is a plain text file that contains a list of commands. When you run the script, Bash reads the file from top to bottom and executes each command in order — exactly as if you had typed them yourself.

That is the whole idea. There is no magic here. A script is just a saved list of commands.

Here is what a simple script looks like:

```bash
#!/bin/bash

echo "Starting quality control..."
fastqc Training/short_reads/paired/SRR1553607_1.fastq
fastqc Training/short_reads/paired/SRR1553607_2.fastq
echo "Done."
```

You will learn exactly what each part of this script means in the lessons that follow. For now, notice that it looks almost identical to the commands you already know — because it is.

---

## 3. Why Scripts Matter in Bioinformatics

Bash scripts are not just a convenience. In bioinformatics, they serve several important purposes:

**Reproducibility.** A script is a record of exactly what you ran, in what order, on which files. This matters when you need to re-run an analysis, when a reviewer asks for your methods, or when a collaborator needs to repeat your work.

**Automation.** Once a script works on two files, making it work on two hundred is a small change. You will see how in Lesson 4.

**Fewer mistakes.** Typing the same command 20 times introduces 20 opportunities for a typo. Running a script introduces one.

**A foundation for more.** Every bioinformatics pipeline — from simple QC checks to whole-genome assembly workflows — is built on scripts. Learning to write them opens up the entire field.

---

## 4. What You Will Build in This Module

By Lesson 5, you will have written a script that:

1. Stores a folder path in a variable
2. Loops over every FASTQ file in that folder
3. Extracts a clean sample name from each filename
4. Runs FastQC on each file
5. Prints a message confirming each file was processed

It will look like this:

```bash
#!/bin/bash

DATA_DIR="Training/short_reads/paired"

for FILE in $DATA_DIR/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Processing: $SAMPLE"
    fastqc $FILE
done

echo "All samples processed."
```

If any part of this looks unfamiliar right now, that is expected. Each concept — variables, `basename`, loops — gets its own lesson. By the time you reach Lesson 5, every line will make sense.

---

## Summary

- A Bash script is a text file containing commands that Bash executes in order
- Scripts solve the problem of repetition: run many files with one command
- In bioinformatics, scripts improve reproducibility, reduce errors, and enable automation
- This module builds toward a complete script step by step

In the next lesson, you will write your very first script and learn the most important line it must contain.
