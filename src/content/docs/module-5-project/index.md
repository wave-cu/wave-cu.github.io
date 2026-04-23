---
title: "🧬 Bioinformatics Project: Characterising a Cassava Begomovirus from Raw ONT Reads"
---

### *An Open-Ended Analytical Exercise*


> **Course:** Bioinformatics Practicum
> **Format:** Independent Project
> **Estimated Time:** 4–6 hours
> **Submission Deadline:** 24th April 2025
> **Submit to:** Email address provided by course facilitators

---

## 📌 Background

Cassava (*Manihot esculenta*) is one of the most important food security crops across sub-Saharan Africa and the broader tropical world. It is, however, highly susceptible to **cassava mosaic disease (CMD)**, caused by a complex of single-stranded DNA viruses belonging to the genus *Begomovirus* (family *Geminiviridae*). These viruses — including *East African cassava mosaic virus* (EACMV), *East African cassava mosaic Cameroon virus* (EACMCV), and related species — are transmitted by the whitefly *Bemisia tabaci* and represent a serious and ongoing threat to food production.

You have been given raw **Oxford Nanopore Technology (ONT) long-read sequencing data** from a cassava leaf sample suspected to be infected with a begomovirus. The sample was sequenced directly from extracted DNA, without any prior host depletion step. This means the FASTQ file contains a mixture of reads originating from both the **cassava host genome** and the **viral pathogen**. Your task is to process this raw data and — through whatever analytical approach you consider appropriate — ultimately generate a **phylogenetic tree** that places your virus within the known diversity of cassava begomoviruses.

---

## 🎯 Objective

> **Starting from the raw FASTQ file below, generate a phylogenetic tree that reveals the identity and evolutionary relationships of the begomovirus present in this sample. Document your entire analytical process.**

Your raw sequencing data is located at:

```
Training/long_reads/barcode57.fastq
```

This file contains ONT reads from a barcoded cassava sample. The reads are in FASTQ format and represent an unprocessed, host-contaminated metagenomic dataset.

---

## 🖥️ Computing Environment

A conda environment called **`bioinfo`** has been set up for you and contains the majority of commonly used bioinformatics tools. Activate it before starting:

```bash
conda activate bioinfo
```

To see what is already available in the environment:

```bash
conda list -n bioinfo
```

If you identify a tool that you would like to use and it is not present, you are free to install it into the **same `bioinfo` environment**:

```bash
conda install -n bioinfo -c bioconda <tool_name>
# or
pip install <tool_name>
```

**Important:** For persons using the jupyterhub environment, the bioinfo environment is shared across all users and as such is managed by the course facilitators. If you need a tool that is not in the environment, you can create a separate conda environment for your project and install it there. You can then activate that environment when you need to use the tool. For example:

```bash
conda create -n <new_env_name> -c <channel_name> <python=3.12> <tool_name>
conda activate <new_env_name>
```

> You are responsible for justifying any additional tools you install — explain in your write-up why you chose them over the available alternatives.

---

## 📋 What We Expect From You

This is not a protocol to follow. There is no single correct pipeline. You are expected to make your own decisions about how to approach this problem — from the very first step to the final tree — and to justify each of those decisions in writing.

As you work, ask yourself:

- Why am I doing this step?
- Are there alternative tools or approaches I could have used?
- How do I know my results at each stage are reliable?
- What assumptions am I making, and how might they affect my conclusions?

---

## 📦 Deliverables

Send all deliverables as **email attachments** to the course email address provided by your co-facilitator, no later than **24th April 2025**. Use the subject line:

```
[Bioinformatics Project] Firstname Lastname – barcode57
```

Organise your files clearly before attaching. Large files (e.g., FASTA sequences, alignment files) should be compressed with `zip` or `tar.gz` before attaching. If your total attachment size exceeds your email provider's limit, share via a cloud link (Google Drive, OneDrive, etc.) included in the body of the email.

---

### 1. 🗺️ Workflow Diagram *(Required)*

Produce a clear visual diagram of the pipeline you implemented. The diagram should:

- Show every major step you performed, in sequence
- Indicate the **input and output** of each step — including file formats (e.g., `.fastq → .bam → .fasta`)
- Name the **specific tool** used at each step
- Highlight any **decision points** where you chose between alternative approaches and explain which path you took

The diagram can be created using any tool you prefer — draw.io, Lucidchart, Mermaid (in Markdown), PowerPoint, or even hand-drawn and photographed. Export it as a `.png` or `.pdf` and include it in your submission.

> 💡 A well-drawn workflow diagram tells us, at a glance, whether you understood the logic of what you were doing — not just whether the commands ran.

---

### 2. 📄 Written Report (`report.md`)

Write a clear and concise report in Markdown format covering the following sections:

