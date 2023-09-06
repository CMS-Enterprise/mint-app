FROM golang:1.21 AS base

WORKDIR /mint/

FROM base AS modules

COPY go.mod ./
COPY go.sum ./
RUN go mod download

FROM modules AS build

COPY cmd ./cmd
COPY pkg ./pkg

RUN CGO_ENABLED=0 GOOS=linux go build -buildvcs=false -a -o bin/mint ./cmd/mint

COPY config/tls/rds-ca-2019-root.pem /usr/local/share/ca-certificates/rds-ca-2019-root.crt
COPY config/tls/hhs-fpki-intermediate-ca.pem /usr/local/share/ca-certificates/hhs-fpki-intermediate-ca.crt
COPY config/tls/HHS-FPKI-Intermediate-CA-E1.cer /usr/local/share/ca-certificates/HHS-FPKI-Intermediate-CA-E1.crt
COPY config/tls/Entrust_Managed_Services_Root_CA_G2.cer /usr/local/share/ca-certificates/Entrust_Managed_Services_Root_CA_G2.crt
COPY config/tls/Entrust_Managed_Services_Root_CA.cer /usr/local/share/ca-certificates/Entrust_Managed_Services_Root_CA.crt
COPY config/tls/Federal_Common_Policy_CA_G2.crt /usr/local/share/ca-certificates/Federal_Common_Policy_CA_G2.crt
RUN update-ca-certificates
RUN apt install tzdata

FROM modules AS dev

RUN go install github.com/go-delve/delve/cmd/dlv@latest
RUN go install golang.org/x/tools/gopls@latest
RUN go install github.com/cosmtrek/air@4612c12f1ed7c899314b8430bc1d841ca2cb061a

COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

CMD ["./bin/mint"]

FROM scratch

WORKDIR /mint/

COPY --from=build /mint/bin/mint .
COPY --from=build /mint/pkg/email/templates ./templates
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /usr/share/zoneinfo /usr/share/zoneinfo

ARG ARG_APPLICATION_VERSION
ARG ARG_APPLICATION_DATETIME
ARG ARG_APPLICATION_TS
ENV APPLICATION_VERSION=${ARG_APPLICATION_VERSION}
ENV APPLICATION_DATETIME=${ARG_APPLICATION_DATETIME}
ENV APPLICATION_TS=${ARG_APPLICATION_TS}
ENV EMAIL_TEMPLATE_DIR=/mint/templates

USER 1000

ENTRYPOINT ["/mint/mint"]

CMD ["serve"]
