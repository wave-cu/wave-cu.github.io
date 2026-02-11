# Lesson 1 - Fundamentals and Basic Commands

## Learning Objectives
- Explain why the Linux CLI is central to bioinformatics workflows.
- Navigate the filesystem with absolute and relative paths.
- Inspect files safely using `less`, `head`, and `tail`.
- Use core commands to copy, move, and remove files in a controlled workspace.
- Count and search within FASTQ files using `wc` and `grep`.
- Apply WSL-specific tips for file locations and performance.

## Conceptual Overview
Linux is designed around small tools that do one job well and can be combined. In bioinformatics, datasets are large and automated pipelines are common, so the command line is faster, more reproducible, and often required by analysis tools.

The filesystem is a tree rooted at `/`. Your home directory (`$HOME`) is your personal workspace. Paths can be absolute (start with `/`) or relative (start from your current directory). In WSL, Windows drives appear under `/mnt`, so your Windows `C:` drive is `/mnt/c`.

WSL notes:
- Performance is usually better when you keep bioinformatics data inside the Linux filesystem (e.g., under `/home/...`) instead of `/mnt/c`.
- Windows and Linux line endings differ; most bioinformatics tools expect Linux line endings.
- Use Linux paths in commands, even when the data started on Windows.

## Worked Examples

### 1) Where am I?
`pwd` prints the absolute path to your current directory.
```bash
pwd
```
Output:
```
/mnt/c/Users/WAVECU001/Documents/Bioinformatic_Fridays
```

### 2) List folders and files
`ls` lists the contents of a directory.
```bash
ls Training
```
Output:
```
long_reads
short_reads
```

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

### 3) Change directories with `cd`
`cd` changes your current directory. `pwd` confirms where you are.
```bash
cd Training/short_reads/paired
pwd
```
Output:
```
/mnt/c/Users/WAVECU001/Documents/Bioinformatic_Fridays/Training/short_reads/paired
```

### 4) Inspect FASTQ safely
`head -n 8` uses the `-n` option to show the first 8 lines.
```bash
head -n 8 Training/short_reads/paired/SRR1553607_1.fastq
```
Output:
```
@SRR1553607.1 1 length=101
GTTAGCGTTGTTGATCGCGACGCAACAACTGGTAAAGAATCTGGAAGAAGGATATCAGTTCAAACGCTCAAGCGAGATGATGGATATTTTTGAACGACTCA
+SRR1553607.1 1 length=101
BB@FFFFFHHHHHJJJJJJJJJJJJJJJJJJJGHIJJJJJJJJJHHHHHFFFFFEEEEEEEEEDDDDDDDDDDDDDDDDDEDDDDEDEEEDDDDDDDDDDD
@SRR1553607.2 2 length=101
GGTGTAAGCACAGTACTCGGCCCACATCGCCTTTGTGTTAATGAAGTTTGGGTATCAACTTTCATCCCCAATCTTCCGTGGAAGGAGTATGTTCCGTCAAT
+SRR1553607.2 2 length=101
?@;BDDDDFHFHFFFGIIGHIIJJGJIGIJIIIIGDGGGHEIGJIIIGIIHJ5@FGHJJIEGGEEHHFFFFFFEEDEDCBB?CCDDD?CDDDDECDCB@>C
```

`tail -n 4` uses the `-n` option to show the last 4 lines.
```bash
tail -n 4 Training/short_reads/paired/SRR1553607_1.fastq
```
Output:
```
@SRR1553607.203445 203445 length=101
CTCGGGTTCCGCACGGTCACCACAACCTCGTTGCCCTCGCCCGCCGCGCGGGCCCACCTGAGCTGGCTGGCCGATTTCTCCGGCCCACCTGGCAGCATGGC
+SRR1553607.203445 203445 length=101
CCCFFFDDHHDFHIJIHHGIJJJJJIJJJIIJJJIJJJGJJJGIHFCD@B@BDDDDDBDDDDDDDDDDDDDDDBDDDCEDDDBDBDDDDDDBDDDDBDCDD
```

### 5) Browse with `less`
`less` opens a scrollable viewer for large files. Press `q` to quit. No output appears because it is interactive.
```bash
less Training/long_reads/barcode57.fastq
```

### 6) View a small text file with `cat`
`cat` prints an entire small file to the screen.
```bash
cat Training/short_reads/unpaired/download.sh
```
Output:
```
#!/usr/bin/env bash
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/009/SRR11282409/SRR11282409.fastq.gz -o SRR11282409_Healthy.fastq.gz
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/007/SRR11282407/SRR11282407.fastq.gz -o SRR11282407_Case.fastq.gz
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/008/SRR11282408/SRR11282408.fastq.gz -o SRR11282408_Healthy.fastq.gz
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/013/SRR11282413/SRR11282413.fastq.gz -o SRR11282413_Healthy.fastq.gz
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/012/SRR11282412/SRR11282412.fastq.gz -o SRR11282412_Case.fastq.gz
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/010/SRR11282410/SRR11282410.fastq.gz -o SRR11282410_Case.fastq.gz
curl -L ftp://ftp.sra.ebi.ac.uk/vol1/fastq/SRR112/011/SRR11282411/SRR11282411.fastq.gz -o SRR11282411_Healthy.fastq.gz
```

