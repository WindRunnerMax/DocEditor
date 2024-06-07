# Usage: bash publish.sh --build-only --no-emit --dry-run
set -e # -x
dir=$(pwd);
bash_args="$@";
prefix="doc-editor-";
packages=(delta utils core plugin);
# npm version patch --no-git-tag-version
version=`echo "console.log(require(\"./package.json\").version)" | node`;

function check_argument {
  local value=$1;
  for arg in $bash_args; do
    if [ "$arg" == "$value" ] ; then
      return 0; # success
    fi
  done
  return 1; # failure
}

for item in "${packages[@]}"; do
    cd $dir;
    path="./packages/$item";
    cd $path;
    npm run build
done

if check_argument "--build-only"; then
  exit 0;
fi

for item in "${packages[@]}"; do
    cd $dir;
    path="./packages/$item";
    cd $path;
    echo "const fs = require('fs');
      const json = require('./package.json');
      json.version = '$version';
      const dep = json.dependencies || {};
      for(const [key, value] of Object.entries(dep)) {
        if(key.startsWith('$prefix')) dep[key] = '$version';
      }
      fs.writeFileSync('./package.json', JSON.stringify(json, null, 2));
    " | node;
    set +e;
    if check_argument "--no-emit" || check_argument "--dry-run"; then
        npm publish --registry=https://registry.npmjs.org/ --dry-run
    else
        npm publish --registry=https://registry.npmjs.org/
    fi
    set -e;
    echo "const fs = require('fs');
      const json = require('./package.json');
      json.version = '1.0.0';
      const dep = json.dependencies || {};
      for(const [key, value] of Object.entries(dep)) {
        if(key.startsWith('$prefix')) dep[key] = 'workspace: *';
      }
      fs.writeFileSync('./package.json', JSON.stringify(json, null, 2));
    " | node;
done
