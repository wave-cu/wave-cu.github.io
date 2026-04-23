---
title: "Exercise Set 4: Omics Integration"
---


**Difficulty:** Hard → Challenge
**Topics:** FASTQ format, QC, coverage estimation, assembly strategy, full pipeline design

This is the capstone exercise set. It combines Linux, Conda, and omics concepts into realistic scenarios. Some questions have no single right answer — the goal is to think like a bioinformatician.

---

## Exercise 5.1 — Comparing Sequencing Technologies (Hard)

You have two types of data in the Training folder: Nanopore long reads (`long_reads/`) and Illumina short reads (`short_reads/paired/`).

1. Use `head` to inspect the first 8 lines (two complete reads) of each of these files:
   - `Training/long_reads/barcode57.fastq`
   - `Training/short_reads/paired/SRR1553607_1.fastq`

2. Based on what you see, fill in the following table as a class. You should be able to answer everything from the raw file headers and sequences alone:

   | Property | Nanopore (barcode57) | Illumina (SRR1553607_1) |
   |----------|----------------------|--------------------------|
   | Header contains | ? | ? |
   | Approximate read length | ? | ? |
   | Quality string appearance | ? | ? |

3. Look at a Nanopore sequence and an Illumina sequence side by side. What is the most obvious visual difference?

4. **Scenario:** You need to assemble a viral genome that is ~5 kb long and contains a large repetitive region that is ~400 bp wide. The same 400 bp sequence appears 4 times across the genome.
   - Can a 101 bp Illumina read span that repeat? What about a 1500 bp Nanopore read?
   - Which technology would you choose for this assembly, and why?

> **Discussion:** Illumina short reads have very high accuracy (~99.9% per base). Nanopore reads are less accurate but much longer. Why does read length matter more than accuracy when dealing with repetitive sequences?

---

## Exercise 5.2 — Coverage Estimation (Hard)

Before running an assembly, you should estimate whether you have enough sequencing depth (coverage). This tells you if the assembler has enough information to reconstruct the genome reliably.

The formula is:
```
Coverage = (Number of reads × Average read length) / Genome size
```

A generally accepted minimum for a reliable assembly is **30× coverage**.

The average read length for each file has been calculated for you:

| File | Average read length |
|------|-------------------|
| barcode57.fastq | ~2,900 bp |
| barcode58.fastq | ~3,100 bp |

1. You already calculated the number of reads for each file in Exercise 1.2. Using the table above and a **target genome size of 5,000 bp**, calculate the estimated coverage for `barcode57.fastq`.

2. Do the same for `barcode58.fastq`.

3. If you combined both files into one before assembly, what would the combined coverage be?

4. Is 30× met for each sample individually? Would combining them change your decision?

5. What would happen to your assembly quality if coverage dropped to 5×? What about 5000×?

> **Discussion:** More coverage is not always better. Can you think of a reason why extremely high coverage (e.g., 5000×) might actually cause problems for an assembler?

---

## Exercise 5.3 — Running and Interpreting QC (Hard)

You have 7 samples in `Training/short_reads/unpaired/`. Before any analysis, you need to run quality control.

1. You have FastQC and MultiQC installed in your `bioinfo` Conda environment. Write the two commands needed to:
   - Run FastQC on all 7 compressed samples, saving results to a folder called `QC_results/`
   - Aggregate all FastQC reports into a single MultiQC report

2. FastQC reports include several graphs. Match each graph to what it tells you:

   | Graph | What it tells you |
   |-------|------------------|
   | Per base sequence quality | ? |
   | Adapter content | ? |
   | Per sequence GC content | ? |
   | Overrepresented sequences | ? |

3. You run QC and get the following results. For each, decide: **keep as-is**, **trim**, or **investigate further**. Justify your answer.
   - Sample A: Quality drops below Q20 after position 85 out of 101
   - Sample B: 92% of reads contain adapter sequences
   - Sample C: GC content shows two distinct peaks instead of one bell curve
   - Sample D: All quality scores are above Q30 for the full read length

4. Your MultiQC report shows that `SRR11282410_Case.fastq.gz` has significantly lower overall quality than all other samples. It is one of your 3 Case samples. What are your options? What is the risk of each?

