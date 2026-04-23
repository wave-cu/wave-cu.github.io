---
title: "Exercise Set 1: Linux Foundations"
---


**Difficulty:** Easy → Medium
**Topics:** Navigation, file inspection, counting, permissions, paths

These exercises revisit the core Linux skills from Module 1. They look simple — but pay attention to the discussion questions. Understanding *why* a command works the way it does is more valuable than just knowing the command.

---

## Exercise 1.1 — Finding Your Bearings (Easy)

Before doing anything else, answer these questions without running any commands:

1. If your terminal opens in your home directory (`~`), write the **absolute path** and the **relative path** you would use to navigate to `Training/long_reads/`.
2. What is the difference between `ls Training/` and `ls -lh Training/`? When would you prefer each?
3. Without running it, what do you think `ls -lhR Training/` does? What does the `-R` flag mean?

Now run all three commands and check your predictions.

> **Discussion:** Why is knowing your current directory so important when writing scripts?

---

## Exercise 1.2 — Counting Reads (Easy)

You know that FASTQ files store each read as exactly 4 lines.

1. Run the following command and interpret the output:
   ```bash
   wc -l Training/long_reads/barcode57.fastq
   ```
2. How many **reads** are in `barcode57.fastq`? Show your calculation.
3. Do the same for `barcode58.fastq` and `sample3.fastq`.
4. What single command gives you line counts for all three files at once?

> **Discussion:** If `wc -l` gave you an odd number, what would that tell you about the file?

---

## Exercise 1.3 — Inspecting a FASTQ Record (Easy)

A FASTQ record has 4 lines:
- Line 1: Read header (starts with `@`)
- Line 2: Sequence
- Line 3: Separator (starts with `+`)
- Line 4: Quality scores

1. Display the **first complete read** from `barcode57.fastq` using `head`.
2. Display the **last complete read** from `barcode57.fastq` using `tail`.
3. Now display the first read from `Training/short_reads/paired/SRR1553607_1.fastq`.

> **Discussion:** Look at the headers of the Nanopore reads vs. the Illumina reads. What information do they each contain? What does that tell you about the sequencing platform?

---

## Exercise 1.4 — Comparing Two Files (Medium)

The paired-end Illumina files `SRR1553607_1.fastq` and `SRR1553607_2.fastq` should have the same number of reads.

1. Confirm this is the case using a single command that checks both files at once.
2. Why is it important that paired files have equal read counts? What goes wrong in an analysis if they don't?
3. Now check: do both files have exactly the same first read header? Use `head -n 1` on each file.

> **Discussion:** In a real project, at what point in your pipeline would you check this? Before or after trimming? Why?

---

## Exercise 1.5 — File Permissions and Scripts (Medium)

1. Look at the permissions on `Training/short_reads/unpaired/download.sh`:
   ```bash
   ls -l Training/short_reads/unpaired/download.sh
   ```
   Can you run this file directly as a script? How do you know?

2. Read the contents of `download.sh` with `cat`. What does it do?

3. Suppose you created a new script called `count_reads.sh` in your home directory. What single command would make it executable?

4. What is the difference between running:
   ```bash
   bash count_reads.sh
   ```
   and:
   ```bash
   ./count_reads.sh
   ```
   When does the distinction matter?

> **Discussion:** Why would a script work when called with `bash script.sh` but fail with `./script.sh`? What are two different reasons this could happen?

---

## Exercise 1.6 — Absolute vs. Relative Paths (Medium)

Consider this scenario: you have a script at `~/scripts/summarise.sh` that processes files in `~/Training/long_reads/`.

1. Inside the script, which path style — absolute or relative — is safer? Why?
2. Write the absolute path to `barcode57.fastq` on your system.
3. From the `Training/short_reads/` directory, write a **relative path** to `barcode57.fastq` without using `cd`.
4. What does `../` mean in a path? Give an example using the Training folder structure.

> **Discussion:** Imagine sharing your script with a colleague. They have the same `Training/` folder structure but in a different location on their machine. How do you write the script so it works for both of you?
