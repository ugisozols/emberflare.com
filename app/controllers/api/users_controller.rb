class Api::UsersController < ApiController
  def create
    user = User.create(user_params)

    render json: user, location: "/signin"
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
