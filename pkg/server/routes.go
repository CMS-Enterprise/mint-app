package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/authorization"
	"github.com/cmsgov/mint-app/pkg/cedar/cedarldap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/handlers"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/okta"
	"github.com/cmsgov/mint-app/pkg/services"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"
)

// HandleLocalOrOktaWebSocketAuth is a function that effectively acts as a wrapper around 2 functions that can serve as a transport.WebSocket "InitFunc"
// This function looks at the initial payload sent when authenticating a websocket connection, and chooses the appropriate authentication middleware
// to use (in the case of Authorization headers beginning with "Local", it will use package "local"s local.NewLocalWebSocketAuthenticationMiddleware, and in any other case will
// use package "okta"s NewOktaWebSocketAuthenticationMiddleware)
//
// This function requires the OktaMiddlewareFactory object because it, in some cases (as described above), needs to perform operations that decode JWTs, which is a responsibility of
// some of the functions attached to that factory. A refactor to clean up this cross-package dependency was considered but determined to be too much effort. (Don't hurt me)
func HandleLocalOrOktaWebSocketAuth(logger *zap.Logger, omf *okta.MiddlewareFactory) transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
		authToken := initPayload["authToken"]
		token, ok := authToken.(string)
		if !ok || token == "" {
			return nil, errors.New("authToken not found in transport payload")
		}

		localToken := strings.HasPrefix(token, "Local ")
		if localToken {
			return local.NewLocalWebSocketAuthenticationMiddleware(logger, omf.Store)(ctx, initPayload)
		}
		return omf.NewOktaWebSocketAuthenticationMiddleware(logger)(ctx, initPayload)
	}
}

