---
title: "Solutions"
---


> **Note for instructors:** These solutions show one correct approach for each exercise. Students may use different (equally valid) commands. Encourage discussion of alternative approaches rather than treating these as the only right answers.

---

## Exercise Set 1: Linux Foundations

### 1.1 — Finding Your Bearings

1. From `~` to `Training/long_reads/`:
   - **Absolute path:** `/home/<username>/path/to/Training/long_reads/` (exact path depends on system)
   - **Relative path:** `Training/long_reads/` (if Training is directly inside `~`)

2. `ls Training/` lists filenames only. `ls -lh Training/` lists with permissions, owner, size (human-readable), and date.

3. `ls -lhR Training/` lists recursively through all subdirectories (`-R` = recursive).

**Discussion answer:** Scripts use paths to find files. If a script uses a relative path like `./data/reads.fastq`, it will break the moment you run the script from a different directory.

---

### 1.2 — Counting Reads

1. Example output: `34268 Training/long_reads/barcode57.fastq`

2. Reads = 34268 ÷ 4 = **8567 reads**

3. `barcode58.fastq`: 36784 lines → **9196 reads** | `sample3.fastq`: 11880 lines → **2970 reads**

4. Check all three at once:
   ```bash
   wc -l Training/long_reads/*.fastq
   ```

**Discussion answer:** An odd line count means the file is malformed — a read record is incomplete. This could indicate a truncated file (failed download or interrupted write).

---

### 1.3 — Inspecting a FASTQ Record

```bash
head -n 4 Training/long_reads/barcode57.fastq
tail -n 4 Training/long_reads/barcode57.fastq
head -n 4 Training/short_reads/paired/SRR1553607_1.fastq
```

**Discussion answer:**
- Nanopore headers contain a UUID, timestamp, and sequencing chemistry information (e.g., `r10.4.1_e8.2_400bps_sup@v4.3.0`)
- Illumina headers contain a run accession, read number, and read length (e.g., `@SRR1553607.1 1 length=101`)
- These differences reflect the platforms: Nanopore is real-time streaming; Illumina is batch synthesis

---

### 1.4 — Comparing Two Files

```bash
wc -l Training/short_reads/paired/SRR1553607_1.fastq Training/short_reads/paired/SRR1553607_2.fastq
```
Both should show 813780 lines.

```bash
head -n 1 Training/short_reads/paired/SRR1553607_1.fastq
head -n 1 Training/short_reads/paired/SRR1553607_2.fastq
```
Headers will differ in pair number (`.1` vs `.2`) but share the same read ID.

**Discussion answer:** Check before trimming. Trimming tools can discard unpaired reads, so after trimming you need to verify pairing is maintained (most trimmers do this automatically, but it is worth confirming).

---

### 1.5 — File Permissions and Scripts

1. `ls -l Training/short_reads/unpaired/download.sh` — look for `x` in the permissions string. On this system it shows `-rwxrwxrwx`, so it is executable.

2. `cat Training/short_reads/unpaired/download.sh` — it uses `curl` to download samples from NCBI SRA via FTP.

3. `chmod +x ~/count_reads.sh`

4. `bash count_reads.sh` runs the file with bash regardless of permissions. `./count_reads.sh` requires the file to be executable (`+x`) and uses the shebang line to determine the interpreter.

**Discussion answer:**
- The file is not executable (`chmod +x` not run)
- The shebang line is wrong or missing (e.g., `#!/usr/bin/python` on a system where Python is at a different path)

---

### 1.6 — Absolute vs. Relative Paths

1. **Absolute paths are safer in scripts** because they work regardless of what directory the script is called from.

2. Example absolute path: `/mnt/c/Users/WAVECU001/Documents/Bioinformatic_Fridays/Training/long_reads/barcode57.fastq`

3. From `Training/short_reads/`: `../long_reads/barcode57.fastq`

4. `../` means "go up one directory level." Example: from `Training/short_reads/paired/`, `../../long_reads/` navigates to `Training/long_reads/`.

