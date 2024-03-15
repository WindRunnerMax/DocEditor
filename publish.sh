set -ex;
# npm version patch --no-git-tag-version
version=`echo "console.log(require(\"./package.json\").version)" | node`;
packages=(delta utils core plugin);
dir=$(pwd);
prefix="doc-editor-"

for item in "${packages[@]}"; do
    cd $dir;
    path="./packages/$item"
    cd $path;
    npm run build
done

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
    npm publish --registry=https://registry.npmjs.org/
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