---
title: "Lesson 1 — Introduction to Computational Thinking"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Define computational thinking in your own words and distinguish it from programming
- Explain why computational thinking is the foundation of effective bioinformatics
- Name and briefly describe the four core principles: decomposition, pattern recognition, abstraction, and algorithm design
- Articulate why no single tool or pipeline solves every biological problem

---

## 1. What Is Computational Thinking?

Computational thinking is a problem-solving approach that involves breaking down complex problems into structured, manageable parts that can be understood and, where appropriate, solved by computers or by humans using computational logic.

The term was popularised by Jeannette Wing in a 2006 essay in *Communications of the ACM*, where she argued that computational thinking is a fundamental skill for everyone, not just computer scientists. Her core claim was simple: thinking computationally means thinking clearly about structure, process, and data — regardless of whether a computer is ultimately involved.

> **Key definition:** Computational thinking is the process of formulating problems and their solutions in a way that makes them tractable — for a computer, a pipeline, or yourself.

This definition has an important implication: computational thinking is not the same as programming. You can write hundreds of lines of code without thinking computationally. And you can think computationally about a problem you will never automate. The two skills are related but distinct.

---

## 2. Why Computational Thinking Is Not the Same as Coding

Consider two researchers who both need to identify variants in a set of whole-genome sequencing samples.

**Researcher A** opens a browser, searches for "variant calling pipeline", finds a tutorial, installs the tools, runs the commands, and submits the results. If something goes wrong — a file format mismatch, a tool crash, an unexpected output — they are stuck. They have learned to operate a pipeline but not to understand it.

**Researcher B** starts by asking: what exactly is a variant? What data do I need to find one? What steps transform raw reads into a variant call? What could go wrong at each step, and how would I know? They then find the same tools, run the same commands — but when something goes wrong, they know where to look and why.

Researcher B is thinking computationally. The difference is not technical sophistication; it is structured reasoning.

In bioinformatics specifically, computational thinking matters because:

1. **Datasets are large and heterogeneous.** Errors are hard to spot by eye. You need a mental model of the whole pipeline to know when something is wrong.
2. **Tools are specialised.** No single tool does everything. Understanding the problem helps you select and combine the right tools.
3. **Biology is noisy.** Real data has missing values, contamination, and unexpected variation. Pipelines built without computational thinking break under realistic conditions.
4. **Fields evolve rapidly.** New sequencing technologies and analysis methods appear constantly. Computational thinking lets you adapt because you understand principles, not just commands.

---

## 3. The Four Core Principles

Computational thinking is typically described as comprising four interconnected principles. We will devote a full lesson to each, but it is important to introduce them together because they are not a sequence — they are a toolkit that you apply simultaneously and iteratively.

### 3.1 Decomposition

**Breaking a complex problem into smaller, manageable sub-problems.**

When you faced the Module 5 begomovirus project, the problem was: "given a raw FASTQ file from a mixed sample, generate a phylogenetic tree." That is not one problem. It is at least seven: assess data quality, filter host reads, assemble viral contigs, evaluate assembly quality, annotate sequences, align to references, and infer phylogeny. Each of those is itself decomposable.

Decomposition is the first thing you do with any problem you do not immediately know how to solve.

### 3.2 Pattern Recognition

**Identifying similarities, recurring structures, and shared features across problems.**

When you ran FastQC on a Nanopore file and then on an Illumina file, you noticed that both had a quality score plot — but the shape was different. That recognition — "same tool, different pattern, different interpretation" — is pattern recognition. More broadly, recognising that "this is a mapping problem" or "this is a clustering problem" lets you apply solutions you have already learned to new domains.

### 3.3 Abstraction

**Identifying the essential features of a problem and deliberately ignoring irrelevant details.**

When you estimated coverage before assembly, you did not need to know the exact DNA extraction protocol or the name of the person who ran the sequencer. You needed three numbers: read count, average read length, and genome size. Abstraction is the act of deciding which details matter and which can be safely ignored — at least for the current step of the analysis.

### 3.4 Algorithm Design

**Creating a clear, unambiguous, step-by-step procedure to solve a problem.**

