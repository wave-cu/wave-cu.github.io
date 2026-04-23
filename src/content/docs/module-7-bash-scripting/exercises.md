---
title: "Module 7 — Exercises"
---


These exercises follow the lessons in order. Each one builds on the previous. Work through them in sequence, and try to write each script from memory before looking at the lessons for reference.

---

## Exercise 1 — Your First Script

Write a script called `hello.sh` that:

1. Contains a correct shebang line
2. Prints your name
3. Prints the current date using the `date` command
4. Prints the message: `Ready to do bioinformatics.`

Make it executable and run it.

**Expected output (your name and date will differ):**

```
Alex
Wed 23 Apr 2026 10:00:00
Ready to do bioinformatics.
```

---

## Exercise 2 — Variables and basename

Write a script called `show_sample.sh` that:

1. Stores the path `Training/short_reads/paired/SRR1553607_2.fastq` in a variable called `INPUT`
2. Uses `basename` and `$()` to extract just the sample name — without the directory path or the `.fastq` extension — and stores it in a variable called `SAMPLE`
3. Prints both the full path and the clean sample name

**Expected output:**

```
Full path: Training/short_reads/paired/SRR1553607_2.fastq
Sample name: SRR1553607_2
```

---

## Exercise 3 — A Simple Loop

Write a script called `list_samples.sh` that:

1. Loops over every `.fastq` file in `Training/short_reads/paired/`
2. For each file, prints a line in this format:

```
Found sample: SRR1553607_1
Found sample: SRR1553607_2
```

Use `basename` inside the loop to get the clean sample name.

---

## Exercise 4 — Log Files

Write a script called `log_samples.sh` that:

1. Stores the log filename `sample_list.txt` in a variable called `LOG`
2. Uses `>` to write the line `Sample list` into the log file at the start
3. Loops over every `.fastq` file in `Training/short_reads/paired/`
4. For each file, uses `>>` to append the clean sample name to the log
5. Prints `Log saved to: sample_list.txt` to the terminal when finished

After running the script, check the contents of `sample_list.txt`. It should contain:

```
Sample list
SRR1553607_1
SRR1553607_2
```

---

## Exercise 5 — Capturing All Output with exec

Write a script called `exec_log.sh` that:

1. Defines a variable `LOG_FILE="full_run.log"`
2. Uses `exec > >(tee $LOG_FILE) 2>&1` to capture everything — stdout and stderr — to the terminal and the log file simultaneously
3. Prints `Run started`
4. Loops over every `.fastq` file in `Training/short_reads/paired/`, printing `Processing: [sample_name]` for each one
5. Prints `Run finished`

After running the script:
- Confirm the messages appeared in the terminal
- Confirm `full_run.log` contains the same messages

Then try this variation: change the `exec` line to `exec 2> errors.log` and run it again. Notice that normal output still prints to the terminal — only errors would be captured in `errors.log`.

---

## Exercise 6 — Build Your Own Pipeline Script

Write a script called `my_qc_pipeline.sh` that:

1. Defines `DATA_DIR`, `OUTPUT_DIR`, and `LOG_FILE` as variables at the top
2. Uses `exec > >(tee $LOG_FILE) 2>&1` so all output is captured automatically
3. Creates the output directory using `mkdir -p`
4. Loops over every `.fastq` file in `DATA_DIR`
5. For each file:
   - Prints `Quality checking: [sample_name]`
   - Runs `fastqc $FILE --outdir $OUTPUT_DIR`
6. Prints `Pipeline complete.` when the loop finishes

Write this script from scratch. Use Lesson 6 as a reference only if you are stuck.
