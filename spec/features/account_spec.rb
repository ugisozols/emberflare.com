require "spec_helper"

feature "account", :js => true do
  context "when not signed in" do
    it "redirects to sign in page" do
      visit "/account"

      expect(page.current_path).to eq("/signin")
    end
  end

  context "when signed in" do
    before { sign_in }

    context "when valid data" do
      scenario "successful update" do
        find('#account').click

        fill_in :email, :with => "random@email.com"
        click_button "Update"

        expect(page).to have_content("Account was updated successfuly.")
        expect(page).to have_selector("img[src*='#{Digest::MD5.hexdigest('random@email.com')}']")
      end
    end

    context "when invalid data" do
      scenario "failed update" do
        find('#account').click

        fill_in :email, :with => ""
        click_button "Update"

        expect(page).to have_content("Account failed to update. Please make sure that the data you entered comforms to the rules mentioned below.")
      end
    end
  end
end
