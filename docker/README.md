# Docker Container

- https://hub.docker.com/r/honkit/honkit

## Installation

    docker pull honkit/honkit

## Usage

Show help 

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it honkit/honkit honkit --help

Build

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it honkit/honkit honkit build

PDF build

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it honkit/honkit honkit pdf

## Tips

### Custom Font

You can create new image includes custom font based on honkig image.

```
FROM honkit/honkit:latest
LABEL maintainer="your@example.com"

# Install fonts
COPY fonts/custom-fone /usr/share/fonts
```