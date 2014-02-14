class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :author_name, :author_email, :created_at

  def author_name
    user ? user.username : object.author
  end

  def author_email
    user ? user.email : ""
  end

  private

  def user
    object.user
  end
end
