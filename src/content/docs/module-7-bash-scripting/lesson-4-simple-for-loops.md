---
title: "Lesson 4 — Simple For Loops"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Explain what a for loop does and why it is useful
- Write a basic for loop in Bash
- Loop over a fixed list of values
- Loop over a set of files using a wildcard pattern (`*.fastq`)
- Combine loops with variables and `basename`

---

## 1. Why Loops?

In Lesson 3, you wrote a script that processed one file. What if you have ten files? You could copy and paste the same commands ten times — but that defeats the purpose of scripting.

A **for loop** solves this. It lets you write a set of commands once and have Bash repeat them for each item in a list.

---

## 2. The For Loop Structure

Here is the structure of a Bash for loop:

```bash
for VARIABLE in item1 item2 item3
do
    command using $VARIABLE
done
```

Breaking it down:

- `for` starts the loop
- `VARIABLE` is a name you choose — Bash will assign it each item from the list, one at a time
- `in` is followed by the list of items
- `do` marks the start of the commands to repeat
- `done` marks the end of the loop

Everything between `do` and `done` runs once for every item in the list.

---

## 3. A Simple Example

Let us start with a small example before using real files:

```bash
#!/bin/bash

for SAMPLE in SRR001 SRR002 SRR003
do
    echo "Processing sample: $SAMPLE"
done
```

Output:

```
Processing sample: SRR001
Processing sample: SRR002
Processing sample: SRR003
```

What happened:
1. Bash assigned `SRR001` to `SAMPLE`, then ran `echo`
2. Bash assigned `SRR002` to `SAMPLE`, then ran `echo`
3. Bash assigned `SRR003` to `SAMPLE`, then ran `echo`
4. The list was exhausted — the loop ended

The commands between `do` and `done` can be anything: `echo`, `fastqc`, `cp`, `mv` — as many commands as you need.

---

## 4. Looping Over Files

Typing out every sample name by hand is still repetitive. Instead, you can use a **wildcard pattern** to match files automatically.

The `*` character matches any sequence of characters. So:

```
*.fastq
```

means "every file whose name ends in `.fastq`."

Here is a loop that prints the name of every FASTQ file in the paired reads folder:

```bash
#!/bin/bash

for FILE in Training/short_reads/paired/*.fastq
do
    echo $FILE
done
```

Output:

```
Training/short_reads/paired/SRR1553607_1.fastq
Training/short_reads/paired/SRR1553607_2.fastq
```

Bash expanded `*.fastq` into the list of matching files and looped over each one automatically. If you add more `.fastq` files to that folder, the loop will include them the next time you run the script — without any changes to the script itself.

---

## 5. Combining Loops with basename

Now combine what you learned in Lesson 3 with a loop. Inside the loop, use `basename` to get the clean sample name from each file path:

```bash
#!/bin/bash

for FILE in Training/short_reads/paired/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Sample: $SAMPLE"
    echo "File:   $FILE"
done
```

Output:

```
Sample: SRR1553607_1
File:   Training/short_reads/paired/SRR1553607_1.fastq
Sample: SRR1553607_2
File:   Training/short_reads/paired/SRR1553607_2.fastq
```

On each pass through the loop:
- `$FILE` holds the full path to one FASTQ file
- `$SAMPLE` holds the clean name extracted from that path
- Both are available to use in any command inside the loop

---

## 6. Running FastQC in a Loop

Here is a loop that does real work — running FastQC on every FASTQ file in the folder:

```bash
#!/bin/bash

for FILE in Training/short_reads/paired/*.fastq
do
    SAMPLE=$(basename $FILE .fastq)
    echo "Running FastQC on: $SAMPLE"
    fastqc $FILE
done
```

Save this as `loop_fastqc.sh`, make it executable, and run it:

```bash
chmod +x loop_fastqc.sh
./loop_fastqc.sh
```

FastQC will run on each `.fastq` file in turn. This script already does everything the manual approach did — but in a form that scales to any number of files.

---

## Summary

- A for loop repeats commands for each item in a list
- The loop variable (`FILE`, `SAMPLE`, etc.) takes a new value on each pass through the loop
- `*.fastq` matches all files ending in `.fastq` at the specified path
- `basename` can be used inside a loop to extract a clean sample name from each file path
- Adding new files to the folder automatically includes them in future runs — no script changes needed

In the final lesson, you will combine everything — shebang, variables, `basename`, and a loop — into a complete, well-structured script ready for real use.
