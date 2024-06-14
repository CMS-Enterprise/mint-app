package resolvers

func (s *ResolverSuite) TestUserViewCustomizationGetByUserID() {
	uvc, err := UserViewCustomizationGetByUserID(s.testConfigs.Logger, s.testConfigs.Store, s.testConfigs.Principal)
	s.NoError(err)
	s.NotNil(uvc)
}

func (s *ResolverSuite) TestUserViewCustomizationUpdate() {
	uvc, err := UserViewCustomizationGetByUserID(s.testConfigs.Logger, s.testConfigs.Store, s.testConfigs.Principal)
	s.NoError(err)
	s.NotNil(uvc)
	changes := map[string]interface{}{
		"viewCustomization": []string{"MyModelPlans"},
	}
	updatedUVC, err := UserViewCustomizationUpdate(s.testConfigs.Logger, s.testConfigs.Store, s.testConfigs.Principal, changes)
	s.NoError(err)
	s.NotNil(updatedUVC)

	s.EqualValues([]string{"MyModelPlans"}, updatedUVC.ViewCustomization)
}
