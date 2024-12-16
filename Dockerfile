FROM golang:1.23.4 AS base

WORKDIR /mint/

# Copy certificates
COPY config/tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates && \
	apt update && \
	apt install -y tzdata && \
	rm -rf /var/lib/apt/lists/*

# Copy go.mod and go.sum files to the workspace and download dependencies
COPY go.mod go.sum ./
RUN go mod download

FROM base AS dev

# Install delve, gopls, and air for debugging
RUN go install github.com/go-delve/delve/cmd/dlv@latest && \
	go install golang.org/x/tools/gopls@latest && \
	go install github.com/cosmtrek/air@4612c12f1ed7c899314b8430bc1d841ca2cb061a

FROM base AS build

COPY cmd/ ./cmd/
COPY pkg/ ./pkg/
COPY mappings/ ./mappings/
RUN CGO_ENABLED=0 GOOS=linux go build -a -o bin/mint ./cmd/mint

FROM scratch

WORKDIR /mint/

COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=base /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=build /mint/bin/mint .

# Copy build args to envs for version, datetime, and timestamp
ARG ARG_APPLICATION_VERSION
ARG ARG_APPLICATION_DATETIME
ARG ARG_APPLICATION_TS
ENV APPLICATION_VERSION=${ARG_APPLICATION_VERSION} \
	APPLICATION_DATETIME=${ARG_APPLICATION_DATETIME} \
	APPLICATION_TS=${ARG_APPLICATION_TS}

USER 1000

ENTRYPOINT ["/mint/mint"]
CMD ["serve"]
