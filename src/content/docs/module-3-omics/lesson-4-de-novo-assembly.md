---
title: "Lesson 4: De Novo Assembly with Long Reads"
---

## 1. Lesson Goal

In this lesson, you will perform de novo assembly on Nanopore long reads from:

- `Training/long_reads/barcode57.fastq`
- `Training/long_reads/barcode58.fastq`

You will also remove cassava host contamination before assembly, then BLAST assembled contigs and save results in a structured project folder.

## 2. Why We Remove Host Contamination First

Our biological target is viral or non-host sequence signal in the sample. If host reads dominate, they can:

1. Increase assembly complexity.
2. Waste compute resources.
3. Produce irrelevant contigs.

So we first map reads to cassava genome, remove mapped (host) reads, and keep unmapped reads for de novo assembly.

## 3. Project Folder Organization

All work in this lesson is done inside `Training/long_reads`.

Create a clean structure before running tools.

```bash
cd Training/long_reads
mkdir -p denovo/{raw,reference,mapping,clean,assembly,blast,logs}
```
The above command creates the following subfolders in one go: `raw`, `reference`, `mapping`, `clean`, `assembly`, `blast`, and `logs` inside the `denovo` folder. This structure helps keep your files organized by type and analysis step.

Copy input reads into a raw data subfolder so your originals stay untouched.

```bash
cp barcode57.fastq denovo/raw/
cp barcode58.fastq denovo/raw/
```

## 4. Install Flye in the `bioinfo` environment and confirm it works

We already created the `bioinfo` environment in a previous lesson, so we can just install flye and its dependencies there.

_Note: If you are using the TLJH instance (the web interface), this is already done for you. You can skip this step._

First activate the `bioinfo` environment.

```bash
conda activate bioinfo
```
Your prompt should now show `(bioinfo)` at the beginning, indicating that you are in the correct environment. See an example below:

`(bioinfo) username@debianserver:~$`

Then install flye and other tools we will use.
```bash
conda install -c bioconda -c conda-forge flye
```
When installation is complete, confirm Flye is available.

```bash
flye --version
```
You should see the flye version number printed, confirming it is installed correctly. For example:

`2.9.6-b1802`


## 5. Download Cassava Reference Genome

Place cassava reference genome in the `reference` folder. Replace the placeholder URL with your real link.

```bash
wget "https://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/001/659/605/GCF_001659605.2_M.esculenta_v8/GCF_001659605.2_M.esculenta_v8_genomic.fna.gz"
```

### 5.1 Extract the downloaded file and place the FASTA in the `reference` folder.

- First we extract the downloaded gzipped FASTA file using `gunzip`.

```bash
gunzip GCF_001659605.2_M.esculenta_v8_genomic.fna.gz
```
- Then we move the extracted FASTA file to the `reference` folder and rename it for clarity.

```bash
mv GCF_001659605.2_M.esculenta_v8_genomic.fna denovo/reference/cassava_reference.fna 
```

## 6. Map Reads to Cassava and Remove Host Reads

### 6.1 Map long reads to cassava genome using the long-read preset in minimap2 and save the SAM output.
First check the help page for minimap2 to understand the options.
`-a` means output in SAM format, `-x map-ont` is the preset for Nanopore reads, and `-t 2` uses 2 threads. For persons using their own machines you can adjust the thread count to `-t 4` or more if you have the resources.

```bash
minimap2 -t 2 -ax map-ont  denovo/reference/cassava_reference.fna denovo/raw/barcode57.fastq \
> denovo/mapping/barcode57_vs_cassava.sam
```
### 6.2 Check mapping stats with `samtools flagstat`

```bash
samtools flagstat denovo/mapping/barcode57_vs_cassava.sam
```
This command will give you a summary of how many reads mapped to the cassava reference genome. You should see a certain percentage of reads that mapped, which indicates the level of host contamination in your sample. The remaining unmapped reads are what we will use for de novo assembly, as they likely contain the viral or non-host sequences of interest.

### 6.3 Convert SAM to BAM.

