require "spec_helper"

feature "signing up", :js => true do
  scenario "signing up with valid data" do
    visit root_path

    click_link "Sign up"

    fill_in :username, :with => "emberflare"
    fill_in :password, :with => "123456"
    fill_in :email, :with => "embeflare@example.com"
    click_button "Sign up"

    expect(page).to have_content("Sign in")
  end

  scenario "signing up with invalid data" do
    visit root_path

    click_link "Sign up"

    fill_in :username, :with => "ef"
    fill_in :password, :with => "12"
    fill_in :email, :with => "embeflare"
    click_button "Sign up"

    expect(page).to have_content("Signup failed! Please double check that the values you provided meet the requirements mentioned below.")
  end
end

