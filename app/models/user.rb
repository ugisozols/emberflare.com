class User < ActiveRecord::Base
  validates :username, :length => { :minimum => 2, :maximum => 50 },
    :uniqueness => true
  validates :password, :length => { :minimum => 6, :maximum => 50 }
  validates :email, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i },
    :uniqueness => true

  has_secure_password
end
