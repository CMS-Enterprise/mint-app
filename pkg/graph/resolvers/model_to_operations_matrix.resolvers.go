package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// Categories is the resolver for the categories field.
func (r *modelsToOperationMatrixResolver) Categories(ctx context.Context, obj *models.ModelsToOperationMatrix) ([]*models.MTOCategory, error) {
	return MTOCategoryGetByModelPlanIDLOADER(ctx, obj.ModelPlan.ID)
}

// CommonMilestones is the resolver for the commonMilestones field.
func (r *modelsToOperationMatrixResolver) CommonMilestones(ctx context.Context, obj *models.ModelsToOperationMatrix) ([]*model.CommonMilestone, error) {
	panic(fmt.Errorf("not implemented: CommonMilestones - commonMilestones"))
	// Fetch a list of common milestone rows with the additional context for properties like `isAdded` and `isSuggested`
}

// Solutions is the resolver for the solutions field.
func (r *modelsToOperationMatrixResolver) Solutions(ctx context.Context, obj *models.ModelsToOperationMatrix) ([]*model.MTOSolution, error) {
	panic(fmt.Errorf("not implemented: Solutions - solutions"))
}

// ModelsToOperationMatrix returns generated.ModelsToOperationMatrixResolver implementation.
func (r *Resolver) ModelsToOperationMatrix() generated.ModelsToOperationMatrixResolver {
	return &modelsToOperationMatrixResolver{r}
}

type modelsToOperationMatrixResolver struct{ *Resolver }