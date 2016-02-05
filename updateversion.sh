#!/bin/bash

git add guide/index.html sass/styleguide.md
git diff --staged | grep 'govlab-styleguide'
if [ $? -eq 0 ] ; then
    git commit -m "(gulp) auto commit"
    git push
else
    exit 1
fi