class SessionsController < ApplicationController
  def create
    user = User.find_by(:username => session_params[:username],
                        :password => session_params[:password])
    if user
      user.token = SecureRandom.hex
      user.save!
      render json: { access_token: user.token, token_type: 'bearer' }
    else
      head 401
    end
  end

  private

  def session_params
    params.permit(:username, :password, :grant_type)
  end
end
