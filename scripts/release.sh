#!/usr/bin/env bash

set -u -e
args=("$@")

if [ $# -eq 0 ]
  then
    printf "No arguments supplied\n"
    exit 1
fi

scriptDir=$(cd $(dirname $0); pwd)

echo "CDing to $scriptDir"
cd ${scriptDir}

standardVersionBin=


#rm -Rf ${dist}

echo "##### Validating packages"
#./ci/lint.sh

echo "##### Building packages to dist"
#./ci/build.sh dev

echo "##### Testing packages"
#./ci/test.sh

if [ ${args[0]} != "patch" ] &&  [ ${args[0]} != "minor" ] &&  [ ${args[0]} != "major" ]; then

    echo "Missing mandatory argument: . "
    echo " - Usage: ./release.sh  [type]  "
    echo "      type: patch | minor | major  "
    exit 1
fi


echo "Running standard-version to create a release package with ${standardVersionBin} --release-as ${args[0]}"

cd ..
./node_modules/.bin/standard-version --release-as ${args[0]}

NEW_VERSION=$(node -p "require('./package.json').version")
echo "Bumping up package(s).json to version ${NEW_VERSION}"

cd ./dist
perl -p -i -e "s/VERSION_PLACEHOLDER/${NEW_VERSION}/g" $(grep -ril VERSION_PLACEHOLDER .) < /dev/null 2> /dev/null


