**Discussion answer:** Use a variable at the top of the script: `TRAINING_DIR="/path/to/Training"`. Each user sets this once. Alternatively, use `$1` as an argument so the path is provided at runtime.

---

## Exercise Set 2: Text Processing and Pipelines

### 2.1 — Counting Sample Types

```bash
ls Training/short_reads/unpaired/ | grep Case | wc -l
# Output: 3

ls Training/short_reads/unpaired/ | grep Healthy | wc -l
# Output: 4
```

Using `grep -c`:
```bash
ls Training/short_reads/unpaired/ | grep -c Case
```
Same result here, but `-c` can behave differently when applied directly to files vs. stdin.

**Discussion answer:** `-c` counts lines with a match. It is equivalent to piping to `wc -l` in this context, but pipe + `wc -l` is more explicit and easier to read.

---

### 2.2 — Working with Compressed Files

1. `zcat` (or `gzip -dc`)

2. ```bash
   zcat Training/short_reads/unpaired/SRR11282407_Case.fastq.gz | head -n 8
   ```

3. ```bash
   zcat Training/short_reads/unpaired/SRR11282407_Case.fastq.gz | wc -l
   ```
   Divide result by 4 to get read count.

4. Compressed files: (a) save disk space significantly (gzip typically reduces FASTQ to ~25% of original size); (b) faster to transfer over networks.

**Discussion answer:** Compressed files take longer to process because they must be decompressed on-the-fly. For pipelines that read the same file many times, it may be worth decompressing once. For pipelines that read each file once, keeping compressed saves space.

---

### 2.3 — Extracting Read Headers

```bash
grep "^@" Training/long_reads/barcode57.fastq | head -n 5
grep -c "^@" Training/long_reads/barcode57.fastq
```

Expected: 8567. In practice, Nanopore quality strings rarely contain `@` at position 1, but it is theoretically possible.

**Discussion answer:** A safer approach is to extract every 4th line starting at line 1 using `awk 'NR%4==1'`. This is position-based rather than content-based and never misidentifies quality lines.

---

### 2.4 — Sorting and Deduplication

1. `ls -lhS Training/short_reads/unpaired/` (capital `-S` for size sort, add `-r` for reverse/largest first)

2. `ls Training/short_reads/unpaired/ | sort`

3. Output of `sort | uniq -c | sort -rn`:
   ```
   2 Sample1
   2 Sample2
   1 Sample3
   ```
   Column 1 = count, column 2 = value. `sort -rn` sorts numerically in reverse (most frequent first).

**Discussion answer:** `sort | uniq -c` is used in bioinformatics to count occurrences of read IDs (to detect duplicates), count k-mer frequencies, or count how many times each adapter sequence appears.

---

### 2.5 — Building a Read Summary Pipeline

```bash
for f in Training/long_reads/*.fastq; do
    reads=$(wc -l < "$f")
    reads=$((reads / 4))
    echo "$(basename "$f")  $reads"
done
```

Redirect to file:
```bash
for f in Training/long_reads/*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    echo "$(basename "$f")  $reads"
done > read_counts.txt
```

`>` overwrites the file each time; `>>` appends. Running twice with `>` leaves only the second run's output. Running twice with `>>` leaves both.

---

### 2.6 — Investigating Read Quality Lines

```bash
awk 'NR%4==0' Training/long_reads/barcode57.fastq | head -n 5
awk 'NR%4==0' Training/short_reads/paired/SRR1553607_1.fastq | head -n 5
```

The one-liner breakdown:
1. `awk 'NR%4==0' barcode57.fastq` — extracts every 4th line (quality lines)
2. `awk '{print length($0)}'` — prints the length of each quality string = read length
3. `sort -n` — sorts numerically
4. `tail -n 5` — shows the 5 longest reads

**Discussion answer:** `grep` cannot be used because quality lines do not have a consistent unique prefix. `NR%4==0` uses the mathematical property of FASTQ (every 4th line) rather than content matching.

---

## Exercise Set 3: Scripting and Automation

### 3.1 — From Command to Script

