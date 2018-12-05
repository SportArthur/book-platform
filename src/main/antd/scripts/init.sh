#!/bin/bash

# 此文件放在 Java 项目的 web/script 目录下，请在 web/script 目录下执行

cd ../src/main/ \
    && git clone git@git.souche.com:souche-f2e/sad-template.git \
    && mv sad-template antd \
    && rm -rf ./antd/.git \
    && cd antd && npm run i \


echo "\n进入 src/main/antd 目录执行 npm run start 启动前端开发服务"

