class Api::UsersController < ApiController
  def create
    user = User.new(user_params)

    if user.save
      render json: user, location: "/signin"
    else
      head 400
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