```bash
#!/usr/bin/env bash

echo -e "File\t\tReads"
for f in Training/long_reads/*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    echo -e "$(basename "$f")\t$reads"
done
```

Make executable: `chmod +x count_reads.sh`
Run: `./count_reads.sh`

**Discussion answer:** If run from a different directory, `Training/long_reads/*.fastq` will fail because it is a relative path. Fix: use an absolute path or pass the directory as an argument (Exercise 3.2).

---

### 3.2 — Making Scripts Flexible with Arguments

```bash
#!/usr/bin/env bash

DIR=$1

echo -e "File\t\tReads"
for f in "$DIR"/*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    echo -e "$(basename "$f")\t$reads"
done
```

Run:
```bash
./count_reads.sh Training/long_reads/
./count_reads.sh Training/short_reads/paired/
```

**Discussion answer:** Without an argument, `$1` is empty. The loop glob `/*.fastq` expands to an empty match and the script may print nothing or an error. The user has no idea what went wrong.

---

### 3.3 — Adding Input Validation

```bash
#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "Error: No directory provided."
    echo "Usage: ./count_reads.sh <directory>"
    exit 1
fi

if [ ! -d "$1" ]; then
    echo "Error: '$1' is not a valid directory."
    exit 1
fi

DIR=$1

echo -e "File\t\tReads"
for f in "$DIR"/*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    echo -e "$(basename "$f")\t$reads"
done
```

`-d` tests whether a path exists and is a directory.

**Discussion answer:** `exit 0` signals success; `exit 1` (or any non-zero) signals failure. Pipelines and workflow managers check exit codes to decide whether to proceed to the next step.

---

### 3.4 — Organising Samples by Condition

```bash
#!/usr/bin/env bash

mkdir -p results/case results/healthy

for f in Training/short_reads/unpaired/*.fastq.gz; do
    name=$(basename "$f")
    if echo "$name" | grep -q "Case"; then
        cp "$f" results/case/
    elif echo "$name" | grep -q "Healthy"; then
        cp "$f" results/healthy/
    fi
done
```

Expected result: 3 files in `results/case/`, 4 files in `results/healthy/`.

**Discussion answer:** For large files, use `ln -s` (symbolic links) instead of `cp` — this avoids duplicating hundreds of gigabytes of data while still making files appear in both locations.

---

### 3.5 — Logging Script Output

```bash
#!/usr/bin/env bash

LOG="read_counts_log.txt"
DIR=${1:-.}

echo "=== Run: $(date) ===" >> "$LOG"

echo -e "File\t\tReads"
for f in "$DIR"/*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    echo -e "$(basename "$f")\t$reads"
done | tee -a "$LOG"
```

`tee -a` prints to stdout AND appends to the file.

**Discussion answer:** Appending (`>>`) causes problems when you need to know which run produced which results and the log grows unboundedly. Overwriting (`>`) is better when only the latest result matters. In practice, including a timestamp in the log (as above) gives the best of both worlds.

---

### 3.6 — Dataset Summary (Challenge)

Reference solution structure (many valid implementations exist):

```bash
#!/usr/bin/env bash

TRAINING=${1:-Training}
OUTPUT="summary.txt"

{
echo "=== Training Dataset Summary ==="
echo "Date: $(date)"
echo ""

echo "--- Long Reads ---"
for f in "$TRAINING/long_reads/"*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    size=$(ls -lh "$f" | awk '{print $5}')
    printf "%-30s %7d reads  %s\n" "$(basename "$f")" "$reads" "$size"
done

echo ""
echo "--- Short Reads (Paired) ---"
for f in "$TRAINING/short_reads/paired/"*.fastq; do
    reads=$(( $(wc -l < "$f") / 4 ))
    size=$(ls -lh "$f" | awk '{print $5}')
    printf "%-30s %7d reads  %s\n" "$(basename "$f")" "$reads" "$size"
done

echo ""
echo "--- Short Reads (Unpaired) ---"
for f in "$TRAINING/short_reads/unpaired/"*.fastq.gz; do
    size=$(ls -lh "$f" | awk '{print $5}')
    printf "%-40s %s\n" "$(basename "$f")" "$size"
done

echo ""
total=$(ls "$TRAINING/short_reads/unpaired/"*.fastq.gz | wc -l)
cases=$(ls "$TRAINING/short_reads/unpaired/"*.fastq.gz | grep -c Case)
healthy=$(ls "$TRAINING/short_reads/unpaired/"*.fastq.gz | grep -c Healthy)
echo "Total unpaired samples: $total"
echo "Case samples:    $cases"
echo "Healthy samples: $healthy"
} | tee "$OUTPUT"
```