### 7) Count lines in a FASTQ
`wc -l` uses the `-l` option to count lines. FASTQ has 4 lines per read, so divide the line count by 4 to estimate reads.
```bash
wc -l Training/short_reads/paired/SRR1553607_1.fastq
```
Output:
```
813780 Training/short_reads/paired/SRR1553607_1.fastq
```

### 8) Search within a file
`grep -m 2` uses the `-m` option to stop after 2 matches. `^@` means the line starts with `@`.
```bash
grep -m 2 "^@SRR1553607\." Training/short_reads/paired/SRR1553607_1.fastq
```
Output:
```
@SRR1553607.1 1 length=101
@SRR1553607.2 2 length=101
```

### 9) Safe workspace edits
`mkdir -p` uses the `-p` option to create parent folders if they do not exist.
No output is expected when it succeeds.
```bash
mkdir -p Module_1_Linux/workspace
```

`cp` copies a file, and `mv` renames or moves a file.
No output is expected when these commands succeed.
```bash
cp Training/short_reads/unpaired/download.sh Module_1_Linux/workspace/
mv Module_1_Linux/workspace/download.sh Module_1_Linux/workspace/download_script.sh
```

`rm` deletes a file permanently, so double-check the path before you run it.
```bash
rm Module_1_Linux/workspace/download_script.sh
```

## Exercises
1) Use `pwd` and `ls` to navigate into `Training/long_reads`. What is the name of one FASTQ file you see there?

2) Use `head -n 4` to inspect the first read in `Training/long_reads/barcode57.fastq`. What does the header line start with?

3) Use `tail -n 4` on the same file. Compare the first and last header lines. What looks similar or different?

4) Use `wc -l` on `Training/short_reads/paired/SRR1553607_2.fastq`. Expected output: `813780 Training/short_reads/paired/SRR1553607_2.fastq`.

5) Use `grep -m 1 "^@"` on `Training/short_reads/paired/SRR1553607_2.fastq`. What does the first header line look like?

6) Create a workspace inside `Module_1_Linux/` and copy `Training/short_reads/unpaired/download.sh` into it with a new name of your choice.

7) Challenge: Use `wc -l` to estimate the number of reads in `Training/short_reads/paired/SRR1553607_1.fastq` and `Training/short_reads/paired/SRR1553607_2.fastq`. Are they the same?

## Solutions

### Solution 1
`ls` lists files in the directory after you change into it.
```bash
ls Training/long_reads
```
Output:
```
barcode57.fastq
barcode58.fastq
sample3.fastq
```

### Solution 2
`head -n 1` shows just the first header line.
```bash
head -n 1 Training/long_reads/barcode57.fastq
```
Output:
```
@5832c8b6-696e-46cd-be8d-73b789952b4e	st:Z:2024-06-27T02:52:17.771+00:00	RG:Z:fba2136ff67b57066e5c7e23383eba9e075ff2b2_dna_r10.4.1_e8.2_400bps_sup@v4.3.0
```

### Solution 3
`tail -n 4` shows the last read, and `head -n 1` selects the header line from those 4 lines. Compare this header to the first header for differences.
```bash
tail -n 4 Training/long_reads/barcode57.fastq | head -n 1
```
Output:
```
@4492b0c6-6608-4405-a985-7b409c70ef7d	st:Z:2024-06-27T07:46:29.526+00:00	RG:Z:fba2136ff67b57066e5c7e23383eba9e075ff2b2_dna_r10.4.1_e8.2_400bps_sup@v4.3.0
```

### Solution 4
`wc -l` counts lines in the file.
```bash
wc -l Training/short_reads/paired/SRR1553607_2.fastq
```
Output:
```
813780 Training/short_reads/paired/SRR1553607_2.fastq
```

### Solution 5
`grep -m 1` stops after the first match, and `^@` means the line starts with `@`.
```bash
grep -m 1 "^@" Training/short_reads/paired/SRR1553607_2.fastq
```
Output:
```
@SRR1553607.1 1 length=101
```

### Solution 6
`mkdir -p` creates the workspace and `cp` copies the file into it.
```bash
mkdir -p Module_1_Linux/workspace
cp Training/short_reads/unpaired/download.sh Module_1_Linux/workspace/download_copy.sh
ls Module_1_Linux/workspace
```
Output:
```
download_copy.sh
```

### Solution 7
`wc -l` counts lines; divide by 4 to estimate reads. Each file has 813780 lines, so each has 203445 reads.
```bash
wc -l Training/short_reads/paired/SRR1553607_1.fastq
wc -l Training/short_reads/paired/SRR1553607_2.fastq
```
Output:
```
813780 Training/short_reads/paired/SRR1553607_1.fastq
813780 Training/short_reads/paired/SRR1553607_2.fastq
```
