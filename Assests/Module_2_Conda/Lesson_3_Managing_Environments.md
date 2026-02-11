# Lesson 3: Managing Environments

## What are Conda environments

A Conda environment is an isolated directory that contains a specific set of packages and versions. Each environment can have different tools without interfering with each other.

This is essential in bioinformatics because different projects often require different tool versions.

## Keep the base environment clean

The `base` environment is the core Conda installation. Installing many packages into `base` makes it harder to maintain and can break other workflows.

> Warning: Do not install workflow-specific tools in `base`. Always use a dedicated environment.

## List existing environments

This command lists all Conda environments and shows the active one.

```bash
conda env list
```

## Create a new environment

This command creates an environment called `qc` with Python 3.9.

```bash
conda create -n qc python=3.9
```

## Activate an environment

This command activates the `qc` environment so you can install and run tools inside it.

```bash
conda activate qc
```

Your shell prompt should change to show the active environment name.

## Deactivate an environment

This command returns you to the `base` environment.

```bash
conda deactivate
```

## Remove an environment

This command deletes the `qc` environment and all packages inside it.

```bash
conda env remove -n qc
```

> Note: Removing an environment is safe as long as you do not need those tools anymore. You can always recreate it later.
