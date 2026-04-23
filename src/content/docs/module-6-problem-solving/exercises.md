---
title: "Module 6 Exercises — Computational Thinking for Bioinformatics"
---


> **Note for students:** These exercises are designed to develop your thinking, not test your memorisation. Many questions have multiple valid answers. The goal is to justify your reasoning — not to arrive at a single "correct" solution. Discuss your approaches with your peers.

---

## Exercise 1: Worked Example — Systematic Decomposition of a New Problem

**Format:** Step-by-step guided problem  
**Difficulty:** Moderate  
**Estimated time:** 45 minutes  
**Principle focus:** Decomposition + Algorithm Design

---

### Background

A research group has collected field samples from tomato plants showing stunted growth and yellowing leaves across three farms in different regions. They suspect a whitefly-transmitted virus (possibly a begomovirus or crinivirus) but do not know the species. They have access to the following data:

- 6 FASTQ files from Oxford Nanopore sequencing (2 samples from each farm)
- No prior viral sequences from these farms
- A tomato reference genome (Solanum lycopersicum) is available on NCBI

**Final goal:** Determine the species of virus (or viruses) infecting these plants, and describe whether the same virus is present on all three farms.

---

### Part A: Apply the Five Questions (10 marks)

Answer all five questions from the systematic framework before designing any pipeline.

1. **Q1 (What is the final biological output?):** Describe what form your answer will take. Be specific — what file(s) or figure(s) will you present to the research group?

2. **Q2 (What data do I start with?):** List everything you know about the data at the start of the analysis. Include data format, technology, known characteristics of Nanopore reads, and what you do *not* know.

3. **Q3 (What is the logical gap?):** Map the transformation from raw FASTQ files to your final output. What are the major phases?

4. **Q4 (What are the known failure modes?):** Identify at least four specific things that could go wrong in this analysis, and at which step each would occur.

5. **Q5 (What defines "good enough"?):** For each major phase of your analysis, state one quantitative or qualitative threshold that tells you when to proceed vs. investigate.

---

### Part B: Build a Decomposition Tree (15 marks)

Draw (or write in indented text) a decomposition tree for this analysis. Your tree must reach the level where each leaf node specifies:
- A clear input
- A specific tool or method
- A clear output

Your tree should have at least 4 levels of depth for the most complex branch, and must include at least one "What if this fails?" branch.

---

### Part C: Identify Patterns (10 marks)

From the Pattern Catalogue in Lesson 3, identify which three patterns are most likely to be relevant in this analysis. For each:
1. Name the pattern
2. Describe how it might present in this specific dataset
3. State what you would do if you observed it

---

### Part D: Make Algorithm Choices (15 marks)

For each of the following steps, name your preferred tool and justify the choice using at least two factors from the SACRED framework:

1. Host read removal
2. De novo assembly
3. Viral contig identification
4. Phylogenetic analysis
5. Comparing whether the same virus is present across three farms (hint: this is a *comparison* problem — what metric or analysis would you use?)

---

## Exercise 2: Case Study — A GWAS Gone Wrong

**Format:** Realistic scenario with multiple valid approaches  
**Difficulty:** Hard  
**Estimated time:** 60 minutes  
**Principle focus:** Pattern Recognition + Abstraction

---

### Background

A master's student is running a GWAS to identify genetic variants associated with malaria severity in 2,000 individuals from two countries: Kenya (n=1,000) and Ghana (n=1,000). Cases are defined as individuals hospitalised with severe malaria; controls are community-recruited individuals without severe disease history.

The student has completed genotyping QC and runs the initial association analysis. The results are:

- Genomic inflation factor λ = 1.89
- QQ plot shows strong deviation across all p-values, not just at the top hits
- Manhattan plot shows hits scattered across many chromosomes with no obvious peak
- PCA plot: PC1 separates Kenyan and Ghanaian samples perfectly

---

### Part A: Diagnosis (20 marks)

1. **What is the most likely cause of λ = 1.89?** Use the decomposition approach from Lesson 3 to systematically list *all* possible causes, then argue for the most likely one based on the PCA finding.

2. **What specific pattern from the Pattern Catalogue does this match?** Describe how this pattern should have been anticipated before running the analysis.

3. **The student argues:** "The result might be real — maybe there are thousands of genetic differences between Kenya and Ghana that are all associated with malaria severity." Evaluate this argument. What specific diagnostic would you use to test whether the student is correct?

4. **Abstraction failure:** The original analysis treated the two-country cohort as a single homogeneous group. Describe precisely what information was abstracted away, why that abstraction was invalid, and what a better abstraction would look like.

---

### Part B: Corrective Strategies (20 marks)

Propose three different algorithmic approaches to correcting for population stratification in this GWAS. For each approach:

1. Describe the method
2. State which PLINK/GATK command (or R package) implements it
3. Evaluate it using the SACRED framework (at minimum: accuracy, ease, data suitability)
4. Recommend which approach is most appropriate for this specific scenario and justify your choice

---

### Part C: Open Reflection (10 marks)

The student says: "If I had to start over, I would only include samples from one country so I don't have to deal with stratification."

Evaluate this proposal from a scientific perspective. Is this the right solution? What is lost by this approach? What principle of computational thinking is relevant here?

---

## Exercise 3: Pseudocode and Algorithm Design

