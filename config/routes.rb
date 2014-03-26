EmberFlare::Application.routes.draw do
  root :to => "static#index"

  post "token" => "sessions#create"

  namespace :api do
    resources :entries, :only => [:index, :show, :create]
    resources :users, :only => [:create]
  end

  resources :rss, :only => [:index]
  get "/sitemap.xml" => "sitemap#index", :defaults => { :format => "xml" }

  get "/*path" => "static#index"
end
