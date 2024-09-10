package server

import (
	"context"
	"errors"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	mail "github.com/xhit/go-simple-mail/v2"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/oktaapi"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
	"github.com/cmsgov/mint-app/pkg/worker"

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

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/handlers"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/okta"
	"github.com/cmsgov/mint-app/pkg/s3"
	"github.com/cmsgov/mint-app/pkg/services"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// HandleLocalOrOktaWebSocketAuth is a function that effectively acts as a wrapper around 2 functions that can serve as a transport.WebSocket "InitFunc"
// This function looks at the initial payload sent when authenticating a websocket connection, and chooses the appropriate authentication middleware
// to use (in the case of Authorization headers beginning with "Local", it will use package "local"s local.NewLocalWebSocketAuthenticationMiddleware, and in any other case will
// use package "okta"s NewOktaWebSocketAuthenticationMiddleware)
//
// This function requires the OktaMiddlewareFactory object because it, in some cases (as described above), needs to perform operations that decode JWTs, which is a responsibility of
// some of the functions attached to that factory. A refactor to clean up this cross-package dependency was considered but determined to be too much effort. (Don't hurt me)
func HandleLocalOrOktaWebSocketAuth(omf *okta.MiddlewareFactory) transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
		authToken := initPayload["authToken"]
		token, ok := authToken.(string)
		if !ok || token == "" {
			return nil, errors.New("authToken not found in transport payload")
		}

		localToken := strings.HasPrefix(token, "Local ")
		if localToken {
			return local.NewLocalWebSocketAuthenticationMiddleware(omf.Store)(ctx, initPayload)
		}
		return omf.NewOktaWebSocketAuthenticationMiddleware()(ctx, initPayload)
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
		s.NewDBConfig(),
		ldClient,
	)
	if storeErr != nil {
		s.logger.Fatal("Failed to create store", zap.Error(storeErr))
	}

	oktaConfig := s.NewOktaClientConfig()
	jwtVerifier := okta.NewJwtVerifier(oktaConfig.OktaClientID, oktaConfig.OktaIssuer)

	oktaMiddlewareFactory := okta.NewMiddlewareFactory(
		handlers.NewHandlerBase(),
		jwtVerifier,
		store,
		!s.environment.Prod(),
		ldClient,
	)

	s.router.Use(
		traceMiddleware, // trace all requests with an ID
		loggerMiddleware,
		corsMiddleware,
		oktaMiddlewareFactory.NewAuthenticationMiddleware,
	)

	if s.NewLocalAuthIsEnabled() {
		localAuthenticationMiddleware := local.NewLocalAuthenticationMiddleware(store)
		s.router.Use(localAuthenticationMiddleware)
	}
	dataLoaders := loaders.NewDataLoaders(store)
	dataLoaderMiddleware := loaders.NewDataLoaderMiddleware(dataLoaders)
	s.router.Use(dataLoaderMiddleware)

	userAccountServiceMiddleware := userhelpers.NewUserAccountServiceMiddleware(userhelpers.UserAccountGetByIDLOADER)

	s.router.Use(userAccountServiceMiddleware)

	requirePrincipalMiddleware := authorization.NewRequirePrincipalMiddleware()

	// set up handler base
	base := handlers.NewHandlerBase()

	// endpoints that dont require authorization go directly on the main router
	s.router.HandleFunc("/api/v1/healthcheck", handlers.NewHealthCheckHandler(base, s.Config).Handle())
	s.router.HandleFunc("/api/graph/playground", playground.Handler("GraphQL playground", "/api/graph/query"))

	// Create Okta API Client
	var oktaClient oktaapi.Client
	var oktaClientErr error
	if s.environment.Local() {
		// Ensure Okta API Variables are set
		oktaClient, oktaClientErr = local.NewOktaAPIClient()
		if oktaClientErr != nil {
			s.logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
		}
	} else {
		// Ensure Okta API Variables are set
		s.NewOktaAPIClientCheck()
		oktaClient, oktaClientErr = oktaapi.NewClient(s.Config.GetString(appconfig.OKTAApiURL), s.Config.GetString(appconfig.OKTAAPIToken))
		if oktaClientErr != nil {
			s.logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
		}
	}

	// This is a bit of a hack... sorry...
	// Okta API tokens expire every 30 days if unused. This call to the Okta API below is strictly to ensure that the token is used whenever we deploy or
	// create a new instance of the app. This should probably be a cron job, but this is the quick fix that helps us not have to worry about this for the time being.
	_, err = oktaClient.SearchByName(context.Background(), "MINT") // shouldn't return any results, but that's ok, we used the token
	if err != nil {
		s.logger.Warn("failed to use okta api token on API client creation", zap.Error(err))
	}

	// set up Email Template Service
	emailTemplateService, err := email.NewTemplateServiceImpl()
	if err != nil {
		s.logger.Fatal("Failed to create an email template service", zap.Error(err))
	}

	// Set up Oddball email Service
	emailServiceConfig := oddmail.GoSimpleMailServiceConfig{}
	emailServiceConfig.Enabled = s.Config.GetBool(appconfig.EmailEnabledKey)
	emailServiceConfig.Host = s.Config.GetString(appconfig.EmailHostKey)
	emailServiceConfig.Port = s.Config.GetInt(appconfig.EmailPortKey)
	emailServiceConfig.ClientAddress = s.Config.GetString(appconfig.ClientAddressKey)
	emailServiceConfig.TaggedPOCEmailEnabled = s.Config.GetBool(appconfig.TaggedSolutionPointOfContactEmailEnabled)

	// dynamically set emails encryption based on environment
	// No encryption is needed when using mailcatcher (local or testing)
	// STARTTLS is needed when deployed (and using CMS email server), otherwise you'll get errors with "Must issue a STARTTLS command first"
	//
	// Documentation on CMS Email Servers can be found here
	// https://cloud.cms.gov/introduction-email-as-service
	emailServiceConfig.Encryption = mail.EncryptionNone
	if s.environment.Deployed() {
		emailServiceConfig.Encryption = mail.EncryptionSTARTTLS
	}

	dateChangedRecipientEmails := strings.Split(s.Config.GetString(appconfig.DateChangedRecipientEmailsKey), ",")

	addressBook := email.AddressBook{
		DefaultSender:                  s.Config.GetString(appconfig.EmailSenderKey),
		MINTTeamEmail:                  s.Config.GetString(appconfig.MINTTeamEmailKey),
		ModelPlanDateChangedRecipients: dateChangedRecipientEmails,
		DevTeamEmail:                   s.Config.GetString(appconfig.DevTeamEmailKey),
	}

	var emailService *oddmail.GoSimpleMailService
	emailService, err = oddmail.NewGoSimpleMailService(emailServiceConfig)
	if err != nil {
		s.logger.Fatal("Failed to create an email service", zap.Error(err))
	}

	// set up S3 client
	s3Config := s.NewS3Config()
	echimpS3config := s.NewEChimpS3Config()
	if s.environment.Local() || s.environment.Testing() {
		s3Config.IsLocal = true
		echimpS3config.IsLocal = true
	}

	s3Client := s3.NewS3Client(s3Config)
	echimpS3Client := s3.NewS3Client(echimpS3config)

	var lambdaClient *lambda.Lambda
	var princeLambdaName string
	lambdaSession := session.Must(session.NewSession())

	princeConfig := s.NewPrinceLambdaConfig()
	princeLambdaName = princeConfig.FunctionName

	if s.environment.Local() || s.environment.Testing() {
		endpoint := princeConfig.Endpoint
		lambdaClient = lambda.New(lambdaSession, &aws.Config{Endpoint: &endpoint, Region: aws.String("us-west-2")})
	} else {
		lambdaClient = lambda.New(lambdaSession, &aws.Config{})
	}

	serviceConfig := services.NewConfig(s.logger, ldClient)

	// set up GraphQL routes
	gql := s.router.PathPrefix("/api/graph").Subrouter()

	// gql.Use(requirePrincipalMiddleware)
	resolver := resolvers.NewResolver(
		store,
		resolvers.ResolverService{
			FetchUserInfo: oktaClient.FetchUserInfo,
			SearchByName:  oktaClient.SearchByName,
		},
		&s3Client,
		&echimpS3Client,
		emailService,
		emailTemplateService,
		addressBook,
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
				return nil, apperrors.New("not authorized", apperrors.InsufficientRoleError)
			}
			return next(ctx)

		},
		HasAnyRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, roles []model.Role) (res interface{}, err error) {
			hasRole, err := services.HasAnyRole(ctx, roles)
			if err != nil {
				return nil, err
			}
			if !hasRole {
				return nil, apperrors.New("not authorized", apperrors.InsufficientRoleError)
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
		InitFunc: HandleLocalOrOktaWebSocketAuth(oktaMiddlewareFactory),
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

	// Setup faktory worker
	s.Worker = &worker.Worker{
		Store:                store,
		Logger:               s.logger,
		EmailService:         emailService,
		EmailTemplateService: *emailTemplateService,
		AddressBook:          addressBook,
		Connections:          s.Config.GetInt(appconfig.FaktoryConnections),
		ProcessJobs:          s.Config.GetBool(appconfig.FaktoryProcessJobs) && !s.environment.Testing(),
	}

	if ok, _ := strconv.ParseBool(os.Getenv("DEBUG_ROUTES")); ok {
		s.logger.Debug("debugging routes")
		// useful for debugging route issues
		_ = s.router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
			pathTemplate, err := route.GetPathTemplate()
			if err == nil {
				s.logger.Debug("ROUTE: ", zap.String("ROUTE", pathTemplate))
			}
			pathRegexp, err := route.GetPathRegexp()
			if err == nil {
				s.logger.Debug("Path regexp:", zap.String("Path regexp", pathRegexp))
			}
			queriesTemplates, err := route.GetQueriesTemplates()
			if err == nil {
				s.logger.Debug("Queries templates:", zap.String("Queries templates", strings.Join(queriesTemplates, ",")))
			}
			queriesRegexps, err := route.GetQueriesRegexp()
			if err == nil {
				s.logger.Debug("Queries regexps:", zap.String("Queries regexps", strings.Join(queriesRegexps, ",")))
			}
			methods, err := route.GetMethods()
			if err == nil {
				s.logger.Debug("Methods:", zap.String("Methods", strings.Join(methods, ",")))
			}
			s.logger.Debug("debugging routes end")
			return nil
		})
	}
}
