# Stage 1
FROM golang:1.25 AS builder

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/main.go


#Stage 2
FROM alpine:latest

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/server .

CMD ["./server"]