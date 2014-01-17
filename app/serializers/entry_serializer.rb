class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :author

  def author
    if (user = object.user)
      user.username
    else
      object.author
    end
  end
end
