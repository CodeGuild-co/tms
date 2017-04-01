# TMS

[![Join the chat at https://gitter.im/CodeGuild-co/tms](https://badges.gitter.im/CodeGuild-co/tms.svg)](https://gitter.im/CodeGuild-co/tms?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An online Turing Machine Simulator

## Making Changes

If you want to build new features into the tms website you'll need a local copy of the code to change, as well as a way to test your changes. Here's how:

You'll need to make sure you've got [git](https://git-scm.com/), [VirtualBox](https://www.virtualbox.org/), and [Vagrant](https://www.vagrantup.com/) installed. They're all free and pretty easy to install.

Then you'll need to fork this repo (so you'll need a GitHub account, if you don't already have one). This is easy, just click the "Fork" button in the top right of this page.

You'll now have your own copy of the repository stored in your own account. You can make whatever changes you'd like to this copy; it's yours.

To make changes you'll need to clone your fork. This might require running something like this on the command line:

    $ git clone https://github.com/YOUR_USERNAME/tms

This will have downloaded the repo to your computer. Let's now get vagrant up and running by doing:

    $ cd tms
    $ vagrant up

This one might take a while, but when it's done there will be a virtual machine running on your computer with all the code inside. We can connect to the virtual machine like this:

    $ vagrant ssh

And now we can serve the website locally:

    $ cd /vagrant
    $ vg build
    $ vg run

If you now open this link: http://192.168.33.10 you should see the tms website. Except this one is running on your machine, so changes we make here will be seen on the website.

You can now edit the code and see the changes you make alter the local copy of the website. Start by changing something small to see if it works. Then think of a minor bugfix/improvement you can make and try that. WHen you're confident about making larger changes, go for it!


## Sharing Changes

When you're done making changes you'll want to have them included in the official website (not just your own). So first push your changes up to your fork:

    $ git add CHANGED_FILE CHANGED_FILE
    $ git commit -m 'DESCRIPTION_OF_CHANGES'
    $ git push origin master

If you don't know what the `git add` or `git commit` instructions are doing, ask around!

Now your fork will have the changes, let's make a pull request to the main repo to have them included in the main site. You'll need to open your fork on the GitHub website and click the "New Pull Request" button. Hopefully you'll see a green bit of text that says "Able to merge", if so, click the "Create pull request" button, provide a description of the work you've done and alick "Create pull request" again. If instead you see a red error message, you'll have to fix the problems it talks about before your work can be merged.


## Improvements

- Let people save their code
- Let people share their code
- Add multi tape features to the simulator
- Add non-deterministic features to the simulator
- Auto-draw the machine
- Make the website nicer
- Make these instructions nicer