```bash
samtools view -b denovo/mapping/barcode57_vs_cassava.sam > denovo/mapping/barcode57_vs_cassava.bam
```
### 6.4 Sort the BAM file for efficient access.

```bash
samtools sort denovo/mapping/barcode57_vs_cassava.bam -o denovo/mapping/barcode57_vs_cassava.sorted.bam
```

### 6.5 Index the BAM file for efficient querying.

```bash
samtools index denovo/mapping/barcode57_vs_cassava.sorted.bam
```

### 6.6 Extract unmapped reads only (`-f 4` flag means read is unmapped).
This command returns reads that did not map to the cassava reference (non-host reads), then saves them to a new BAM file.

```bash
samtools view -b -f 4 denovo/mapping/barcode57_vs_cassava.sorted.bam > denovo/mapping/barcode57_unmapped.bam
```
### 6.7 Check stats of the unmapped BAM

```bash
samtools flagstat denovo/mapping/barcode57_unmapped.bam
```
This will give you the number of unmapped reads that you have, which should be significantly less than the total number of reads in the original FASTQ file, confirming that you have successfully removed the host contamination.

### 6.8 Convert the unmapped BAM back to FASTQ

```bash
samtools fastq denovo/mapping/barcode57_unmapped.bam > denovo/clean/barcode57_clean.fastq
```

You can compare FASTQ stats before and after host removal with `seqkit stat`.

```bash
seqkit stat denovo/raw/barcode57.fastq denovo/clean/barcode57_clean.fastq
```

## 7. Alternative approach: host removal with pipes (no intermediate files)

Do not run this during the main exercise. It is shown as an efficiency alternative that avoids large intermediate files:

```bash
minimap2 -t 2 -ax map-ont denovo/reference/cassava_reference.fna denovo/raw/barcode57.fastq \
| samtools view -b -f 4 - \
| samtools fastq - > denovo/clean/barcode57_clean.fastq
```

## 8. Run Flye De novo Assembly

Now assemble the host-filtered reads using Flye meta mode and the clean fastq files.

```bash
flye --nano-raw denovo/clean/barcode57_clean.fastq \
  --out-dir denovo/assembly/barcode57 \
  --threads 2 \
  --meta
```

Main output contigs are expected in:

- `denovo/assembly/barcode57/assembly.fasta`

Some assembly stats can also be found in the `assembly_info.txt` file in the same folder.

## 9. BLAST the Assembled Contigs

BLAST helps identify likely biological origin of contigs.

We will create a local BLAST database fusing the NCBI Virus Refseq.

Download the NCBI Virus RefSeq FASTA file into the `blast` folder.

```bash
wget "https://ftp.ncbi.nlm.nih.gov/refseq/release/viral/viral.1.1.genomic.fna.gz" -P denovo/blast/
```
Then we will extract the downloaded gzipped FASTA file.

```bash
gunzip denovo/blast/viral.1.1.genomic.fna.gz
```

Build a BLAST database from the viral reference FASTA, then run BLASTN with assembled contigs as query.

Create BLAST database.

```bash
makeblastdb -in denovo/blast/viral.1.1.genomic.fna -dbtype nucl -out denovo/blast/target_db
```

Run BLASTN and save tabular output.

```bash
blastn \
  -query denovo/blast/query_contigs.fa \
  -db denovo/blast/target_db \
  -out denovo/blast/contigs_vs_targets.tsv \
  -outfmt "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore" \
  -max_target_seqs 10 \
  -num_threads 4
```

Preview the BLAST result file.

```bash
head -n 20 denovo/blast/contigs_vs_targets.tsv
```

## 10. Final Output Checklist

By the end of this lesson, you should have:

1. `denovo/clean/barcode57_clean.fastq` (host-filtered reads)
2. `denovo/assembly/barcode57/assembly.fasta` (de novo assembled contigs)
3. `denovo/blast/contigs_vs_targets.tsv` (BLAST annotation table)

## 11. Exercise
Try running the same host removal and assembly pipeline on the second sample (`barcode58.fastq`) and compare results to `barcode57`. Do you see similar levels of host contamination? Similar assembly outcomes?
