class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :null_session

  def current_user
    @current_user ||= begin
      auth_token = request.env["HTTP_AUTHORIZATION"][/\w+\Z/]
      User.find_by(:token => auth_token)
    end
  end
end
