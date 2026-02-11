# Lesson 5: Absolute and Relative Paths

In bioinformatics, you will often need to reference files located in various places: your home directory, a shared lab drive, or a specific project folder. Understanding how to precisely tell the computer *where* a file is located is critical.

There are two ways to specify a file's location: **Absolute Paths** and **Relative Paths**.

## 1. The File System Tree and Root (`/`)

Linux organizes files in a hierarchical tree structure.
*   **Root (`/`)**: The very top of the tree is called the "root" directory and is represented by a single forward slash `/`.
*   Everything on your system lives under root. There are no drive letters like `C:` or `D:` at the top level in Linux.

## 2. Mounted Drives (`/mnt`)

If you are using **WSL (Windows Subsystem for Linux)** or accessing external hard drives on a Linux machine, these drives are often "mounted" inside the `/mnt` directory.

*   **WSL Users:** Your `C:` drive is typically accessible at `/mnt/c/`.
*   **Example:** If your `Bioinformatic_Fridays` folder is in your Windows Documents folder, the path might look like:
    ```bash
    /mnt/c/Users/YourName/Documents/Bioinformatic_Fridays/
    ```

## 3. Absolute Paths

An **Absolute Path** is the full address of a file, starting from the root (`/`). It is unambiguous; it points to the same location no matter where your current working directory is.

**Key Rule:** An absolute path *always* starts with a `/`.

### Examples
Let's find the absolute path to the `attendees.csv` file in our `Training` folder.

1.  Navigate to the `Training` folder (wherever it is on your system).
2.  Run the `pwd` (Print Working Directory) command:
    ```bash
    pwd
    ```
    *Output (example for a Linux user):*
    ```text
    /home/bodeoni/Bioinformatic_Fridays/Training
    ```
    *Output (example for a WSL user):*
    ```text
    /mnt/c/Users/WAVECU001/Documents/Bioinformatic_Fridays/Training
    ```

The **Absolute Path** to the file is that full folder path plus the filename:
*   `/home/bodeoni/Bioinformatic_Fridays/Training/attendees.csv`

**When to use Absolute Paths:**
*   In scripts/code (so they run correctly from anywhere).
*   When configuring tools that need to find a reference file (e.g., a genome index).

## 4. Relative Paths

A **Relative Path** describes the location of a file *relative to where you are right now*. It never starts with a `/`.

**Symbols:**
*   `.` (dot): The current directory.
*   `..` (dot dot): The parent directory (one level up).

### Scenarios

**Scenario A: You are inside `Bioinformatic_Fridays/`**
*   To list the files in `Training/long_reads` without leaving your current spot:
    ```bash
    ls Training/long_reads
    ```
    *(This is a relative path. We didn't start with `/`, so Linux looks for `Training` inside the current folder.)*

**Scenario B: You are inside `Training/short_reads/`**
*   You want to see the `attendees.csv` file, which is one level up (in `Training/`).
*   Path: `../attendees.csv`
    ```bash
    ls ../attendees.csv
    ```

**Scenario C: You are inside `Training/short_reads/` and want to go to `Training/long_reads/`**
*   You need to go **up** one level (to `Training`), and then **down** into `long_reads`.
*   Path: `../long_reads`
    ```bash
    cd ../long_reads
    ```

## 5. The Home Shortcut (`~`)

The tilde character `~` is a shortcut for your home directory.
*   On standard Linux: usually `/home/your_username`
*   On WSL: usually `/home/your_linux_username` (Note: this is your *Linux* home, not your Windows User folder).

*   **Example:** `cd ~` takes you home.
*   **Example:** `ls ~/Downloads` lists your Downloads folder (if it exists in your Linux home).

## Practice Exercise

1.  Navigate to the `Training/long_reads` directory.
2.  Use `pwd` to find the **Absolute Path** of this directory.
3.  List the contents of the `short_reads` directory using a **Relative Path** (hint: you need to go up, then down).
4.  Try to list the `attendees.csv` file using an **Absolute Path** (use the output from step 2 to help you construct it).
