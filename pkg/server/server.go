// Package server is for setting up the server.
package server

import (
	"crypto/tls"
	"log"
	"net/http"

	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub"
	"github.com/cms-enterprise/mint-app/pkg/worker"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
)

// Server holds dependencies for running the MINT server
type Server struct {
	router      *mux.Router
	Config      *viper.Viper
	logger      *zap.Logger
	environment appconfig.Environment
	pubsub      pubsub.PubSub
	Worker      *worker.Worker
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// NewServer sets up the dependencies for a server
func NewServer(config *viper.Viper) *Server {

	// Set environment from config
	environment, err := appconfig.NewEnvironment(config.GetString(appconfig.EnvironmentKey))
	if err != nil {
		log.Fatalf("Unable to set environment: %v", err)
	}

	var zapLogger *zap.Logger
	if !environment.Deployed() {
		// When not running in a deployed environment, we're not parsing logs into Splunk, so no need to log as JSON
		// Instead, use zap.NewDevelopment() to create a logger that logs in a human-readable format
		// This also causes logs at Debug level to be printed, which isn't the case for zap.NewProduction()
		zapLogger, err = zap.NewDevelopment()
	} else {
		zapLogger, err = zap.NewProduction()
	}
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}

	// Set the router
	r := mux.NewRouter()

	// set up server dependencies
	clientAddress := config.GetString(appconfig.ClientAddressKey)

	s := &Server{
		router:      r,
		Config:      config,
		logger:      zapLogger,
		environment: environment,
		pubsub:      pubsub.NewServicePubSub(),
	}

	// set up routes
	s.routes(
		newCORSMiddleware(clientAddress),
		NewTraceMiddleware(),
		NewLoggerMiddleware(s.logger, environment))

	return s
}

// Serve runs the server
func (s *Server) Serve() {

	useTLS := s.Config.GetBool("USE_TLS")
	if useTLS {
		serverCert, err := tls.X509KeyPair([]byte(s.Config.GetString("SERVER_CERT")), []byte(s.Config.GetString("SERVER_KEY")))
		if err != nil {
			s.logger.Fatal("Failed to parse key pair", zap.Error(err))
		}
		/* #nosec */
		srv := http.Server{
			Addr:    ":8443",
			Handler: s,
			TLSConfig: &tls.Config{
				Certificates: []tls.Certificate{serverCert},
				MinVersion:   tls.VersionTLS13,
			},
		}
		s.logger.Info("Serving application on port 8443")
		err = srv.ListenAndServeTLS("", "")
		if err != nil {
			s.logger.Fatal("Failed to start server on port 8443")
		}
	} else {
		/* #nosec */
		srv := http.Server{
			Addr:    ":8080",
			Handler: s,
		}
		s.logger.Info("Serving application on port 8080")
		err := srv.ListenAndServe()
		if err != nil {
			s.logger.Fatal("Failed to start server on port 8080")
		}
	}
}
