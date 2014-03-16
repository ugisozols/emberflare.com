def sign_in
  user = FactoryGirl.create(:user)

  visit "/signin"

  fill_in :username, :with => user.username
  fill_in :password, :with => user.password
  click_button "Sign in"
end
