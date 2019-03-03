#!/bin/sh

# -e 遇到错误终止脚本
# -u 遇到变量没有值时终止脚本
# -x 输出每行执行结果
set -eu

$version="$1"

echo_success () {
  printf "\033[32m%s\033[0m\n" "$1";
}

echo_warning () {
  printf "\033[33m%s\033[0m\n" "$1";
}

echo_error () {
  printf "\033[31m%s\033[0m\n" "$1";
}

npm run build:lib && \
echo_success 'build success!!!' && \
npm login && \
npm publish --access=public && \
echo_success 'public success!!!' && \
git tag "v$version" && \
git commit -a -m "build: bump v$version"
echo_success 'tag success!!!' && \
npm run changelog && \
echo_success 'update changelog success!!!'