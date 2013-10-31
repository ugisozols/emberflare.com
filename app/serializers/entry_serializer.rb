class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :author, :username

  def username
    if (user = object.user)
      user.username
    else
      object.author
    end
  end
end
