class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :email
end
