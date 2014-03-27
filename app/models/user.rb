class User < ActiveRecord::Base
  validates :username, :length => { :minimum => 2, :maximum => 50 },
    :uniqueness => true
  validates :password, :length => { :minimum => 6, :maximum => 50 },
    :allow_nil => true
  validates :email, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i },
    :uniqueness => true

  has_secure_password

  def update_attrs(params)
    params_to_update = params.slice(:email)

    if BCrypt::Password.new(password_digest) == params[:old_password]
      params_to_update.merge! :password => params[:new_password]
    end

    self.update_attributes(params_to_update)
  end
end
