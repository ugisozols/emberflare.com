class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :author, :created_at

  def author
    if (user = object.user)
      user.username
    else
      object.author
    end
  end
end
