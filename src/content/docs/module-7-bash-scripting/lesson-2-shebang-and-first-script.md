---
title: "Lesson 2 — Your First Script and the Shebang Line"
---


## Learning Objectives

By the end of this lesson, you will be able to:

- Explain what the shebang line is and why it must be the first line of every script
- Create a simple Bash script using a text editor
- Make a script executable using `chmod +x`
- Run a script from the terminal using `./`
- Avoid the most common beginner mistakes

---

## 1. Creating a Script File

A Bash script is just a text file. You can create one with any text editor available in your terminal — `nano` is the most beginner-friendly option.

Start by navigating to the root of the `Bioinformatic_Fridays` folder:

```bash
cd /path/to/Bioinformatic_Fridays
```

Now create a new file called `first_script.sh`:

```bash
nano first_script.sh
```

The `.sh` extension is a convention that tells you (and your text editor) that this is a shell script. Bash does not require it — but always use it. It makes your files much easier to identify later.

---

## 2. The Shebang Line

The very first line of every Bash script must be:

```bash
#!/bin/bash
```

This is called the **shebang line** (also written "hashbang" or "sha-bang"). It is the single most important line in your script.

### What does it do?

When you run a script, your operating system needs to know *which program* should read and execute it. The shebang line answers that question. It tells the system: "Use the program at `/bin/bash` to interpret this file."

The `#!` is a special two-character sequence that the operating system recognises. Everything after it is the path to the interpreter.

`/bin/bash` is the location of the Bash program on most Linux systems.

### Why does it matter?

Without the shebang line, the operating system has to guess which interpreter to use. On most systems it will fall back to a default shell — but that shell might not be Bash, and it might behave differently. Scripts that work on your computer may silently fail on a colleague's machine, on a remote server, or inside a computing cluster.

The shebang line removes all ambiguity. It guarantees that no matter where or how the script is run, Bash is the interpreter.

> **Rule:** Always put `#!/bin/bash` as the very first line of every script you write. No blank lines before it, no spaces before the `#`. First line, first character.

---

## 3. Writing Your First Script

In `nano`, type the following:

```bash
#!/bin/bash

echo "Hello, bioinformatics!"
echo "This is my first script."
```

`echo` is a command that prints text to the terminal. You have seen it before in Linux — here it is doing exactly the same thing, just written inside a file.

Save the file: press `Ctrl + O`, then `Enter`. Exit nano: press `Ctrl + X`.

---

## 4. Making the Script Executable

Try running the script immediately:

```bash
./first_script.sh
```

You will likely see this error:

```
bash: ./first_script.sh: Permission denied
```

This happens because a newly created file is not automatically executable. You need to give it permission to run. Use `chmod`:

```bash
chmod +x first_script.sh
```

`chmod` changes file permissions. `+x` means "add execute permission." You only need to do this once per script — the permission is saved with the file.

Now run it again:

```bash
./first_script.sh
```

Output:

```
Hello, bioinformatics!
This is my first script.
```

Congratulations — you have written and run your first Bash script.

Alternatively, you could run the script without making it executable by explicitly calling Bash:

```bash
bash first_script.sh
```

---

## 5. Why `./` Before the Script Name?

You might wonder why you type `./first_script.sh` rather than just `first_script.sh`.

The `./` means "look for this file in the current directory." Without it, the terminal searches for the script in a set of pre-defined system locations (called `$PATH`) — and your current folder is usually not included. Adding `./` tells Bash exactly where to find the file.

---

## 6. Adding Comments

Comments are lines in your script that Bash ignores completely. They start with `#`. Use them to leave notes for yourself — or for the next person who reads your script.

```bash
#!/bin/bash

# This script prints a welcome message
echo "Hello, bioinformatics!"
echo "This is my first script."
```

The shebang line itself starts with `#!`, but it is special — the `!` tells the OS to treat it as an interpreter instruction, not a comment. Every other line starting with `#` is a comment.

Good comments explain *why* something is done, not just what the code says. A comment like `# Run FastQC` adds nothing — the command already says that. A comment like `# FastQC requires uncompressed input at this step` is genuinely useful.

---

## 7. Common Mistakes

| Mistake | What Happens | Fix |
|---------|-------------|-----|
| Forgetting `chmod +x` | `Permission denied` error | Run `chmod +x scriptname.sh` |
| Forgetting `./` | `command not found` error | Run `./scriptname.sh` |
| Blank line before the shebang | Script may fail on some systems | Make shebang line 1, character 1 |
| Space before `#!` on line 1 | Shebang is not recognised | No space — start with `#` immediately |
| Spaces in the filename | Difficult to run from terminal | Use underscores: `my_script.sh` |

---

## Summary

- The shebang line `#!/bin/bash` must be the first line of every script — it tells the OS to use Bash as the interpreter
- Create scripts with a text editor such as `nano` and save with a `.sh` extension
- Make scripts executable once with `chmod +x`
- Run scripts with `./scriptname.sh`
- Use `#` to add comments — Bash ignores them, but they help humans understand the script

In the next lesson, you will learn how to use variables to store file paths and sample names, making your scripts flexible and easy to read.
