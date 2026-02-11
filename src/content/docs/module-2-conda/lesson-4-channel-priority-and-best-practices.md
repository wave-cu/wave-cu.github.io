---
title: "Lesson 4: Channel Priority and Best Practices"
---

## How Conda resolves packages

When you install a package, Conda searches channels in order. The first channel that provides a compatible package is used. This is why channel priority matters.

If the channel order is not consistent, you can get incompatible builds or dependency conflicts.

## Best practice for bioinformatics

A common and reliable channel order is:

1. `conda-forge`
2. `bioconda`

This ensures that `bioconda` packages use dependencies from `conda-forge`.

> Note: Many bioinformatics workflows avoid the `defaults` channel to reduce licensing risk and dependency conflicts.

## Remove the `defaults` channel

This command removes `defaults` from your channel list.

```bash
conda config --remove channels defaults
```

## Add `conda-forge`

This command adds `conda-forge` at the top of your channel list.

```bash
conda config --add channels conda-forge
```

## Add `bioconda`

This command adds `bioconda` below `conda-forge`.

```bash
conda config --add channels bioconda
```

## Enable strict channel priority

This command forces Conda to use the highest-priority channel possible for each package.

```bash
conda config --set channel_priority strict
```

## Verify channel order

This command shows your configured channels. The expected order should place `conda-forge` before `bioconda`.

```bash
conda config --show channels
```

Expected output order:

```
channels:
  - conda-forge
  - bioconda
```

If you find that `bioconda` is above `conda-forge`, you can run the following command to fix the order:

```bash
conda config --add channels conda-forge
```
This will move `conda-forge` to the top of the list, ensuring that it has higher priority than `bioconda`.
