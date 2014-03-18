require "spec_helper"

feature "signing in", :js => true do
  scenario "signing in with valid credentials" do
    user = FactoryGirl.create(:user)

    visit "/"

    click_link "Sign in"

    fill_in :username, :with => user.username
    fill_in :password, :with => user.password
    click_button "Sign in"

    expect(page).to have_selector("a[id=signout]")
  end

  scenario "signing in with invalid credentials" do
    visit "/"

    click_link "Sign in"

    fill_in :username, :with => "flareember"
    fill_in :password, :with => "654321"
    click_button "Sign in"

    expect(page).to have_content("Sign in failed! Either the username or password was incorrect.")
  end
end

