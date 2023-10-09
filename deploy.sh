set -e


git add -A
git commit -m "update $(date +%D %T)"
git push -f git@github.com:oohkumar123/mappapp.git master:master

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:oohkumar123/mappapp.git master:gh-pages

cd -