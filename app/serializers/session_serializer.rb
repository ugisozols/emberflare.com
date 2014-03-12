class SessionSerializer < ActiveModel::Serializer
  attributes :username, :email, :access_token, :token_type

  def username
    object.username
  end

  def email
    object.email
  end

  def access_token
    object.token
  end

  def token_type
    "bearer"
  end
end
