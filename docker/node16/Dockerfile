FROM node:12

LABEL maintainer="azu <azuciao@gmail.com>"
LABEL Description="Docker Container for HonKit"

ARG PACKAGE_VERSION
ENV PACKAGE_VERSION ${PACKAGE_VERSION:-latest}
# Use 3.x for https://github.com/honkit/honkit/issues/117
# https://download.calibre-ebook.com/3.48.0/calibre-3.48.0-x86_64.txz
# https://calibre-ebook.com/download_linux
COPY calibre-tarball.3.48.0.txz calibre-tarball.txz
# Calibre dependencies
RUN apt-get update; \
    apt-get install --no-install-recommends --allow-unauthenticated -y \
    ca-certificates \
    libgl1 \
    python3 \
    qt5-default \
    qt5-image-formats-plugins \
    wget \
    xdg-utils \
    xz-utils \
    ; \
    apt-get clean; \
    rm -rf /var/tmp/* /tmp/* /var/lib/apt/lists/*
RUN mkdir -p /usr/local/calibre \
    && tar xvf ./calibre-tarball.txz -C /usr/local/calibre \
    && /usr/local/calibre/calibre_postinstall
RUN npm install -g honkit@${PACKAGE_VERSION}

ENV PATH=/usr/lib/node_modules/.bin:$PATH
