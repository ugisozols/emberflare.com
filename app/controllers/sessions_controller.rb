class SessionsController < ApplicationController
  def create
    user = User.find_by(:username => session_params[:username])

    if user && user.authenticate(session_params[:password])
      user.update_attribute :token, SecureRandom.hex

      render json: user, :serializer => SessionSerializer, :root => false
    else
      head 401
    end
  end

  private

  def session_params
    params.permit(:username, :password, :grant_type)
  end
end
