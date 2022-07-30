FROM golang:1.18.4-bullseye

WORKDIR /usr/src/app

# isntall python and toolset
RUN apt-get update
RUN apt-get -y install python3
RUN apt-get -y install python3-setuptools
RUN apt-get -y install python3-pip

COPY go.mod go.sum ./
RUN go mod download && go mod verify
# install gruvbox-factory
RUN pip install gruvbox-factory

COPY . .
ENV PORT=8080
EXPOSE 8080
RUN go build -v -o /usr/local/bin/app ./...

CMD ["app"]