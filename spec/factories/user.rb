FactoryGirl.define do
  factory :user do
    sequence(:username) { |n| "emberflare#{n}" }
    password "123456"
    sequence(:email) { |n| "emberflare#{n}@example.com" }
  end
end
