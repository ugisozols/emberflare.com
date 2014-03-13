class Api::UsersController < ApiController
  respond_to :json

  def create
    user = User.create(user_params)

    respond_with user, :location => "/signin"
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