An algorithm is not a piece of code. It is a recipe. When you decided to filter host reads with Minimap2 before assembly, rather than assembling everything and filtering afterwards, you were making an algorithmic decision. Different algorithms for the same problem have different trade-offs in speed, accuracy, memory, and robustness — and choosing the right one requires understanding both the algorithm and the problem.

---

## 4. The Four Principles as a System

These four principles are not applied in strict order. A realistic problem-solving session looks more like this:

```
Problem arrives
    → Decompose it roughly
    → Recognise patterns from known problems
    → Abstract away irrelevant details
    → Design an algorithm for the first sub-problem
    → Run it → Examine results
    → Discover new sub-problems or revise your decomposition
    → Repeat
```

This is an iterative cycle, not a linear checklist. The Module 5 begomovirus project was a perfect example: many of you discovered, after assembly, that you had unexpected contigs that required a new sub-problem (what organism is this?), which required new pattern recognition (BLAST results look like plant plastid sequences), which required a revised algorithm (filter those contigs before phylogenetic analysis).

That is not failure. That is bioinformatics.

---

## 5. Relevance to the Tools You Already Know

Every major bioinformatics tool embeds computational thinking decisions made by its authors. Understanding those decisions makes you a better user — and eventually a better developer.

| Tool | Principle embedded |
|------|--------------------|
| FastQC | **Abstraction** — reports summary statistics rather than showing you every base |
| Flye | **Algorithm design** — uses a repeat graph approach specifically designed for noisy long reads |
| Minimap2 | **Pattern recognition** — uses minimiser sketches to find likely alignment locations quickly |
| GATK HaplotypeCaller | **Decomposition** — breaks variant calling into local reassembly, haplotype generation, and genotyping |
| BLAST | **Abstraction + pattern recognition** — compares sequences by finding short word matches, not full alignments |
| Trinity | **Decomposition** — breaks RNA-Seq assembly into in silico normalisation, assembly of read clusters, and graph traversal |

When you understand *why* a tool works the way it does, you know when to trust its output and when to question it.

---

## 6. A Concrete First Example: Quality Control

Let us revisit a familiar problem through the lens of computational thinking.

**The problem:** You have just received FASTQ files from a sequencing facility. Are they good enough to analyse?

**Without computational thinking:** Run FastQC, look at whether the icons are green, proceed.

**With computational thinking:**

1. **Decompose:** What does "good enough" mean? You need to assess: (a) base quality scores, (b) adapter contamination, (c) read length distribution, (d) GC content, (e) sequence duplication.

2. **Pattern recognition:** You have seen this before — or you recognise that low-quality 3' ends are characteristic of Illumina sequencing chemistry fatigue; adapter contamination is common when insert sizes are small.

3. **Abstraction:** For a viral genome assembly, GC content distribution matters less than base quality and adapter contamination. For a metagenomics study, it matters more. Focus on what is relevant to your downstream goal.

4. **Algorithm design:** Do you trim first and then assess? Or assess first and then make a decision about trimming? The latter gives you a baseline. FastQC → inspect → Trimmomatic/Cutadapt → FastQC again → compare. That sequence is an algorithm.

The FastQC output is the same in both cases. The *understanding* of what it means and what to do with it differs entirely.

---

## 7. Summary

| Concept | One-line definition |
|---------|-------------------|
| Computational thinking | Structured problem-solving applicable to complex, data-driven tasks |
| Decomposition | Break the problem apart |
| Pattern recognition | Find familiar structures in unfamiliar problems |
| Abstraction | Focus on what matters; ignore what does not |
| Algorithm design | Build a clear, justified procedure |

> **Key takeaway:** Computational thinking is the skill that converts biological questions into executable analyses. Programming implements those analyses, but it cannot substitute for the thinking that precedes it. The most powerful thing you can do as a bioinformatician is to slow down before you type the first command.

---

## Looking Ahead

Lesson 2 takes each of the four principles in turn and builds them out in depth, with multiple bioinformatics examples drawn from genome assembly, variant calling, RNA-Seq, and viral genomics. We will see that the same principles recur across every domain — which is itself an example of pattern recognition.
