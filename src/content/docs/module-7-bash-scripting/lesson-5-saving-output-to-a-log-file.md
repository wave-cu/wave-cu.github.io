---
title: "Lesson 5 — Saving Output to a Log File"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Explain why saving script output matters
- Use `>` to redirect output to a file
- Use `>>` to append output to a file without overwriting it
- Explain the difference between `>` and `>>`
- Use `tee` to print output to the terminal and save it to a file at the same time
- Use `exec > >(tee logfile) 2>&1` to capture all script output — including errors — with a single line
- Describe the difference between stdout and stderr
- Choose the right logging approach for different situations

---

## 1. The Problem: Output That Disappears

When you run a script, progress messages appear in the terminal:

```
Processing: SRR1553607_1
Processing: SRR1553607_2
All samples processed.
```

But once you close the terminal — or scroll past it — that output is gone. There is no record of what ran, when it ran, or which files were processed.

For a two-file test this seems unimportant. In a real project with 50 samples, running overnight on a remote server, it matters a great deal. A log file gives you a permanent record that you can come back to at any time.

---

## 2. Redirecting Output with `>`

The `>` symbol redirects the output of a command into a file instead of printing it to the terminal.

Try this in your terminal:

```bash
echo "Run started" > run_log.txt
```

Nothing appears on screen. Instead, open the file:

```bash
cat run_log.txt
```

Output:

```
Run started
```

The `echo` command printed its message into `run_log.txt` rather than the terminal.

### Important: `>` overwrites

If `run_log.txt` already exists and contains content, `>` will **replace it entirely** with the new output. The previous contents are gone.

Run this twice and check the file:

```bash
echo "First run" > run_log.txt
echo "Second run" > run_log.txt
cat run_log.txt
```

Output:

```
Second run
```

The first line was overwritten. This is intentional behaviour — use `>` at the start of a script to create a fresh log each time the script runs.

---

## 3. Appending with `>>`

The `>>` symbol also redirects output to a file — but instead of overwriting, it **adds to the end** of the file.

```bash
echo "Run started" > run_log.txt
echo "Processed SRR1553607_1" >> run_log.txt
echo "Processed SRR1553607_2" >> run_log.txt
echo "Run finished" >> run_log.txt
```

Check the file:

```bash
cat run_log.txt
```

Output:

```
Run started
Processed SRR1553607_1
Processed SRR1553607_2
Run finished
```

Each `>>` added a new line to the end without disturbing what was already there.

---

## 4. When to Use Each

| Symbol | Behaviour | When to use |
|--------|-----------|-------------|
| `>` | Creates the file; overwrites if it exists | Once at the start of a script to open a fresh log |
| `>>` | Adds to the end; never overwrites | Inside loops and after each step to record progress |

A typical pattern:

```bash
echo "Run started" > run_log.txt      # fresh log — use > here
echo "Step 1 done" >> run_log.txt     # add to it — use >> from here on
echo "Step 2 done" >> run_log.txt
```

---

## 5. Building a Log File in a Script

Here is a complete script that uses both `>` and `>>` to build a log while processing files:

```bash
#!/bin/bash

LOG_FILE="run_log.txt"

# Create a fresh log file
echo "FastQC run started" > $LOG_FILE

# Process first sample
echo "Processing SRR1553607_1" >> $LOG_FILE
fastqc Training/short_reads/paired/SRR1553607_1.fastq

# Process second sample
echo "Processing SRR1553607_2" >> $LOG_FILE
fastqc Training/short_reads/paired/SRR1553607_2.fastq

# Record that the run is complete
echo "FastQC run finished" >> $LOG_FILE

echo "Done. Log saved to: $LOG_FILE"
```

Save this as `fastqc_with_log.sh`, make it executable, and run it:

```bash
chmod +x fastqc_with_log.sh
./fastqc_with_log.sh
```

After it finishes, check the log:

```bash
cat run_log.txt
```

Output:

```
FastQC run started
Processing SRR1553607_1
Processing SRR1553607_2
FastQC run finished
```

Notice the last `echo` in the script — `"Done. Log saved to: $LOG_FILE"` — uses neither `>` nor `>>`. It prints to the terminal, not the log file. You can mix both: some messages go to the terminal, others go to the log.

---

## 6. Using tee — Print and Save at the Same Time

With `>` and `>>`, output goes to the file but **not** to the terminal. You either see it or save it — not both. This is fine for `echo` messages you have already written, but sometimes you want to watch output appear on screen as it is saved.

That is what `tee` does. It takes output and sends it to two places simultaneously: the terminal and a file.

### The pipe symbol

`tee` works with the **pipe** symbol `|`. The pipe connects two commands: it takes the output of the command on the left and passes it as input to the command on the right.

```bash
echo "Run started" | tee run_log.txt
```

This prints `Run started` to the terminal **and** writes it to `run_log.txt` at the same time.

Like `>`, `tee` on its own **overwrites** the file if it already exists. To append instead, add the `-a` flag:

```bash
echo "Run started" | tee run_log.txt        # overwrites — use at the start
echo "Processing sample" | tee -a run_log.txt   # appends — use throughout
```

### tee in a script

Here is the same log script from section 5, rewritten to use `tee` so every message is visible in the terminal and saved to the log:

```bash
#!/bin/bash

LOG_FILE="run_log.txt"

# Create a fresh log and print the opening message
echo "FastQC run started" | tee $LOG_FILE

# Process first sample
echo "Processing SRR1553607_1" | tee -a $LOG_FILE
fastqc Training/short_reads/paired/SRR1553607_1.fastq

# Process second sample
echo "Processing SRR1553607_2" | tee -a $LOG_FILE
fastqc Training/short_reads/paired/SRR1553607_2.fastq

# Record completion
echo "FastQC run finished" | tee -a $LOG_FILE
```

