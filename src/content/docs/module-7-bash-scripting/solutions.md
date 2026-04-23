---
title: "Module 7 — Solutions"
---


---

## Exercise 1 — Your First Script

```bash
#!/bin/bash

echo "Alex"
date
echo "Ready to do bioinformatics."
```

**Notes:**
- `date` is a command, not a string — no quotes needed.
- The shebang must be the very first line, with no blank lines or spaces before it.
- Your name goes in the `echo` line — replace `Alex` with your own.

---

## Exercise 2 — Variables and basename

```bash
#!/bin/bash

INPUT="Training/short_reads/paired/SRR1553607_2.fastq"
SAMPLE=$(basename $INPUT .fastq)

echo "Full path: $INPUT"
echo "Sample name: $SAMPLE"
```

**Notes:**
- `$(basename $INPUT .fastq)` runs `basename` with two arguments: the value of `$INPUT` and the extension `.fastq` to strip.
- The result is captured by `$()` and stored directly in `SAMPLE`.
- The `echo` lines mix literal text and variable values — Bash replaces `$INPUT` and `$SAMPLE` before printing.

---

## Exercise 3 — A Simple Loop

```bash
#!/bin/bash

for FILE in Training/short_reads/paired/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Found sample: $SAMPLE"
done
```

**Notes:**
- `*.fastq` matches all files ending in `.fastq` at that path. Bash expands it automatically.
- `$FILE` holds the full path on each pass; `basename` extracts the clean name.
- The output format `Found sample: $SAMPLE` matches what was asked for — check that your `echo` line uses exactly that text.

---

## Exercise 4 — Log Files

```bash
#!/bin/bash

LOG="sample_list.txt"

echo "Sample list" > $LOG

for FILE in Training/short_reads/paired/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "$SAMPLE" >> $LOG
done

echo "Log saved to: sample_list.txt"
```

**Notes:**
- `> $LOG` creates a fresh file and writes the header line. If you accidentally used `>>` here, the header would be appended to whatever was already in the file from a previous run.
- `>> $LOG` inside the loop adds each sample name without overwriting the header or previous entries.
- The final `echo` goes to the terminal, not the log — no `>` or `>>` means the output prints to the screen as normal.

---

## Exercise 5 — Capturing All Output with exec

```bash
#!/bin/bash

LOG_FILE="full_run.log"

exec > >(tee $LOG_FILE) 2>&1

echo "Run started"

for FILE in Training/short_reads/paired/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Processing: $SAMPLE"
done

echo "Run finished"
```

**Notes:**
- `exec > >(tee $LOG_FILE) 2>&1` must come before any commands whose output you want captured — placing it right after the variable declarations is the standard pattern.
- There are no `>>` or `| tee` on any individual line. The `exec` line handles everything.
- When you swap to `exec 2> errors.log`, the `echo` messages still print to the terminal normally — only error messages (from failed commands) would be written to `errors.log`. With no errors in this simple loop, `errors.log` will be empty or absent.

---

## Exercise 6 — Build Your Own Pipeline Script

```bash
#!/bin/bash

DATA_DIR="Training/short_reads/paired"
OUTPUT_DIR="my_fastqc_output"
LOG_FILE="my_run_log.txt"

exec > >(tee $LOG_FILE) 2>&1

mkdir -p $OUTPUT_DIR

for FILE in $DATA_DIR/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Quality checking: $SAMPLE"
    fastqc $FILE --outdir $OUTPUT_DIR
done

echo "Pipeline complete."
```

**Notes:**
- Using `exec` here means the script no longer needs any `>>` or `| tee` lines — all output, including any FastQC messages and errors, goes to both the terminal and `$LOG_FILE` automatically.
- `echo "Pipeline complete."` sits after `done` so it runs once, not once per file.
- Compare this to the Exercise 5 solution from the previous version that used manual `>>` — `exec` gives the same result with less effort and also captures errors that `>>` would have missed.
