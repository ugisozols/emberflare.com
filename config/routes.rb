EmberFlare::Application.routes.draw do
  root :to => "static#index"

  post "token" => "sessions#create"

  namespace :api do
    resources :entries, :only => [:index, :create]
  end

  get "/*path" => "static#index"
end