---

## Exercise Set 3: Conda and Environments

### 3.1 — Diagnosing Your Setup

```bash
conda --version
conda info
conda env list
```

Active environment is shown with `*` in `conda env list` and displayed in the prompt as `(envname)`.

**Discussion answer:** Installing everything in `base` risks version conflicts across projects, makes the environment fragile, and violates reproducibility — you cannot easily share just the packages needed for one project.

---

### 3.2 — Choosing the Right Channels

```bash
conda config --add channels bioconda
conda config --add channels conda-forge
conda config --set channel_priority strict
conda config --show channels
```

**Discussion answer:** The colleague may be installing from the `defaults` channel which has commercial licensing restrictions. They may also get outdated or incompatible versions of bioinformatics tools that are better maintained in `bioconda`.

---

### 3.3 — Creating a Reproducible Environment

```bash
conda create -n qc_env python=3.10
conda activate qc_env
conda install -c bioconda -c conda-forge fastqc multiqc
```

Export: `conda env export > qc_env.yml`

Recreate: `conda env create -f qc_env.yml`

**Discussion answer:** `--no-builds` removes platform-specific build strings, making the YAML file portable across Linux/Mac/Windows. Use `--no-builds` when sharing with colleagues on different systems.

---

### 3.4 — Debugging a Bad Install

1. Strategies in order:
   - Try installing one package at a time to isolate the conflict
   - Specify the channel explicitly: `conda install -c bioconda -c conda-forge minimap2 samtools`
   - Use `mamba` (faster solver that handles conflicts better): `mamba install minimap2 samtools`
   - Create a fresh environment and install from scratch

2. They installed into `(base)`, polluting the base environment and risking breaking other workflows.

3. `conda list`

**Discussion answer:** Bioinformatics tools often depend on compiled C/C++ libraries with strict version requirements (htslib, zlib, etc.). These system-level dependencies create more conflicts than pure Python packages.

---

### 3.5 — Environment Strategy

1. **One shared environment** — same pipeline, tools are likely compatible
2. **Separate environments** — explicit version requirement conflict
3. **One shared environment** — single end-to-end pipeline
4. **Separate environments** — you are deliberately testing version differences and need them isolated

**Discussion answer:** Too many environments waste disk space and make it hard to remember which environment to use. Too few environments cause version conflicts and reproducibility issues. Project-per-environment is usually the right balance.

---

### 3.6 — Connecting Conda to the Omics Workflow

```bash
conda create -n bioinfo python=3.10
conda activate bioinfo
conda install -c bioconda -c conda-forge fastqc multiqc flye minimap2 samtools
conda env export > bioinfo_environment.yml
```

Check `flye --version` failure reasons:
- Environment not activated (`conda activate bioinfo`)
- Tool not installed in this environment (`conda list | grep flye`)

**Discussion answer:** Give them: (1) `bioinfo_environment.yml` to recreate the environment, (2) `conda env create -f bioinfo_environment.yml` command, (3) `conda activate bioinfo` to use it.

---

## Exercise Set 4: Omics Integration

### 4.1 — Comparing Sequencing Technologies

```bash
head -n 8 Training/long_reads/barcode57.fastq
head -n 8 Training/short_reads/paired/SRR1553607_1.fastq
```

Expected comparison:

