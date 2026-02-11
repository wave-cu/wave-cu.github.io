---
title: "Lesson 3 - Scripting and Permissions"
---

## Learning Objectives
- Create simple bash scripts with variables and loops.
- Edit scripts using `nano`.
- Run scripts using relative paths from different directories.
- Interpret file permissions with `ls -l`.
- Make a script executable with `chmod`.

## Conceptual Overview
A bash script is a plain text file containing a sequence of commands. Scripts help you repeat analyses, reduce mistakes, and keep a record of what you did. The first line (shebang) tells Linux which interpreter to use. File permissions control who can read, write, or execute a file.

In bioinformatics, scripts often summarize datasets, run tools in loops, or organize outputs into consistent folders.

## Worked Examples

### 1) Inspect permissions
`ls -l` uses the `-l` option for a long listing with permissions, size, and timestamps.
```bash
ls -l Training/short_reads/paired
```
Output:
```
total 109600
drwxrwxrwx 1 bodeoni bodeoni     4096 Jan 16 16:45 SRR1553607
-rwxrwxrwx 1 bodeoni bodeoni 56113290 Jan 16 11:34 SRR1553607_1.fastq
-rwxrwxrwx 1 bodeoni bodeoni 56113290 Jan 16 11:34 SRR1553607_2.fastq
```

### 2) Create a script with `nano`
`nano` opens a simple text editor in the terminal.
```bash
nano Module_1_Linux/summarize_fastq.sh
```
Paste the script below into `nano` (save with `Ctrl+O`, exit with `Ctrl+X`):
This script uses `wc -l` to count lines and `head -n 1` to show the first header line.
```bash
#!/usr/bin/env bash

FILES=(
  "Training/short_reads/paired/SRR1553607_1.fastq"
  "Training/long_reads/barcode57.fastq"
)

for f in "${FILES[@]}"; do
  echo "FILE: $f"
  echo "LINES: $(wc -l < "$f")"
  head -n 1 "$f"
  echo ""
done
```

### 3) Run the script with `bash`
`bash` runs the script using the Bash interpreter.
```bash
bash Module_1_Linux/summarize_fastq.sh
```
Output:
```
FILE: Training/short_reads/paired/SRR1553607_1.fastq
LINES: 813780
@SRR1553607.1 1 length=101

FILE: Training/long_reads/barcode57.fastq
LINES: 34268
@5832c8b6-696e-46cd-be8d-73b789952b4e	st:Z:2024-06-27T02:52:17.771+00:00	RG:Z:fba2136ff67b57066e5c7e23383eba9e075ff2b2_dna_r10.4.1_e8.2_400bps_sup@v4.3.0
```

### 4) Make the script executable
`chmod +x` adds the execute (`x`) permission.
No output appears when it succeeds.
```bash
chmod +x Module_1_Linux/summarize_fastq.sh
```

Now you can run it directly using a relative path.
```bash
./Module_1_Linux/summarize_fastq.sh
```

## Exercises
1) Create a script named `fastq_summary.sh` in `Module_1_Linux/` that loops over all FASTQ files in `Training/long_reads` and prints:
- filename
- line count
- first header line

2) Run the script from the `Module_1_Linux/` directory using a relative path.

3) Make your script executable and run it without calling `bash` explicitly.

4) Create a `results/` folder inside `Module_1_Linux/` and redirect the script output to `results/long_reads_summary.txt`.

5) Challenge: Extend your script to include `Training/short_reads/paired/SRR1553607_1.fastq` and `Training/short_reads/paired/SRR1553607_2.fastq`, and print an estimated read count for each (lines / 4).

## Solutions

### Solution 1
`nano` opens the file so you can paste the script.
```bash
nano Module_1_Linux/fastq_summary.sh
```
Script content:
```bash
#!/usr/bin/env bash

for f in Training/long_reads/*.fastq; do
  echo "FILE: $f"
  echo "LINES: $(wc -l < "$f")"
  head -n 1 "$f"
  echo ""
done
```

### Solution 2
`./` runs a script from the current directory.
```bash
cd Module_1_Linux
bash ./fastq_summary.sh
```

### Solution 3
`chmod +x` makes the script executable.
```bash
chmod +x Module_1_Linux/fastq_summary.sh
./fastq_summary.sh
```

### Solution 4
`mkdir -p` creates the folder, and `>` redirects output to a file.
```bash
mkdir -p Module_1_Linux/results
Module_1_Linux/fastq_summary.sh > Module_1_Linux/results/long_reads_summary.txt
```

### Solution 5
Use `wc -l` for lines and divide by 4 for reads.
```bash
#!/usr/bin/env bash

FILES=(
  "Training/long_reads/barcode57.fastq"
  "Training/long_reads/barcode58.fastq"
  "Training/long_reads/sample3.fastq"
  "Training/short_reads/paired/SRR1553607_1.fastq"
  "Training/short_reads/paired/SRR1553607_2.fastq"
)

for f in "${FILES[@]}"; do
  lines=$(wc -l < "$f")
  reads=$((lines / 4))
  echo "FILE: $f"
  echo "READS: $reads"
  head -n 1 "$f"
  echo ""
done
```
