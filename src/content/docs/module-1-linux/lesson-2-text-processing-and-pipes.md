---
title: "Lesson 2 - Text Processing, Pipes, and Redirection"
---

## Learning Objectives
- Explain how pipes connect commands in bioinformatics workflows.
- Use redirection to save command output into files.
- Count FASTQ reads with `wc` and the 4-line structure.
- Use `grep` to filter filenames and text.
- Use `sort` and `uniq` to summarize lists.

## Conceptual Overview
Pipes (`|`) send the output of one command directly into another. This is the foundation of many bioinformatics one-liners. Redirection (`>` and `>>`) lets you save command output to a file or append to it. Together, these tools let you build small, reproducible data summaries without opening a spreadsheet.

FASTQ files store reads in 4-line blocks:
1) Header
2) Sequence
3) `+` separator
4) Quality string

If you count lines with `wc -l`, you can estimate reads by dividing by 4.

## Worked Examples

### 1) Count reads with `wc`
`wc -l` uses the `-l` option to count lines in the file. Divide by 4 to estimate reads.
```bash
wc -l Training/short_reads/paired/SRR1553607_1.fastq
```
Output:
```
813780 Training/short_reads/paired/SRR1553607_1.fastq
```

### 2) Count Case samples using a pipe
`grep` filters lines that match the word `Case`, and `wc -l` counts those lines.
```bash
ls Training/short_reads/unpaired | grep Case | wc -l
```
Output:
```
3
```

### 3) Count Healthy samples using a pipe
`grep` filters lines that match the word `Healthy`, and `wc -l` counts those lines.
```bash
ls Training/short_reads/unpaired | grep Healthy | wc -l
```
Output:
```
4
```

### 4) Sort and deduplicate a list
`sort` arranges filenames alphabetically, and `uniq` removes duplicate adjacent lines.

To better understand `sort` and `uniq`, lets create a small dataset with duplicates: for now dont worry about what the following script does, we would cover that in later lessons.

1. First create a script with nano:
Please create this inside the 'training' directory

_Tip: You can check your current directory with `pwd` and change directories with `cd <directory_name>`_

The command below creates and open a new file called generate_data.sh
```bash
nano generate_data.sh 
```
2. Now copy and paste the following lines into nano:

```bash
#!/bin/bash

# Define the output file name
FILE="attendees.csv"

# Array of departments to create repetitions
DEPARTPS=("Bioinformatics" "Virology" "Genetics" "Computer Science" "Bioinformatics")

# Array of names
NAMES=("Olabode" "Alice" "Zainab" "Chidi" "Bayo" "Alice" "Zainab")

echo "Generating random data in $FILE..."

# Create or clear the file and add a header
echo "Name,Department" > "$FILE"

# Loop to generate 200 lines of random data
for i in {1..200}
do
    # Pick a random name and department from the arrays
    NAME=${NAMES[$RANDOM % ${#NAMES[@]}]}
    DEPT=${DEPARTPS[$RANDOM % ${#DEPARTPS[@]}]}
    
    # Append to the CSV
    echo "$NAME,$DEPT" >> "$FILE"
done

echo "Done! You can now use 'head $FILE' to see the messy data."
```
3. Save and exit nano (Ctrl + O, Enter, Ctrl + X).
4. (optional) Make the script executable:
```bash
chmod +x generate_data.sh
```

_this would allow you to run the script directly using ./generate_data.sh.
Might be easier to just run it with bash as below_

5. Run the script to generate the data:
- The command below would run the script we just created and generate a file called attendees.csv in your current directory.

```bash
bash generate_data.sh
```

_After running the script, you should see a new file named `attendees.csv` in your current directory. The directory structure should look like this:_
```
├── attendees.csv
├── generate_data.sh
├── long_reads
└── short_reads
```

6. Lets quickly check the contents of the generated file by looking at the first 10 lines
```bash
head attendees.csv
```
Output:
```
Name,Department
Olabode,Virology
Zainab,Virology
Alice,Virology
Zainab,Bioinformatics
Chidi,Genetics
Alice,Virology
Bayo,Computer Science
Bayo,Bioinformatics
Alice,Computer Science
```
_PS because the data is randomly generated, your output will likely differ from the above example. You would however see the same structure and format._

7. Let's see if we remember the command to count how many lines are in the file
```bash

```
Output:
```
201 attendees.csv
```
8. Now we can use `sort` and `uniq` to get a list of unique departments in the file. Run the command below:
```bash
sort attendees.csv | uniq
```
Output:
```
Alice,Bioinformatics
Alice,Computer Science
Alice,Genetics
Alice,Virology
Bayo,Bioinformatics
Bayo,Computer Science
Bayo,Genetics
Bayo,Virology
Chidi,Bioinformatics
Chidi,Computer Science
Chidi,Genetics
Chidi,Virology
Name,Department
Olabode,Bioinformatics
Olabode,Computer Science
Olabode,Genetics
Olabode,Virology
Zainab,Bioinformatics
Zainab,Computer Science
Zainab,Genetics
Zainab,Virology
```