| Property | Nanopore (barcode57) | Illumina (SRR1553607_1) |
|----------|----------------------|--------------------------|
| Header contains | UUID, timestamp, sequencing chemistry | Run accession, read number, read length |
| Approximate read length | Variable, 300–2000+ bp (count sequence characters) | Fixed 101 bp (stated in header) |
| Quality string appearance | Mixed low/high ASCII characters | Mostly uppercase letters (high quality) |

3. The most obvious visual difference: Nanopore sequences are much longer — you can see this just by looking at how many characters are on line 2 of each record. Illumina reads are a uniform short length.

4. **Scenario answers:**
   - A 101 bp Illumina read **cannot** span a 400 bp repeat — the entire read falls inside the repeat and cannot be placed unambiguously.
   - A 1500 bp Nanopore read **can** span the repeat and extend into unique flanking sequence on both sides, giving the assembler enough context to place it correctly.
   - Choose **Nanopore** for this assembly.

**Discussion answer:** Even if Nanopore has a higher error rate, a long read that spans a repeat gives the assembler unambiguous placement information. Short reads that land entirely within a repeat look identical to reads from all other copies of that repeat — the assembler cannot tell which copy they came from.

---

### 4.2 — Coverage Estimation

Using the provided average read lengths:

**barcode57:**
```
Coverage = (8,567 reads × 2,900 bp) / 5,000 bp
         = 24,844,300 / 5,000
         = ~4,969×
```

**barcode58:**
```
Coverage = (9,196 reads × 3,100 bp) / 5,000 bp
         = 28,507,600 / 5,000
         = ~5,702×
```

**Combined:**
```
Coverage = ((8,567 + 9,196) reads × ~3,000 bp average) / 5,000 bp
         ≈ ~10,659×
```

Both samples individually far exceed 30×. Combining them is not necessary for depth — but might help if one sample has quality issues.

**Discussion answer:** Extremely high coverage can slow assemblers and in some cases introduce errors because there are many more reads to compare and error-correct. Some assemblers (like Canu) automatically subsample to a target depth. Flye is designed to handle very high Nanopore coverage well. The practical concern is mostly computation time.

---

### 4.3 — Running and Interpreting QC

1. Commands:
   ```bash
   fastqc Training/short_reads/unpaired/*.fastq.gz -o QC_results/
   multiqc QC_results/ -o QC_results/
   ```

2. Graph meanings:
   | Graph | What it tells you |
   |-------|------------------|
   | Per base sequence quality | Whether quality drops along the read length |
   | Adapter content | Whether synthetic adapter sequences contaminate your reads |
   | Per sequence GC content | Whether the GC distribution matches the expected organism |
   | Overrepresented sequences | Whether any sequence dominates (e.g., adapters, rRNA) |

3. Decisions:
   - Sample A (quality drop after pos 85): **Trim** — quality tail at the 3' end is normal for Illumina; trim to the point where quality drops
   - Sample B (92% adapter content): **Trim** — adapter contamination this high will ruin any downstream analysis
   - Sample C (bimodal GC): **Investigate further** — two GC peaks usually means two organisms (contamination or mixed infection); trimming will not fix this
   - Sample D (Q30+ throughout): **Keep as-is** — this is ideal data

4. Options for low-quality Case sample: (a) trim more aggressively and recheck QC; (b) exclude and note it in methods — but this changes your case/control ratio from 3:4 to 2:4; (c) include it and accept that it may add noise. **Never silently remove** — always document.

**Discussion answer:** Removing a Case sample because of quality could introduce selection bias. You are now comparing 2 Cases to 4 Healthy samples, and the removed Case might have been the most biologically important one. Any removal decision must be justified in the methods section.

---

### 4.4 — Choosing an Assembly Strategy

1. The problem: `barcode57.fastq` contains a mix of cassava host reads and viral reads. The cassava genome is ~750 Mb. Running Flye on the raw data would attempt to assemble the entire cassava genome alongside the virus, producing a massive, confusing output where viral contigs are buried among thousands of cassava contigs.

