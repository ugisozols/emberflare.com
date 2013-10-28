class SessionController < ApplicationController
  # respond_to :json

  def create
    user = User.authenticate(session_params[:identification], session_params[:password])

    # respond_with { :session => { :authToken => user.token }.to_json }.to_json
    render json: { :session => { :authToken => user.token } }
  end

  def destroy
  end

  private

  def session_params
    params.require(:session).permit(:identification, :password)
  end
end
