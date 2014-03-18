class SessionSerializer < ActiveModel::Serializer
  attributes :username, :gravatar_email_hash, :access_token, :token_type

  def username
    object.username
  end

  def gravatar_email_hash
    Digest::MD5.hexdigest(object.email)
  end

  def access_token
    object.token
  end

  def token_type
    "bearer"
  end
end
