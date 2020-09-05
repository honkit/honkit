FROM node:12

LABEL maintainer="azu <azuciao@gmail.com>"
LABEL Description="Docker Container for HonKit"

ARG PACKAGE_VERSION
ENV PACKAGE_VERSION ${PACKAGE_VERSION:-latest}

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
# Use 3.x for https://github.com/honkit/honkit/issues/117
RUN wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sh /dev/stdin version=3.48.0
RUN npm install -g honkit@${PACKAGE_VERSION}

ENV PATH=/usr/lib/node_modules/.bin:$PATH
