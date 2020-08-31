FROM node:12-alpine

LABEL maintainer="azu <azuciao@gmail.com>"
LABEL Description="Docker Container for HonKit"

ARG PACKAGE_VERSION
ENV PACKAGE_VERSION ${PACKAGE_VERSION:-latest}

RUN npm install -g honkit@${PACKAGE_VERSION}

ENV PATH=/usr/lib/node_modules/.bin:$PATH
