class Api::SessionsController < ApplicationController
  def create
    if session_params[:token]
      u = User.find_by(:token => session_params[:token])
    else
      u = User.find_by(:username => session_params[:username], :password => session_params[:password])
      if u
        u.token = SecureRandom.hex(16)
        u.save!
      end
    end

    if u
      render json: { token: u.token }, status: 200
    else
      render json: {}, status: 401
    end
  end

  private

  def session_params
    params.require(:session).permit(:username, :password, :token)
  end
end
