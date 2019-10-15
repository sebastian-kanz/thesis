#!/bin/sh
IMAGE=blang/latex:ctanfull
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

if [ $machine == "Linux" ]
then
    path=$PWD
else
	path=$(pwd -W)
fi

docker run --rm -i --user="$(id -u):$(id -g)" --net=none -v "${path}":/data "$IMAGE" latexmk -C
docker run --rm -i --user="$(id -u):$(id -g)" --net=none -v "${path}":/data "$IMAGE" pdflatex "$@"
docker run --rm -i --user="$(id -u):$(id -g)" --net=none -v "${path}":/data "$IMAGE" bibtex "$@"
docker run --rm -i --user="$(id -u):$(id -g)" --net=none -v "${path}":/data "$IMAGE" pdflatex "$@"
docker run --rm -i --user="$(id -u):$(id -g)" --net=none -v "${path}":/data "$IMAGE" pdflatex "$@"
docker run --rm -i --user="$(id -u):$(id -g)" --net=none -v "${path}":/data "$IMAGE" latexmk -c