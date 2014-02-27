class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= access_token && User.find_by(:token => access_token)
  end

  def access_token
    @access_token ||= request.authorization && request.authorization.split(' ').last
  end
end
