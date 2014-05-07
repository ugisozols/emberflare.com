require "spec_helper"

feature "entries", :js => true do
  context "when not signed in" do
    scenario "adding entry" do
      visit "/"

      click_link "Submit"

      fill_in :inputAuthor, :with => "Test author"
      fill_in :inputTitle, :with => "Testing title"
      fill_in :inputBody, :with => "This is a test content"
      click_button "Submit"

      expect(page).to have_content("Test author")
      expect(page).to have_content("Testing title")
      expect(page).to have_content("This is a test content")
    end
  end

  context "when signed in" do
    before { sign_in }

    scenario "adding entry" do
      click_link "Submit"

      expect(page).to have_no_selector("input[id=inputAuthor]")

      fill_in :inputTitle, :with => "Testing title"
      fill_in :inputBody, :with => "This is a test content"
      click_button "Submit"

      expect(page).to have_content("Testing title")
      expect(page).to have_content("This is a test content")
    end
  end

  scenario "viewing entry" do
    entry = FactoryGirl.create(:entry, :title => "Test entry",
      :body => "Test content")

    visit("/entries")

    click_link "Test entry"

    expect(page).to have_content("Test entry")
    expect(page).to have_content("Test content")
  end
end
