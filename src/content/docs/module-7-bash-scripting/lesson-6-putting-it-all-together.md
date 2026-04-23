---
title: "Lesson 6 — Putting It All Together"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Build a complete Bash script from scratch using all concepts from this module
- Describe the purpose of every line in the finished script
- Run the script on real Training data and verify the output

---

## 1. What We Are Building

In this lesson, you will write a script that brings together every concept from Lessons 1–5:

1. Defines the location of the input data, the output folder, and the log file as variables
2. Sets up automatic logging with `exec` so all output is captured without any extra effort
3. Creates the output folder
4. Loops over every FASTQ file in the input folder
5. Extracts a clean sample name using `basename`
6. Runs FastQC on each file
7. Prints a final message when all files are done

This is a real, useful bioinformatics script. The structure — define your paths, set up logging, loop over files, process each one — is a pattern you will reuse across many projects.

---

## 2. Planning Before Writing

Before opening a text editor, take a moment to think through the structure. This is the computational thinking from Module 6 in practice.

**What do I need?**
- The path to the Training data folder
- A folder for FastQC output
- A log file to record everything that ran
- A loop to handle each file

**What will the script do, step by step?**
1. Set variables for the input directory, output directory, and log file
2. Use `exec > >(tee $LOG_FILE) 2>&1` to capture all output automatically from here onwards
3. Create the output directory
4. Print an opening message
5. Loop over `.fastq` files — for each: extract the sample name, run FastQC, print a progress message
6. Print a final message when the loop ends

---

## 3. Building the Script Step by Step

Create a new file:

```bash
nano run_fastqc.sh
```

### Step 1 — The shebang line

```bash
#!/bin/bash
```

### Step 2 — Variables for input, output, and the log

```bash
DATA_DIR="Training/short_reads/paired"
OUTPUT_DIR="fastqc_results"
LOG_FILE="run_log.txt"
```

Store all three paths as variables at the top. If anything needs to change — input folder, output folder, log name — you update it here and nowhere else.

### Step 3 — Set up logging with exec

```bash
exec > >(tee $LOG_FILE) 2>&1
```

This single line redirects all subsequent output — every `echo`, every tool message, and every error — to both the terminal and `$LOG_FILE` simultaneously. You do not need `>>` or `| tee` on any individual line after this.

### Step 4 — Create the output directory and print the opening message

```bash
mkdir -p $OUTPUT_DIR
echo "FastQC run started"
```

`mkdir -p` creates the output directory safely — no error if it already exists. The `echo` prints to the terminal and is automatically captured to the log by the `exec` line above.

### Step 5 — The loop

```bash
for FILE in $DATA_DIR/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Processing: $SAMPLE"
    fastqc $FILE --outdir $OUTPUT_DIR
done
```

On each pass through the loop:
- `$FILE` holds the full path to one FASTQ file
- `$SAMPLE` holds the clean sample name extracted by `basename`
- `echo` prints a progress message that is automatically captured in the log
- `fastqc` runs on that file, saving results to `$OUTPUT_DIR`

### Step 6 — Final message

```bash
echo "All samples processed. Results in: $OUTPUT_DIR"
```

Prints to the terminal and goes to the log — no extra redirection needed.

---

## 4. The Complete Script

```bash
#!/bin/bash

# --- Configuration ---
DATA_DIR="Training/short_reads/paired"
OUTPUT_DIR="fastqc_results"
LOG_FILE="run_log.txt"

# --- Logging: capture everything from here onwards ---
exec > >(tee $LOG_FILE) 2>&1

# --- Setup ---
mkdir -p $OUTPUT_DIR
echo "FastQC run started"

# --- Process each sample ---
for FILE in $DATA_DIR/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Processing: $SAMPLE"
    fastqc $FILE --outdir $OUTPUT_DIR
done

# --- Done ---
echo "All samples processed. Results in: $OUTPUT_DIR"
```

---

## 5. Running the Script

Save the file, make it executable, and run it:

```bash
chmod +x run_fastqc.sh
./run_fastqc.sh
```

Expected terminal output (FastQC also prints its own messages between these lines):

```
FastQC run started
Processing: SRR1553607_1
Processing: SRR1553607_2
All samples processed. Results in: fastqc_results
```

After it finishes, check the FastQC output files:

```bash
ls fastqc_results/
```

You should see HTML and zip files for each sample:

```
SRR1553607_1_fastqc.html
SRR1553607_1_fastqc.zip
SRR1553607_2_fastqc.html
SRR1553607_2_fastqc.zip
```

Check the log file:

```bash
cat run_log.txt
```

Because `exec` captures everything, the log will contain your `echo` messages and the FastQC tool output together — a complete record of the run.

---

## 6. What You Have Built

Every concept from this module is present in this script:

| Concept | Where in the script |
|---------|-------------------|
| Shebang line | Line 1: `#!/bin/bash` |
| Variables | `DATA_DIR`, `OUTPUT_DIR`, `LOG_FILE` |
| `basename` | Extracts clean sample name from the full file path |
| Command substitution `$()` | `SAMPLE=$(basename $FILE .fastq)` |
| For loop | Loops over every `.fastq` file in `DATA_DIR` |
| `exec > >(tee $LOG_FILE) 2>&1` | Captures all output — stdout and stderr — to terminal and log |

---

## 7. Adapting the Script

The power of this structure is how easily it adapts:

- **Different input folder:** change the value of `DATA_DIR`
- **Different output folder:** change the value of `OUTPUT_DIR`
- **Different log file:** change the value of `LOG_FILE`
- **Different tool:** replace `fastqc $FILE --outdir $OUTPUT_DIR` with any command
- **More files:** drop additional `.fastq` files into `DATA_DIR` — the script picks them up automatically next time you run it

The script does not need to know in advance how many files exist. It finds them, processes them, and records them — however many there are.

---

## Summary

- A complete script combines shebang, variables, `basename`, a loop, and logging
- `exec > >(tee $LOG_FILE) 2>&1` at the top captures all output automatically — no `>>` or `| tee` needed on individual lines
- `mkdir -p` creates a directory safely — no error if it already exists
- Storing all paths as variables at the top makes the script easy to read and adapt
- The loop structure scales from 2 files to 2000 with no changes to the script

You have now written a real bioinformatics script. Work through the exercises to build confidence with these concepts before moving on.
