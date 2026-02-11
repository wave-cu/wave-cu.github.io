---
title: "Lesson 2: Channels, Licensing, and Bioconda"
---

## What are Conda channels

Conda channels are package repositories. When you install a tool, Conda searches channels in a defined order and uses the first matching package it finds.

Why channels matter:

- Different channels provide different packages
- The same tool can exist in multiple channels with different builds
- Channel order affects which package you get

## Licensing issues with the `defaults` channel

The `defaults` channel is maintained by Anaconda, Inc. Some packages in `defaults` have licensing terms that restrict commercial use. Many institutions avoid `defaults` to reduce licensing risk and ensure open-source builds.

> Note: You should follow your organization’s policies. Many bioinformatics workflows rely on open-source channels to avoid licensing issues.

## Why conda-forge exists

`conda-forge` is a community-run channel that provides a wide range of open-source packages. It is known for consistent builds and up-to-date versions.

Key points:

- Community maintained
- Broad coverage of scientific packages
- Built with consistent tooling

## Why bioconda is critical for bioinformatics

`bioconda` is the main channel for bioinformatics tools. It contains thousands of packages tailored for genomics, transcriptomics, and other omics workflows.

Important relationship:

- `bioconda` builds depend on `conda-forge`
- `conda-forge` should be higher priority than `defaults`

## Check your current channels

This command lists channels and their priority order.

```bash
conda config --show channels
```

You will use this information in later lessons to configure the best channel order for bioinformatics.
