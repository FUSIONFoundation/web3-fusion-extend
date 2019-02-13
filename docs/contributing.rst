.. include:: include_announcement.rst


============
Contributing
============

If you're reading this, you're awesome! Thank you for helping us make this project great and being a part of the web3-fusion-extend community. Here are a few guidelines that will help you along the way.


Submitting a pull request
=========================

web3-fusion-extend is a community project, so pull requests are always welcome, but, before working on a large change, it is best to open an issue first to discuss it with the maintainers.

When in doubt, keep your pull requests small. To give a PR the best chance of getting accepted, don't bundle more than one feature or bug fix per pull request. It's always best to create two smaller PRs than one big one.

As with issues, please make sure your title clear explains the issue.

When adding new features or modifying existing, please attempt to include tests to confirm the new behaviour. You can read more about our test setup `here <https://github.com/FUSIONFoundation/web3-fusion-extend/blob/master/test/README.md>`.


Branch Structure
----------------

All stable releases are tagged `(view tags) <https://github.com/FUSIONFoundation/web3-fusion-extend/tags>`. At any given time, ``master`` represents the latest development version of the library. Patches or hotfix releases are prepared on an independent branch.

``master is unsafe``

We will do our best to keep ``master`` in good shape, with tests passing at all times. However, in order to move fast, we will make API changes that your application might not be compatible with.


How to increase the chance of being accepted?
---------------------------------------------

We will only accept a pull request for which all tests pass. Make sure the following is true:


- The branch is not behind master.
- If a feature is being added:
    - If the result was already achievable with the core library, explain why this feature needs to be added to the core.
    - It includes relevant tests.
    - If this is a common use case, considered adding an example to the documentation.
- If a bug is being fixed, test cases that fail without the fix are included.
- The code is formatted (run ``yarn prettier``).
- The code is linted (run ``yarn lint``).
- If API documentation is being changed in the source, ``yarn docs:api`` was run.
- If prop types were changed, the TypeScript declarations were updated.
- If TypeScript declarations were changed, ``yarn typescript`` passed.
- The PR title follows the pattern ``[Component] Imperative commit message``. (See: `(How to Write a Git Commit Message) <https://chris.beams.io/posts/git-commit/#imperative>` for a great explanation)



Getting started
===============

Please create a new branch from an up to date master on your fork. (Note, urgent hotfixes should be branched off the latest stable release rather than master)

1. Fork the web3-fusion-extend repository on Github
2. Clone your fork to your local machine ``git clone git@github.com:<yourname>/web3-fusion-extend.git``
3. Create a branch ``git checkout -b my-topic-branch``
4. Make your changes, lint, then push to to GitHub with ``git push --set-upstream origin my-topic-branch``.
5. Visit GitHub and make your pull request.

If you have an existing local repository, please update it before you start, to minimise the chance of merge conflicts.

.. code-block:: javascript

    git remote add upstream git@github.com:FusionFoundation/web3-fusion-extend.git
    git checkout master
    git pull upstream master
    git checkout -b my-topic-branch
    yarn

Coding style
------------

Please follow the coding style of the project. web3-fusion-extend uses eslint, so if possible, enable linting in your editor to get real-time feedback. The linting rules can be run manually with the following command ``yarn lint``.

You can also run ``yarn prettier`` to reformat the code.

Finally, when you submit a pull request, they are run again by Circle CI, but hopefully by then your code is already clean!

License
=======

By contributing your code to the FusionFoundation/web3-fusion-extend GitHub repository, you agree to license your contribution under the MIT license.
