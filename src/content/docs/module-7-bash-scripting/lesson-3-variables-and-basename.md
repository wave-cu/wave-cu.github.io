---
title: "Lesson 3 — Variables and basename"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Create a variable and assign it a value
- Use a variable in a command
- Store a file path in a variable
- Use the `basename` command to extract a filename from a full path
- Use `$()` to store the result of a command in a variable

---

## 1. What Is a Variable?

A variable is a named container that holds a value. Instead of typing the same file path over and over throughout a script, you store it once in a variable and use the variable name everywhere else.

If the path ever changes, you update it in one place — not in every command throughout the script.

---

## 2. Creating a Variable

In Bash, you create a variable by writing its name, an equals sign, and the value:

```bash
SAMPLE="SRR1553607"
```

Three important rules:

1. **No spaces around the `=` sign.** `SAMPLE = "SRR1553607"` will fail with an error.
2. **Variable names are case-sensitive.** `SAMPLE` and `sample` are two different variables.
3. **Use uppercase names for variables in scripts.** This is a convention that makes scripts easier to read — it helps you instantly see what is a variable and what is a command.

---

## 3. Using a Variable

To use the value stored in a variable, put a `$` in front of its name:

```bash
SAMPLE="SRR1553607"
echo $SAMPLE
```

Output:

```
SRR1553607
```

You can use a variable anywhere you would type the value directly:

```bash
INPUT="Training/short_reads/paired/SRR1553607_1.fastq"
fastqc $INPUT
```

This is exactly the same as typing `fastqc Training/short_reads/paired/SRR1553607_1.fastq` — but now the path is stored once, at the top of the script, where it is easy to find and change.

You can also mix variables with other text inside `echo`:

```bash
echo "Running FastQC on: $INPUT"
```

Output:

```
Running FastQC on: Training/short_reads/paired/SRR1553607_1.fastq
```

Bash replaces `$INPUT` with its value before printing.

---

## 4. Storing a File Path in a Variable

Here is a practical example. Create a new script:

```bash
nano qc_one_sample.sh
```

Type the following:

```bash
#!/bin/bash

# Store the file path in a variable
INPUT="Training/short_reads/paired/SRR1553607_1.fastq"

# Use the variable to run FastQC
echo "Running FastQC on: $INPUT"
fastqc $INPUT
```

Save and make it executable:

```bash
chmod +x qc_one_sample.sh
./qc_one_sample.sh
```

---

## 5. The basename Command

When working with file paths, you often need just the filename — without the directory path in front of it. The `basename` command does exactly this.

Try it directly in the terminal first:

```bash
basename Training/short_reads/paired/SRR1553607_1.fastq
```

Output:

```
SRR1553607_1.fastq
```

`basename` stripped away `Training/short_reads/paired/` and left just the filename.

### Removing the extension too

You can also tell `basename` to remove a specific extension by adding it as a second argument:

```bash
basename Training/short_reads/paired/SRR1553607_1.fastq .fastq
```

Output:

```
SRR1553607_1
```

This gives you the clean sample name — no directory path, no file extension. This is extremely useful for naming output files after their corresponding input files, or for printing meaningful progress messages.

---

## 6. Storing a Command's Result in a Variable

You can store the output of any command in a variable using `$()`:

```bash
SAMPLE=$(basename Training/short_reads/paired/SRR1553607_1.fastq .fastq)
echo $SAMPLE
```

Output:

```
SRR1553607_1
```

The `$()` syntax is called **command substitution**. It tells Bash: run the command inside the brackets, and use whatever it prints as the value. The result is stored directly in the variable.

Here it is using a variable for the input path:

```bash
INPUT="Training/short_reads/paired/SRR1553607_1.fastq"
SAMPLE=$(basename $INPUT .fastq)

echo "Sample name: $SAMPLE"
```

Output:

```
Sample name: SRR1553607_1
```

---

## 7. A Complete Example

Here is a script that brings all the variable concepts from this lesson together:

```bash
#!/bin/bash

# Define the input file
INPUT="Training/short_reads/paired/SRR1553607_1.fastq"

# Extract the sample name from the filename
SAMPLE=$(basename $INPUT .fastq)

# Print what we are about to do
echo "Processing sample: $SAMPLE"
echo "Input file: $INPUT"

# Run FastQC
fastqc $INPUT
```

Save this as `qc_with_variables.sh`, then run it:

```bash
chmod +x qc_with_variables.sh
./qc_with_variables.sh
```

Expected output:

```
Processing sample: SRR1553607_1
Input file: Training/short_reads/paired/SRR1553607_1.fastq
```

Followed by the FastQC output.

---

## Summary

- Variables store values so you can reuse them without retyping — define once, use everywhere
- Create a variable with `NAME="value"` — no spaces around `=`
- Use a variable with `$NAME`
- `basename /path/to/file.fastq` returns just `file.fastq`
- `basename /path/to/file.fastq .fastq` returns `file` with no extension
- `$()` runs a command and stores the result in a variable — this is command substitution

In the next lesson, you will use variables inside a loop to process multiple files automatically.
