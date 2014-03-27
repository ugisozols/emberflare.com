class AccountSerializer < ActiveModel::Serializer
  attributes :id, :email, :gravatar_email_hash

  def id
    "current_user"
  end

  def gravatar_email_hash
    Digest::MD5.hexdigest(object.email)
  end
end
