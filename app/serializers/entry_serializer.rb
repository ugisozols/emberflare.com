class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :author
end