Terminal output:

```
FastQC run started
Processing SRR1553607_1
Processing SRR1553607_2
FastQC run finished
```

And `run_log.txt` will contain exactly the same lines — because `tee` sent every message to both places.

### tee vs >> — which to use?

| Approach | Output goes to terminal? | Output goes to file? | Use when |
|----------|--------------------------|----------------------|----------|
| `echo "msg" >> log.txt` | No | Yes | You only need a file record |
| `echo "msg" \| tee -a log.txt` | Yes | Yes | You want to watch progress and keep a record |

Both are valid. In longer pipelines that run for hours — perhaps on a remote server — `tee` is particularly useful because you can watch progress in real time while the log is being written simultaneously.

---

## 7. Checking a Log File

Two useful commands for reading log files:

```bash
cat run_log.txt       # print the whole file at once
```

```bash
less run_log.txt      # scroll through a longer file (press q to quit)
```

For small log files, `cat` is fine. For longer logs from bigger pipelines, `less` lets you scroll.

---

## 8. Capturing All Output with exec

The `>>` and `tee` approaches above work well for messages you write yourself with `echo`. But they have a gap: **error messages**.

When a command fails — for example, if FastQC cannot find a file — it prints the error to a separate stream called **stderr**. Everything we have used so far only captures **stdout** (standard output — normal messages and results). Errors on stderr bypass your log entirely and appear on the terminal unrecorded.

### The two output streams

Every command sends its output to one of two streams:

| Stream | Name | Number | Contains |
|--------|------|--------|----------|
| stdout | Standard output | 1 | Normal results and progress messages |
| stderr | Standard error | 2 | Error messages and warnings |

The numbers are called **file descriptors**. You will see them used in the syntax below.

### What exec does

`exec` is a special command. When used for redirection at the top of a script — without any other command — it sets up that redirection for **every command that follows**. You write it once and the entire script is covered. No `>>` or `| tee` needed on individual lines.

### The pattern

```bash
exec > >(tee logfile.txt) 2>&1
```

Place this near the top of your script, just after your variable declarations. Then write the rest of the script completely normally.

Breaking it down piece by piece:

| Part | What it does |
|------|-------------|
| `exec` | Apply this redirection to all commands from here onwards |
| `>` | Redirect stdout (stream 1) |
| `>(tee logfile.txt)` | Instead of redirecting into a plain file, send stdout into a `tee` process — `tee` then writes to both the terminal and `logfile.txt` |
| `2>&1` | Redirect stderr (stream 2) to the same destination as stdout — so errors are captured too |

The `>(...)` syntax is called **process substitution** — it lets you use a running command (like `tee`) as if it were a file. You do not need to fully understand it right now; treat the whole line as a pattern you place at the top of any script you want fully logged.

### A complete example

```bash
#!/bin/bash

LOG_FILE="full_run.log"

exec > >(tee $LOG_FILE) 2>&1

# Everything below is automatically captured — no >> or | tee needed
DATA_DIR="Training/short_reads/paired"
OUTPUT_DIR="fastqc_results"

mkdir -p $OUTPUT_DIR
echo "FastQC run started"

for FILE in $DATA_DIR/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Processing: $SAMPLE"
    fastqc $FILE --outdir $OUTPUT_DIR
done

echo "All done."
```

Every `echo`, every FastQC status message, and any error messages all go to the terminal and to `full_run.log` — with nothing extra on any individual line.

### Capturing different types of output

Depending on your needs, you can adjust what gets captured and where it goes:

**Everything to terminal and log — the most common choice:**
```bash
exec > >(tee run.log) 2>&1
```

**Everything to a log file only — no terminal output:**
Useful for scripts running overnight on a server where nobody is watching.
```bash
exec > run.log 2>&1
```

**Errors only, saved to a separate file:**
Normal output still prints to the terminal. Only errors are saved. Useful when you want to check for problems after a run without reading through all the normal output.
```bash
exec 2> errors.log
```

**Normal output and errors in separate files:**
Lets you review them independently — one file for what ran, one file for what went wrong.
```bash
exec > stdout.log 2> errors.log
```

> **To append rather than overwrite:** use `tee -a` so each run adds to the existing log rather than replacing it:
> ```bash
> exec > >(tee -a run.log) 2>&1
> ```

### Choosing your approach

| Method | Lines to add | Captures errors? | Best for |
|--------|-------------|-----------------|----------|
| `echo "msg" >> log` | One per echo | No | Short scripts, simple progress notes |
| `echo "msg" \| tee -a log` | One per echo | No | When you want to see output live and save it |
| `exec > >(tee log) 2>&1` | One line at the top | Yes | Any script where you want complete, automatic logging |

For most real bioinformatics scripts — especially anything running on a cluster or overnight — `exec > >(tee log) 2>&1` is the approach to reach for. It is the most complete, requires the least effort, and captures the errors that matter most.

---

## Summary

- Terminal output disappears when the session ends — a log file creates a permanent record
- `>` redirects stdout to a file and **overwrites** any existing content — use once at the start to open a fresh log
- `>>` **appends** to a file without overwriting — use throughout the script to add entries
- `tee` sends output to the terminal **and** a file simultaneously — use `tee -a` to append
- The pipe `|` connects two commands, passing the output of the left into the right
- `exec > >(tee log) 2>&1` at the top of a script captures **all** output — stdout and stderr — with a single line
- `2>&1` means "send stderr (stream 2) to wherever stdout (stream 1) is going"
- `exec 2> errors.log` captures errors only; `exec > stdout.log 2> errors.log` separates them into two files

In the next lesson, you will combine everything from this module — shebang, variables, `basename`, loops, and log files — into one complete script.
