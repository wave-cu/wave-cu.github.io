# Lesson 4 - SSH and Remote Work

## Learning Objectives

- Explain what SSH is and why bioinformaticians use it.
- Distinguish between local and remote filesystems.
- Write correct `ssh` and `scp` command syntax.
- Diagnose common SSH and SCP mistakes.

## Conceptual Overview

SSH (Secure Shell) lets you log into a remote server and run commands as if you were sitting at that machine. Bioinformatics often uses remote servers or clusters because they have more CPU, memory, and storage than a laptop.

When you connect with SSH, you are working in the remote filesystem. Your local files are still on your computer. Use `scp` to copy files between local and remote systems. Keep your project organized so you always know where your data and results live.

Common best practices:

- Avoid heavy analyses on your laptop; use remote servers for big jobs.
- Keep clear folder names and document your working directory.
- Use keys or passwords safely; never share private keys.

## Worked Examples

### 1) Basic SSH login (conceptual)

`ssh user@remotehost` starts a secure login session to a remote server.
If the connection succeeds, you might see a login banner and then a remote prompt. You are now working on the remote system.

```bash
ssh bodeoni@172.16.12.88
```
In the above example, `bodeoni` is the username and `172.16.12.88` is the IP address of the remote server (host).

Depending on how the server is set up, you may be prompted for a password or a key passphrase. After successful authentication, you will see a command prompt that indicates you are on the remote server.

```
bodeoni@172.16.12.88's password:
```

Enter the password, and if it's correct, you will see something like:

```
bodeoni@debianserver:~$
```

*Note: Typically the first time you connect to a new server, you will see a message about the server's fingerprint. This is a security measure.*

*Also the first time you login, you may be asked to change your password. Follow the prompts to set a new password.*

### 2) Use an SSH key for login

SSH keys are a secure alternative to passwords. You generate a key pair (public and private) on your local machine, then copy the public key to the remote server.

Basically, if the public key on the server matches the private key on your laptop, you can log in without a password. Think of it like a key and lock or a handshake. The server checks if you have the right key to open the door.

To generate an SSH key pair, use the following command. Replace the email with your own for identification.

Run the below command in your terminal (on your local machine) to create an SSH key pair: This typically works in command prompt (for windows machines) and of course the terminal for Mac and Linux users.

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"   
```

When you run this, the ssh-keygen should create `~/.ssh` directory if it doesn't exist, and then generate two files: `id_ed25519` (the private key) and `id_ed25519.pub` (the public key).

Next, you need to copy the public key to the remote server. You can use the `ssh-copy-id` command for this:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@remote_host
```

Replace `user@remote_host` with your actual username and server address. This command will append your public key to the `~/.ssh/authorized_keys` file on the remote server.

You can also do this manually by copying the contents of `id_ed25519.pub` (i.e `cat id_ed25519.pub`) on your local machine and pasting it into the `~/.ssh/authorized_keys` file on the remote server.

If the ~/.ssh/authorized_keys file does not exist on the remote server, you can create it with the following command:

```bash
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

This will create the file and set the correct permissions.

`chmod 600` ensures that only the owner can read and write the `authorized_keys` file, which is important for security.

### 3) Copy a file to the remote server with `scp`

`scp local_file user@remotehost:remote_path` copies a file from **local** to **remote**.

```bash
scp Module_1_Linux/notes.txt username@bioinfo.example.edu:~/bioinformatics/
```

### 4) Copy results back to your laptop

`scp user@host:remote_file local_path` copies a file from remote to local.

```bash
scp username@bioinfo.example.edu:~/bioinformatics/results.txt Module_1_Linux/
```