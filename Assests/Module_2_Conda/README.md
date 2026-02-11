# Module 2: Conda for Bioinformatics

This module teaches how to manage software and environments using Conda, with a focus on bioinformatics workflows. Conda helps you install complex tools with native dependencies and keep projects reproducible.

Conda is essential in bioinformatics because many tools depend on compiled libraries and specific versions of system packages. Conda bundles these dependencies so you can install and run tools without manual compilation or system-wide changes.

## Learning objectives

By the end of this module, you will be able to:

- Explain what Conda is and why it matters in bioinformatics
- Compare Conda to `pip` and `venv`
- Understand channels, licensing, and the role of conda-forge and bioconda
- Create, activate, and remove Conda environments
- Configure channel priority for reliable installs
- Build, verify, export, and recreate a bioinformatics environment

## Lessons

- Lesson 1: What is Conda and why we use it
  - Introduces Conda, compares it to `pip`/`venv`, and explains why bioinformatics needs it
- Lesson 2: Channels, licensing, and bioconda
  - Explains channels, licensing issues, conda-forge, and bioconda
- Lesson 3: Managing environments
  - Covers environment creation, activation, removal, and why base should stay clean
- Lesson 4: Channel priority and best practices
  - Shows how Conda resolves packages and how to configure strict priority
- Lesson 5: Building a bioinformatics environment
  - Walks through building and verifying a practical `bioinfo` environment

> Note: Avoid installing software in the `base` environment. Always create a dedicated environment for each project or workflow.
