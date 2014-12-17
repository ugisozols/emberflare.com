class Api::EntriesController < ApiController
  def index
    render json: Entry.includes(:user)
  end

  def show
    render json: Entry.friendly.find(params[:id])
  end

  def create
    entry = Entry.create(entry_params)

    render json: entry, location: api_entries_path
  end

  private

  def entry_params
    permitted_params = params.require(:entry).permit(:title, :body, :author_name)

    permitted_params.merge! user_id: current_user.id if current_user

    permitted_params
  end
end
