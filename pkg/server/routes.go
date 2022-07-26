package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq" // pq is required to get the postgres driver into sqlx
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/appses"
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

func (s *Server) routes(
	corsMiddleware func(handler http.Handler) http.Handler,
	traceMiddleware func(handler http.Handler) http.Handler,
	loggerMiddleware func(handler http.Handler) http.Handler) {

	oktaConfig := s.NewOktaClientConfig()
	jwtVerifier := okta.NewJwtVerifier(oktaConfig.OktaClientID, oktaConfig.OktaIssuer)

	oktaAuthenticationMiddleware := okta.NewOktaAuthenticationMiddleware(
		handlers.NewHandlerBase(s.logger),
		jwtVerifier,
		oktaConfig.AltJobCodes,
	)

	s.router.Use(
		traceMiddleware, // trace all requests with an ID
		loggerMiddleware,
		corsMiddleware,
		oktaAuthenticationMiddleware,
	)

	if s.NewLocalAuthIsEnabled() {
		localAuthenticationMiddleware := local.NewLocalAuthenticationMiddleware(s.logger)
		s.router.Use(localAuthenticationMiddleware)
	}

	requirePrincipalMiddleware := authorization.NewRequirePrincipalMiddleware(s.logger)

	// set up handler base
	base := handlers.NewHandlerBase(s.logger)

	// endpoints that dont require authorization go directly on the main router
	s.router.HandleFunc("/api/v1/healthcheck", handlers.NewHealthCheckHandler(base, s.Config).Handle())
	s.router.HandleFunc("/api/graph/playground", playground.Handler("GraphQL playground", "/api/graph/query"))

	// set up Feature Flagging utilities
	ldClient, err := flags.NewLaunchDarklyClient(s.NewFlagConfig())
	if err != nil {
		s.logger.Fatal("Failed to create LaunchDarkly client", zap.Error(err))
	}

	var cedarLDAPClient cedarldap.Client
	cedarLDAPClient = cedarldap.NewTranslatedClient(
		s.Config.GetString(appconfig.CEDARAPIURL),
		s.Config.GetString(appconfig.CEDARAPIKey),
	)
	if s.environment.Local() || s.environment.Test() {
		cedarLDAPClient = local.NewCedarLdapClient(s.logger)
	}

	// set up Email Client
	sesConfig := s.NewSESConfig()
	sesSender := appses.NewSender(sesConfig)
	emailConfig := s.NewEmailConfig()
	emailClient, err := email.NewClient(emailConfig, sesSender)
	if err != nil {
		s.logger.Fatal("Failed to create email client", zap.Error(err))
	}
	// override email client with local one
	if s.environment.Local() || s.environment.Test() {
		localSender := local.NewSender()
		emailClient, err = email.NewClient(emailConfig, localSender)
		if err != nil {
			s.logger.Fatal("Failed to create email client", zap.Error(err))
		}
	}

	if s.environment.Deployed() {
		s.CheckEmailClient(emailClient)
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

	store, storeErr := storage.NewStore(
		s.logger,
		s.NewDBConfig(),
		ldClient,
	)
	if storeErr != nil {
		s.logger.Fatal("Failed to create store", zap.Error(storeErr))
	}

	serviceConfig := services.NewConfig(s.logger, ldClient)

	// set up GraphQL routes
	gql := s.router.PathPrefix("/api/graph").Subrouter()

	gql.Use(requirePrincipalMiddleware)

	resolver := graph.NewResolver(
		store,
		graph.ResolverService{
			FetchUserInfo:            cedarLDAPClient.FetchUserInfo,
			SearchCommonNameContains: cedarLDAPClient.SearchCommonNameContains,
		},
		&s3Client,
		&emailClient,
		ldClient,
		s.pubsub,
	)
	gqlDirectives := generated.DirectiveRoot{HasRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (res interface{}, err error) {
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
	graphqlServer := handler.NewDefaultServer(generated.NewExecutableSchema(gqlConfig))
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
	// endpoint for short-lived backfill process
	// backfillHandler := handlers.NewBackfillHandler(
	// 	base,
	// 	services.NewBackfill(
	// 		serviceConfig,
	// 		store.FetchSystemIntakeByID,
	// 		store.FetchSystemIntakeByLifecycleID,
	// 		store.CreateSystemIntake,
	// 		store.UpdateSystemIntake,
	// 		store.CreateNote,
	// 		services.AuthorizeHasEASiRole,
	// 	),
	// )
	// api.Handle("/backfill", backfillHandler.Handle())

}