**Format:** Hands-on coding/pseudocode exercise  
**Difficulty:** Moderate–Hard  
**Estimated time:** 60 minutes  
**Principle focus:** Algorithm Design + Decomposition

---

### Background

You have a FASTQ file of Nanopore reads from a mixed sample. You want to write a shell script that automates the complete host-filtering and assembly pipeline. You will write this first as pseudocode, then as real bash commands.

---

### Part A: Write the Pseudocode (20 marks)

Write pseudocode for a script that:
1. Accepts a FASTQ file path and a host genome path as command-line arguments
2. Runs NanoStat to assess read quality and saves the report
3. Maps reads to the host genome using minimap2
4. Extracts unmapped (non-host) reads using samtools
5. Calculates estimated coverage (using a hardcoded genome size of 5000 bp)
6. Prints a warning if coverage is below 30×
7. Runs Flye assembly if coverage is adequate
8. Runs samtools flagstat on the mapping output and saves it

Your pseudocode should use plain English structured like code — with `IF/ELSE`, `FUNCTION`, `FOR`, etc. It does not need to be valid bash.

**Example pseudocode format:**
```
FUNCTION calculate_coverage(reads_file, genome_size):
    line_count = COUNT_LINES(reads_file)
    read_count = line_count / 4
    avg_length = ESTIMATE_MEAN_LENGTH(reads_file)
    coverage = (read_count × avg_length) / genome_size
    RETURN coverage
```

---

### Part B: Convert to Bash (20 marks)

Translate your pseudocode into a working bash script. Your script must:

- Use variables for file paths (not hardcoded paths throughout)
- Include `set -euo pipefail` at the top (explain in a comment what this does)
- Include at least one `if/else` block (e.g., coverage check)
- Use `echo` statements to report progress at each step
- Save all outputs to a structured directory (e.g., `results/qc/`, `results/assembly/`)

You may reference the tools: `NanoStat`, `minimap2`, `samtools`, `flye`

---

### Part C: Algorithm Evaluation (10 marks)

Your script uses a fixed genome size estimate of 5,000 bp for the coverage calculation. 

1. What is the risk of using an incorrect genome size estimate? Give one example where this would cause a false pass and one where it would cause a false fail.

2. Propose an alternative approach that avoids hardcoding the genome size. What data would you use? What tool?

3. The script uses `set -euo pipefail`. What would happen without this line if `minimap2` failed silently? Which computational thinking principle does `set -euo pipefail` implement?

---

## Exercise 4: Open-Ended Problem-Solving Challenge

**Format:** Open-ended, no single correct answer  
**Difficulty:** Challenge  
**Estimated time:** 90 minutes (or longer, depending on depth)  
**Principle focus:** All four principles — integrated

---

### Background

You have just joined a new research group. Your supervisor hands you a folder containing:

- 12 FASTQ files from Illumina paired-end sequencing (150 bp reads)
- A sample sheet with 12 sample IDs and a column called "treatment" with values "control", "low_dose", and "high_dose" (4 replicates per group)
- A note that says: "These are RNA-Seq samples from zebrafish embryos treated with a novel antifungal compound. We want to know which genes are affected."
- No other information

---

### Part A: Information Gathering (10 marks)

Before designing your analysis, identify the 10 most important questions you would ask your supervisor. For each question, explain *why* you need the answer and *how* the answer would change your pipeline.

Organise your questions in order of priority.

---

### Part B: Design Under Uncertainty (20 marks)

You cannot reach your supervisor immediately. Design a provisional analysis pipeline that:

1. Makes explicit assumptions where information is missing
2. Is modular enough to be revised when you get answers
3. Includes at least two decision points where the path changes based on data quality
4. Addresses the possibility that the zebrafish transcriptome reference is not available (what would you do?)

Write your pipeline as a decomposition tree with justifications for all major tool choices.

---

### Part C: Interpret Unexpected Results (20 marks)

Your supervisor returns and you run the initial pipeline. You get the following results:

- DESeq2 reports 0 DE genes between control and low_dose
- DESeq2 reports 4,872 DE genes between control and high_dose
- PCA shows that the 4 replicates within the control group are very spread out (PC1 accounts for 62% of variance within controls)

For each of the three observations:
1. Propose the two most likely explanations
2. Describe one diagnostic check you would run
3. State what computational thinking principle is most relevant

---

### Part D: Scientific Communication (10 marks)

Your supervisor asks you to present your analysis plan in a 5-minute meeting. 

Write a structured outline of what you would say — covering:
- The problem (in one sentence)
- Your decomposition (major phases only)
- Your key algorithm choices and why
- The two biggest risks in the analysis and how you will mitigate them
- What "done" looks like — what files or figures will you present?

You are not allowed to say "I'll just run [tool name]" without explaining what decision that tool is making.

---

## Submission Notes

- Submit written answers as PDF or Word documents
- Pseudocode and bash scripts should be submitted as `.txt` or `.sh` files
- For decomposition trees, you may submit a hand-drawn diagram (photographed) or a text-based tree
- Exercises 1 and 2 may be completed in pairs; Exercises 3 and 4 should be individual
- There are no definitive "wrong" approaches in Exercises 2 and 4 — you will be evaluated on the quality of your reasoning, not on matching a model answer