_What do you notice about the output?_
_Note that the header "Name,Department" is also included in the output. This is because `sort` and `uniq` treat it like any other line._

_Did you also notice that the number of lines in the output is less than the number of lines in the input file? This is because there were duplicate entries in the original file, and `uniq` removed those duplicates._

_you can pipe the output of uniq to wc -l to count the number of unique entries if you want to_ Alternatively you can use the `-u` option with `sort` to get unique lines directly:

```bash
sort -u attendees.csv
```
_If you are interested in kowing how mnay times each unique entry appears in the file, you can use the `-c` option with `uniq` after sorting:_

```bash
sort attendees.csv | uniq -c
```

Output:
```
29 Alice,Bioinformatics
     10 Alice,Computer Science
     10 Alice,Genetics
      9 Alice,Virology
      7 Bayo,Bioinformatics
      9 Bayo,Computer Science
      6 Bayo,Genetics
      5 Bayo,Virology
     13 Chidi,Bioinformatics
      9 Chidi,Computer Science
      5 Chidi,Genetics
      6 Chidi,Virology
      1 Name,Department
     13 Olabode,Bioinformatics
      4 Olabode,Computer Science
      5 Olabode,Genetics
      8 Olabode,Virology
     24 Zainab,Bioinformatics
     10 Zainab,Computer Science
      7 Zainab,Genetics
     11 Zainab,Virology
```
_Just to confirm how many entries there were based on the counts, you can sum them up using `awk`: a super poerful command which we will not cover in this module but just so you see its wonders, run the below_

```bash
sort attendees.csv | uniq -c | awk '{sum += $1} END {print sum}'
```
Output:
```
201
```
_That was a quick overview of `sort` and `uniq`. We will explore these commands more in future lessons._ Now let's proceed to the next section.

### 5) Save output with redirection
`>` redirects output to a file and overwrites it if it exists.
No output appears because it is written to `Module_1_Linux/healthy_files.txt`.
```bash
ls Training/short_reads/unpaired | grep Healthy > Module_1_Linux/healthy_files.txt
```

_NB: If you run the above command again, it will overwrite the contents of `healthy_files.txt`. To add to the file instead of overwriting, use `>>` see below._

`>>` appends output to the end of a file.
After this, the file contains Healthy and Case filenames, in the order you wrote them.
```bash
ls Training/short_reads/unpaired | grep Case >> Module_1_Linux/healthy_files.txt
```

## Exercises
1) Use `wc -l` to count lines in `Training/short_reads/paired/SRR1553607_2.fastq`. Estimate the read count by dividing by 4.

2) Use a pipe to count how many filenames in `Training/short_reads/unpaired` contain `Healthy`. Expected output: `4`.

3) Use a pipe to count how many filenames in `Training/short_reads/unpaired` contain `Case`. Expected output: `3`.

4) Use `sort` and `uniq` to list unique filenames in `Training/short_reads/unpaired`.

5) Challenge: Use `wc -l` with both paired files in one command and redirect the output to `Module_1_Linux/read_line_counts.txt`.

6) Use `sort` and `uniq -c` to get a list of unique entries and then save that list to a file called `attendee_summary.txt`.

## Solutions

### Solution 1
`wc -l` counts lines in the file. Divide by 4 to estimate reads.
```bash
wc -l Training/short_reads/paired/SRR1553607_2.fastq
```
Output:
```
813780 Training/short_reads/paired/SRR1553607_2.fastq
```

### Solution 2
`grep` filters for Healthy filenames, and `wc -l` counts them.
```bash
ls Training/short_reads/unpaired | grep Healthy | wc -l
```
Output:
```
4
```

### Solution 3
`grep` filters for Case filenames, and `wc -l` counts them.
```bash
ls Training/short_reads/unpaired | grep Case | wc -l
```
Output:
```
3
```

### Solution 4
`sort` orders the list, and `uniq` removes duplicates.
```bash
ls Training/short_reads/unpaired | sort | uniq
```
Output:
```
SRR11282407_Case.fastq.gz
SRR11282408_Healthy.fastq.gz
SRR11282409_Healthy.fastq.gz
SRR11282410_Case.fastq.gz
SRR11282411_Healthy.fastq.gz
SRR11282412_Case.fastq.gz
SRR11282413_Healthy.fastq.gz
download.sh
```

### Solution 5
`wc -l` can take multiple files and prints one line per file plus a total. No output appears because it is written to `Module_1_Linux/read_line_counts.txt`.
```bash
wc -l Training/short_reads/paired/SRR1553607_1.fastq Training/short_reads/paired/SRR1553607_2.fastq > Module_1_Linux/read_line_counts.txt
```

### Solution 6
`sort` orders the list, `uniq -c` counts occurrences, and `>` saves to a file.
```bash
sort attendees.csv | uniq -c > attendee_summary.txt
```

# WELLDONE!!! You have completed Lesson 2 - Text Processing, Pipes, and Redirection. Go forth and pipe :)!
