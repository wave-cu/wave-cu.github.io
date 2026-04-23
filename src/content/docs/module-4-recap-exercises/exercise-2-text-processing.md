---
title: "Exercise Set 2: Text Processing and Pipelines"
---


**Difficulty:** Medium → Hard
**Topics:** `grep`, `wc`, `sort`, `uniq`, pipes (`|`), redirection (`>`, `>>`), `zcat`

The real power of Linux in bioinformatics is chaining commands together. These exercises focus on building pipelines — step by step — to extract meaningful information from the Training data.

---

## Exercise 2.1 — Counting Sample Types (Medium)

The unpaired samples in `Training/short_reads/unpaired/` are named with their condition embedded in the filename.

1. Without opening any file, how many **Case** samples are there? How many **Healthy** samples? Use `ls` and `grep` together.
2. Write the commands to count each group. Show the pipeline, not just the final number.
3. A colleague writes this command:
   ```bash
   ls Training/short_reads/unpaired/ | grep -c Case
   ```
   Does this give the same result as your approach? Is there any situation where it might give a different answer?

> **Discussion:** What is the `-c` flag in `grep`? Is it safer than piping to `wc -l`? Why or why not?

---

## Exercise 2.2 — Working with Compressed Files (Medium)

The unpaired FASTQ files are compressed with gzip (`.fastq.gz`). You cannot use `cat` or `head` directly on them.

1. What command do you use to view the contents of a `.fastq.gz` file without decompressing it permanently?
2. Display the first 8 lines (two complete reads) of `SRR11282407_Case.fastq.gz`.
3. How many reads are in `SRR11282407_Case.fastq.gz`? Hint: you will need to pipe the output of `zcat` to `wc -l`.
4. Why might you prefer to keep files compressed rather than decompressing them? Give two reasons.

> **Discussion:** What is the tradeoff between storage efficiency and processing speed when working with compressed files in a large pipeline?

---

## Exercise 2.3 — Extracting Read Headers (Medium)

Every FASTQ read starts with a header line beginning with `@`.

1. Extract all header lines from `Training/long_reads/barcode57.fastq` using `grep`.
2. How many header lines did you get? Does this match the read count you calculated in Exercise 1.2?
3. Now look carefully at this: the quality score line (line 4) also sometimes starts with `@` because `@` is a valid Phred ASCII character. Run the following and compare the count:
   ```bash
   grep -c "^@" Training/long_reads/barcode57.fastq
   ```
   Is the count the same as expected? For this file, does it matter? Why might it matter for other files?

> **Discussion:** If you needed to reliably extract headers from any FASTQ file (not just this one), what approach would be more robust than `grep "^@"`?

---

## Exercise 2.4 — Sorting and Deduplication (Medium)

1. List all files in `Training/short_reads/unpaired/` sorted by **file size** (largest first). Which flag does `ls` need?
2. Now extract just the filenames (no size or date) sorted alphabetically. Use `ls` piped to `sort`.
3. Suppose you have a list of sample IDs and you want to know how many are unique. Create a small test:
   ```bash
   echo -e "Sample1\nSample2\nSample1\nSample3\nSample2" | sort | uniq -c | sort -rn
   ```
   Interpret the output. What does each column mean? What does `sort -rn` do?

> **Discussion:** In what bioinformatics context would you use `sort | uniq -c`? Give a real example from the Training data.

---

## Exercise 2.5 — Building a Read Summary Pipeline (Hard)

You want to quickly summarise how many reads are in each long-read file without opening each one individually.

1. Write a pipeline that prints, for each file in `Training/long_reads/`, the **filename** and **number of reads** side by side. Your output should look like:
   ```
   barcode57.fastq  8567
   barcode58.fastq  9196
   sample3.fastq    2970
   ```
2. Now redirect this output to a file called `read_counts.txt` in your current directory.
3. What is the difference between `>` and `>>`? Show what happens when you run your pipeline twice using each operator.

> **Discussion:** How would you modify this pipeline if you also wanted to include the file size next to the read count?

---