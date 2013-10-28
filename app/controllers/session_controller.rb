class SessionController < ApplicationController
  # respond_to :json

  def create
    user = User.authenticate(params[:username], params[:password])

    # respond_with { :session => { :authToken => user.token }.to_json }.to_json
    render json: { "access_token" => user.token, "token_type" => "bearer" }
  end

  def destroy
  end
end
