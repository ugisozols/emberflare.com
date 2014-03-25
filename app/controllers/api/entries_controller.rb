class Api::EntriesController < ApiController
  respond_to :json

  def index
    respond_with Entry.includes(:user)
  end

  def show
    respond_with Entry.friendly.find(params[:id])
  end

  def create
    entry = Entry.create(entry_params)

    respond_with entry, :location => api_entries_path
  end

  private

  def entry_params
    permitted_params = params.require(:entry).permit(:title, :body, :author_name)

    permitted_params.merge! :user_id => current_user.id if current_user

    permitted_params
  end
end
