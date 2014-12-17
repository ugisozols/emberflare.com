class Api::AccountController < ApiController
  def show
    render json: current_user, serializer: AccountSerializer
  end

  def update
    current_user.update_attrs(account_params)

    render json: current_user, serializer: AccountSerializer
  end

  private

  def account_params
    params.require(:account).permit(:email, :old_password, :new_password)
  end
end
