import { useMutation } from '@apollo/client';

import AddPlanFavorite from 'queries/Favorite/AddPlanFavorite';
import DeletePlanFavorite from 'queries/Favorite/DeletePlanFavorite';
import { AddPlanFavoriteVariables } from 'queries/Favorite/types/AddPlanFavorite';
import { DeletePlanFavoriteVariables } from 'queries/Favorite/types/DeletePlanFavorite';

export default function useFavoritePlan() {
  const [addMutate] = useMutation<AddPlanFavoriteVariables>(AddPlanFavorite);

  const [removeMutate] = useMutation<DeletePlanFavoriteVariables>(
    DeletePlanFavorite
  );

  const favoriteMutations = {
    removeFavorite: removeMutate,
    addFavorite: addMutate
  };

  return favoriteMutations;
}
