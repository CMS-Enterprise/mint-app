import {
  useAddPlanFavoriteMutation,
  useDeletePlanFavoriteMutation
} from 'gql/gen/graphql';

// Custom hook to house the multiple mutations needed for toggling favorites

export default function useFavoritePlan() {
  const [addMutate] = useAddPlanFavoriteMutation();

  const [removeMutate] = useDeletePlanFavoriteMutation();

  const favoriteMutations = {
    removeFavorite: removeMutate,
    addFavorite: addMutate
  };

  return favoriteMutations;
}
