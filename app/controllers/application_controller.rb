class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :null_session

  def current_user
    @current_user ||= begin
      auth_token = request.env['HTTP_X_AUTHENTICATION_TOKEN']
      User.find_by(:token => auth_token) if !!auth_token
    end
  end

  private

  def auth_only!
    if current_user.nil?
      render json: {}, status: 401
    end
  end
end