func (s *Server) routes(
	corsMiddleware func(handler http.Handler) http.Handler,
	traceMiddleware func(handler http.Handler) http.Handler,
	loggerMiddleware func(handler http.Handler) http.Handler) {

	// set up Feature Flagging utilities
	ldClient, err := flags.NewLaunchDarklyClient(s.NewFlagConfig())
	if err != nil {
		s.logger.Fatal("Failed to create LaunchDarkly client", zap.Error(err))
	}

	store, storeErr := storage.NewStore(
		s.logger,
		s.NewDBConfig(),
		ldClient,
	)
	if storeErr != nil {
		s.logger.Fatal("Failed to create store", zap.Error(storeErr))
	}

	oktaConfig := s.NewOktaClientConfig()
	jwtVerifier := okta.NewJwtVerifier(oktaConfig.OktaClientID, oktaConfig.OktaIssuer)

	oktaMiddlewareFactory := okta.NewMiddlewareFactory(
		handlers.NewHandlerBase(s.logger),
		jwtVerifier,
		store,
	)

	s.router.Use(
		traceMiddleware, // trace all requests with an ID
		loggerMiddleware,
		corsMiddleware,
		oktaMiddlewareFactory.NewAuthenticationMiddleware,
	)

	if s.NewLocalAuthIsEnabled() {
		localAuthenticationMiddleware := local.NewLocalAuthenticationMiddleware(s.logger, store)
		s.router.Use(localAuthenticationMiddleware)
	}

	requirePrincipalMiddleware := authorization.NewRequirePrincipalMiddleware(s.logger)

	// set up handler base
	base := handlers.NewHandlerBase(s.logger)

	// endpoints that dont require authorization go directly on the main router
	s.router.HandleFunc("/api/v1/healthcheck", handlers.NewHealthCheckHandler(base, s.Config).Handle())
	s.router.HandleFunc("/api/graph/playground", playground.Handler("GraphQL playground", "/api/graph/query"))

	var cedarLDAPClient cedarldap.Client
	cedarLDAPClient = cedarldap.NewTranslatedClient(
		s.Config.GetString(appconfig.CEDARAPIURL),
		s.Config.GetString(appconfig.CEDARAPIKey),
	)
	if s.environment.Local() || s.environment.Test() {
		cedarLDAPClient = local.NewCedarLdapClient(s.logger)
	}

	// set up Email Template Service
	emailTemplateService, err := email.NewTemplateServiceImpl()
	if err != nil {
		s.logger.Fatal("Failed to create an email template service", zap.Error(err))
	}

	// Set up Oddball email Service
	emailServiceConfig := oddmail.GoSimpleMailServiceConfig{}
	emailServiceConfig.Enabled = s.environment.Local()
	emailServiceConfig.Host = s.Config.GetString(appconfig.EmailHostKey)
	emailServiceConfig.Port = s.Config.GetInt(appconfig.EmailPortKey)
	emailServiceConfig.ClientAddress = s.Config.GetString(appconfig.ClientAddressKey)
	emailServiceConfig.DefaultSender = "no-reply@mint.cms.gov"

	var emailService *oddmail.GoSimpleMailService
	emailService, err = oddmail.NewGoSimpleMailService(emailServiceConfig)
	if err != nil {
		s.logger.Fatal("Failed to create an email service", zap.Error(err))
	}

	// set up S3 client
	s3Config := s.NewS3Config()
	if s.environment.Local() || s.environment.Test() {
		s3Config.IsLocal = true
	}

	s3Client := upload.NewS3Client(s3Config)

	var lambdaClient *lambda.Lambda
	var princeLambdaName string
	lambdaSession := session.Must(session.NewSession())

	princeConfig := s.NewPrinceLambdaConfig()
	princeLambdaName = princeConfig.FunctionName

	if s.environment.Local() || s.environment.Test() {
		endpoint := princeConfig.Endpoint
		lambdaClient = lambda.New(lambdaSession, &aws.Config{Endpoint: &endpoint, Region: aws.String("us-west-2")})
	} else {
		lambdaClient = lambda.New(lambdaSession, &aws.Config{})
	}

	serviceConfig := services.NewConfig(s.logger, ldClient)

	// set up GraphQL routes
	gql := s.router.PathPrefix("/api/graph").Subrouter()

	// gql.Use(requirePrincipalMiddleware)

	resolver := graph.NewResolver(
		store,
		graph.ResolverService{
			FetchUserInfo:            cedarLDAPClient.FetchUserInfo,
			SearchCommonNameContains: cedarLDAPClient.SearchCommonNameContains,
		},
		&s3Client,
		emailService,
		emailTemplateService,
		ldClient,
		s.pubsub,
	)
	gqlDirectives := generated.DirectiveRoot{
		HasRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (res interface{}, err error) {
			hasRole, err := services.HasRole(ctx, role)
			if err != nil {
				return nil, err
			}
			if !hasRole {
				return nil, errors.New("not authorized")
			}
			return next(ctx)

		}}
	gqlConfig := generated.Config{Resolvers: resolver, Directives: gqlDirectives}
	graphqlServer := handler.New(generated.NewExecutableSchema(gqlConfig))

	graphqlServer.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			Subprotocols: []string{"graphql-transport-ws"},
		},
		InitFunc: HandleLocalOrOktaWebSocketAuth(s.logger, oktaMiddlewareFactory),
	})
	graphqlServer.AddTransport(transport.Options{})
	graphqlServer.AddTransport(transport.GET{})
	graphqlServer.AddTransport(transport.POST{})
	graphqlServer.AddTransport(transport.MultipartForm{})

	graphqlServer.SetQueryCache(lru.New(1000))

	graphqlServer.Use(extension.Introspection{})
	graphqlServer.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})
	graphqlServer.Use(extension.FixedComplexityLimit(1000))
	graphqlServer.AroundResponses(NewGQLResponseMiddleware())

	gql.Handle("/query", graphqlServer)

	// API base path is versioned
	api := s.router.PathPrefix("/api/v1").Subrouter()
	api.Use(requirePrincipalMiddleware)

	metricsHandler := handlers.NewSystemIntakeMetricsHandler(
		base,
		services.NewFetchMetrics(serviceConfig),
	)
	api.Handle("/metrics", metricsHandler.Handle())

	s.router.PathPrefix("/").Handler(handlers.NewCatchAllHandler(
		base,
	).Handle())

	api.Handle("/pdf/generate", handlers.NewPDFHandler(services.NewInvokeGeneratePDF(serviceConfig, lambdaClient, princeLambdaName)).Handle())

	if ok, _ := strconv.ParseBool(os.Getenv("DEBUG_ROUTES")); ok {
		// useful for debugging route issues
		_ = s.router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
			pathTemplate, err := route.GetPathTemplate()
			if err == nil {
				fmt.Println("ROUTE:", pathTemplate)
			}
			pathRegexp, err := route.GetPathRegexp()
			if err == nil {
				fmt.Println("Path regexp:", pathRegexp)
			}
			queriesTemplates, err := route.GetQueriesTemplates()
			if err == nil {
				fmt.Println("Queries templates:", strings.Join(queriesTemplates, ","))
			}
			queriesRegexps, err := route.GetQueriesRegexp()
			if err == nil {
				fmt.Println("Queries regexps:", strings.Join(queriesRegexps, ","))
			}
			methods, err := route.GetMethods()
			if err == nil {
				fmt.Println("Methods:", strings.Join(methods, ","))
			}
			fmt.Println()
			return nil
		})
	}
}
