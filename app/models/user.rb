class User < ActiveRecord::Base
  def self.authenticate(username, password)
    user = find_by(:username => username, :password => password)

    if user
      user.token = SecureRandom.hex(16)
      user.save!
    end

    user
  end
end