> **Discussion:** Should you remove a low-quality sample from a case/control study just because it looks worse than the others? What scientific and statistical problems could this create?

---

## Exercise 5.4 — Choosing an Assembly Strategy (Hard)

You are working with the cassava virus data from Module 3. You have:
- `barcode57.fastq` — Nanopore long reads from a potentially infected plant
- `barcode58.fastq` — Nanopore long reads from another sample

1. A student says: "I have my reads, I'll just run Flye directly on `barcode57.fastq` right now." What is the problem with this plan? What will the assembly contain that you do not want?

2. Before assembly, you need to remove host (cassava) contamination. Walk through the logic:
   - What reference sequence do you need to download first?
   - What tool maps the reads to that reference?
   - After mapping, do you keep the reads that **mapped** to cassava, or the reads that **did not map**? Why?
   - What file do you pass into the assembler after this step?

3. After contamination removal, you have two choices:
   - **De novo assembly** — assemble with no reference, let the assembler figure it out
   - **Reference-based assembly** — map reads to a known ACMV reference genome

   Give one situation where you would choose de novo, and one situation where reference-based is sufficient.

4. You run Flye with the cleaned reads. The command from Module 3 looks like this:
   ```bash
   flye --nano-raw clean_reads.fastq --out-dir assembly/ --genome-size 5k
   ```
   What does `--genome-size 5k` tell the assembler? What might happen if you got this number badly wrong?

> **Discussion:** A colleague wants to skip the contamination removal step to save time — "it's just a few extra steps." What specific problems would this cause? Convince them it is worth doing.

---

## Exercise 5.5 — Interpreting Assembly Metrics (Hard)

After running Flye, you get two different assemblies from two different samples. Flye produces a summary file (`assembly_info.txt`) that reports these statistics:

| Metric | Assembly A | Assembly B |
|--------|-----------|-----------|
| Number of contigs | 3 | 47 |
| Largest contig | 4,890 bp | 1,203 bp |
| N50 | 4,890 bp | 820 bp |
| Total assembled length | 6,100 bp | 12,500 bp |
| Coverage depth | 450× | 450× |

The expected viral genome size is ~5 kb (it has two segments: DNA-A ~2.8 kb and DNA-B ~2.6 kb).

1. Which assembly is better? Justify your answer using at least two of the metrics above.

2. What does **N50** mean? Explain it in plain language without using any formulas.

3. Assembly B has a total length of 12,500 bp — more than twice the expected genome size. Both samples had the same coverage, so it is not a data volume problem. What are two possible explanations for this?

4. Assembly A has 3 contigs but the genome only has 2 segments. What could the third contig represent?

> **Discussion:** N50 is the most commonly used metric to judge assembly quality, but it can be misleading. Describe a scenario where an assembly could have a very high N50 but still be wrong or problematic.

---

## Exercise 5.6 — End-to-End Pipeline Design (Challenge)

This is an open-ended design exercise. There is no single correct answer — focus on your reasoning.

**Scenario:** You have just received 10 Nanopore sequencing runs from a cassava field survey in Uganda. Each run is a separate barcode FASTQ file (like `barcode57.fastq`). Your goal is to determine which of the 10 plants are infected with ACMV (African Cassava Mosaic Virus).

Design a complete analysis pipeline. You do not need to write every command — describe the steps, the tools, and the reasoning.

1. **Folder structure** — Sketch the directory layout you would use. What goes where?
2. **QC** — What do you check? What do you do with a sample that fails?
3. **Contamination removal** — What reference do you need and what tool do you use?
4. **Coverage check** — Before assembling, how do you verify each sample has enough depth?
5. **Assembly** — De novo or reference-based? Does your answer change depending on the question you are trying to answer?
6. **Confirmation** — After assembly, how do you confirm that a contig is actually ACMV and not something else?
7. **Automation** — You have 10 samples. How do you avoid running every command 10 times manually?
8. **Final output** — What would your results table look like? What columns would it have?

> **Discussion:** In a real disease outbreak, speed matters. Which of the 8 steps above can run at the same time (in parallel)? Which must happen in a fixed order? If you had to draw this as a flowchart, what would it look like?