**a) Introduction**
In your own words, describe the biological question you are trying to answer and why it matters.

**b) Methods**
Describe every step of your pipeline. For each step, explain:
- What you did and why
- Which tool(s) you used and why you chose them over alternatives
- What parameters you set and the reasoning behind them
- Any challenges you encountered and how you resolved them

**c) Results**
Present your key findings at each stage. Include:
- Summary statistics from quality assessment
- Evidence of viral read identification
- Assembly or consensus generation statistics, where applicable
- Your final phylogenetic tree, embedded as an image

**d) Interpretation**
Address the following questions in your own words:

1. What begomovirus species or clade does your sample most closely belong to, based on your tree?
2. How confident are you in this placement? What evidence from your analysis supports it?
3. Were there steps in your pipeline where you made a significant choice between two possible approaches? What were the trade-offs of each?
4. What are the limitations of your analysis? What would you do differently with more time or resources?
5. If this result were to inform a disease management recommendation for cassava farmers in the region, what would your key message be?

---

### 3. 🎤 Presentation Slides (`.pptx`)

You will present your project to the class during the Friday session following the submission deadline. Prepare a **PowerPoint presentation** (`.pptx` format) that covers:

- **Background** — briefly frame the biological problem for your audience
- **Your workflow** — walk through the pipeline you designed, using your workflow diagram as a visual anchor
- **Key results** — show the most important outputs at each stage (QC plots, coverage statistics, your phylogenetic tree)
- **Interpretation** — what does your tree tell you about the virus? Where does your sample sit among known begomoviruses?
- **Reflection** — what worked well, what would you do differently, and what are the limitations of your analysis?

**Guidelines for your slides:**
- Aim for **10–15 slides** — be concise and visual; avoid dense blocks of text
- Your phylogenetic tree must appear as a clearly labelled, readable figure
- Include your workflow diagram as a slide (it can be the same one submitted with your report)
- Presentations will be followed by a short **Q&A from your classmates and co-facilitators**

> Submit the `.pptx` file together with your other deliverables via email by the deadline. You will present from your own copy on the day.

---

### 4. 🌳 Phylogenetic Tree File

Submit the raw tree file produced by your phylogenetics tool (e.g., `.treefile`, `.nwk`, or `.nex`), along with an annotated, clearly readable image of the tree. Sequence labels should be informative enough for an external reader to understand what each tip represents.

---

### 5. 🧬 Consensus / Assembly Sequence

Submit the final viral genome sequence(s) you generated in FASTA format, with descriptive sequence headers.

---

### 6. 📁 Key Intermediate Files *(where file size permits)*

You do not need to submit every intermediate file. Include only those that are essential for understanding or reproducing your results — for example, your alignment file, read mapping statistics, or coverage outputs.

---

---

## 🔎 Hints and Guiding Questions

We are not telling you what steps to take, but the following questions may help you think through the problem:

- What do you need to know about your data before you can trust it for downstream analysis?
- The sample contains cassava host DNA. How will you deal with that, and at what point in your pipeline?
- Begomoviruses have genomes of approximately 2.8 kb per component and can be monopartite or bipartite. How does knowing this help you interpret your results?
- How will you establish which reads are viral? What external resources might help?
- What do you need in order to build a meaningful phylogenetic tree? What makes a good set of reference sequences?
- Phylogenetic trees are model-based. What assumptions does your chosen model make, and do they matter for this type of virus?

---

## 📚 Useful Resources

The following are starting points — you are encouraged to explore beyond them:

- **NCBI GenBank** — https://www.ncbi.nlm.nih.gov/nucleotide/ — for retrieving reference begomovirus sequences
- **ICTV Begomovirus resources** — https://ictv.global/taxonomy — for species demarcation criteria
- **Bioconda** — https://bioconda.github.io/ — for discovering and installing additional tools
- **IQ-TREE documentation** — http://www.iqtree.org/doc/
- **Minimap2 manual** — https://lh3.github.io/minimap2/minimap2.html

---

## 🤝 How to Get Help

This project is designed to be worked on collaboratively. You are encouraged to **discuss ideas, strategies, and approaches with your fellow participants** — talking through a problem is one of the most effective ways to understand it deeply.

You are also welcome to **use AI tools** (such as ChatGPT, Claude, or others) to help you write code, troubleshoot errors, or understand concepts. If you do, engage critically with the output — do not accept it blindly, and make sure you understand what it is doing and why.

If you are stuck at any point, **reach out to any of the co-facilitators directly** — you do not need to wait for the Friday session. We are available throughout and happy to help you think through the problem.

---

*Exercise designed for the Bioinformatics Practicum. Questions? Reach out to a co-facilitator during the Friday session or send an email to the course address.*

---
**Version:** 3.0 | **Submission deadline:** 24th April 2025
