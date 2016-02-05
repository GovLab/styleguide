#!/bin/bash

echo 'Auto committing version changes...'
git add guide/index.html sass/styleguide.md
git diff --staged | grep -q 'govlab-styleguide'
if [ $? -eq 0 ] ; then
    git commit -m "(gulp) auto commit"
    git push
else
    echo '(WARN) Not auto committing anything. This is probably because the version number has not changed and can be totally ignored.'
    exit 1
fi