2. Contamination removal logic:
   - Reference: cassava genome (download from NCBI/Phytozome)
   - Tool: `minimap2` maps the reads to the cassava reference
   - Keep: reads that did **not map** to cassava — these are the virus reads
   - Output: a cleaned FASTQ file containing only unmapped reads, ready for Flye

3. Choose de novo when: you suspect a novel or divergent virus strain; your field isolate may differ enough from the reference that mapping would miss parts of it.
   Choose reference-based when: you know the exact strain you are looking for; you need a quick comparison against a known genome for routine surveillance.

4. `--genome-size 5k` tells Flye the expected genome size so it can set internal parameters (like minimum overlap length) appropriately. If badly wrong (e.g., `--genome-size 750m` instead of `5k`), the assembler would use settings designed for a large genome, likely producing poor results or running for an extremely long time.

**Discussion answer:** Skipping contamination removal means the assembler sees ~750 Mb of cassava data and ~0.03 Mb of virus. The cassava assembly would dominate completely. The viral signal would be so diluted that most viral reads would either be discarded or misassembled. You would spend days waiting for an assembly that tells you nothing about the virus.

---

### 4.5 — Interpreting Assembly Metrics

1. **Assembly A is better.** It has far fewer contigs (3 vs 47), a much larger largest contig (4,890 bp vs 1,203 bp), a high N50, and a total length close to the expected genome size (6,100 bp vs ~5,000 bp expected). Assembly B is fragmented and bloated.

2. N50 in plain language: Imagine lining up all your contigs from longest to shortest and adding up their lengths one by one. The N50 is the length of the contig you were holding when you reached the halfway point of your total assembly. A high N50 means a few long contigs make up most of the assembly — which is what you want.

3. Assembly B total length explanations: (a) contamination was not fully removed — cassava or other host sequence was assembled alongside the virus, inflating the total; (b) the assembler made mis-joins through repeat regions, creating chimeric contigs and inflating length.

4. The third contig in Assembly A could be: DNA-B (the second segment of the begomovirus genome, which is a separate circular molecule), a satellite DNA molecule associated with the virus, or a small amount of residual host sequence that escaped contamination removal.

**Discussion answer:** Consider a genome made of two copies of the same sequence. The assembler might join them into one long contig with a very high N50 — but the assembly is wrong because it collapsed what should be two separate loci. N50 should always be interpreted alongside biological expectations (expected genome size, expected number of segments).

---

### 4.6 — End-to-End Pipeline Design (Challenge)

Example reference design:

```
project/
├── raw/               # original barcode FASTQ files (never modified)
├── qc/                # FastQC and MultiQC outputs
├── clean/             # host-removed reads per sample
├── assembly/          # Flye output per sample
├── blast/             # BLAST annotation results
├── logs/              # one log file per step per sample
└── results/           # final summary table and consensus sequences
```

**Workflow:**

1. **QC** — Run FastQC on all 10 raw files; run MultiQC to aggregate; flag samples with average quality below Q15 or >50% adapter content
2. **Contamination removal** — Map each sample to cassava genome with minimap2; extract unmapped reads (the virus reads); save cleaned FASTQ to `clean/`
3. **Coverage check** — Use `wc -l` on each cleaned file, divide by 4 for read count, multiply by average read length, divide by 5000; flag samples below 30×
4. **Assembly** — Run Flye on each cleaned sample; review `assembly_info.txt` for contig count, N50, and total length
5. **Confirmation** — BLAST top contigs against NCBI or a local ACMV reference; require ≥90% identity; anything below is not confirmed ACMV
6. **Automation** — Wrap steps 2–5 in a `for` loop with the sample name as a variable (from Module 1 scripting)
7. **Final output** — A table with columns: sample ID | raw reads | clean reads | coverage | N50 | top BLAST hit | % identity | ACMV infected (yes/no)

**Discussion answer:** All per-sample steps (QC, contamination removal, assembly) can run in parallel across samples because each sample is independent. Within a single sample, the steps must run in order: QC → clean → assemble → BLAST. The dependency graph looks like 10 independent vertical pipelines running side by side, not one long chain.
