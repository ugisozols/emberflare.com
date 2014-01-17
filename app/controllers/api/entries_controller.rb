class Api::EntriesController < ApiController
  respond_to :json

  def index
    respond_with Entry.includes(:user)
  end

  def create
    entry = Entry.new(entry_params)

    if entry.save
      render json: entry
    else
      render json: entry, status: 422
    end
  end

  private

  def entry_params
    permitted_params = params.require(:entry).permit(:title, :content, :author)

    permitted_params.merge! :user_id => current_user.id if current_user

    permitted_params
  end
end
